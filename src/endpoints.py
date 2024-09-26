from fastapi import FastAPI, WebSocket, WebSocketDisconnect
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import Dict
from fastapi.responses import HTMLResponse
from game_models import Game
from player_models import Player
from manager_models import ConnectionManager
app = FastAPI()

playersBD = {}
games = {}
manager = ConnectionManager()
update=False

# Configurar el middleware de CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"],  # Puedes permitir solo este origen o usar ["*"] para permitir todos
    allow_credentials=True,
    allow_methods=["*"],  # Permite todos los métodos (GET, POST, etc.)
    allow_headers=["*"],  # Permite todas las cabeceras
)

@app.get("/players_in_game/{game_id}")
async def get_players_in_game(game_id: str):
    if game_id not in games:
        return {"message": "Game not found"}
    else:
        game = games[game_id]
        return [{"player_name": player.name, "player_id": player.playerid} for player in game.players]

@app.get("/players")
async def get_players():
    return playersBD

@app.get("/games")
async def get_games():
    return games

@app.get("/game/{game_id}")
async def get_game(game_id: str):
    if game_id not in games:
        return {"message": "Game not found"}
    return games[game_id]

@app.get("/player/{player_id}")
async def get_player(player_id: str):
    if player_id not in playersBD:
        return {"message": "Player not found"}
    return playersBD[player_id]

@app.post("/create_player/{player_name}")
async def create_player(player_name: str):
    player = Player(player_name)
    playersBD[player.playerid] = player
    return player.playerid

@app.post("/create_game/{player_id}/{game_name}/{game_size}")
async def create_game(player_id: str, game_name: str, game_size: int):
    game = Game(game_name, game_size)
    games[game.game_id] = game
    game.host = player_id
    game.players.append(playersBD[player_id])
    playersBD[player_id].enter_a_game()
    global update
    update = True
    return game

@app.put("/leave_game/{player_id}/{game_id}")
async def leave_game(player_id: str, game_id: str):
    if game_id not in games:
        return {"message": "Game not found"}

    game = games[game_id]

    if not any(player.playerid == player_id for player in game.players):
        return {"message": "Player not in game"}
    else:
        game.players.remove(playersBD[player_id])
        playersBD[player_id].leave_a_game()

    update=True
    return game

@app.put("/start_game/{player_id}/{game_id}")
async def start_game(player_id: str, game_id: str):
    if game_id not in games:
        return {"message": "Game not found"}

    game = games[game_id]

    if player_id != game.host:
        return {"message": "Is not the owner"}
    else:
        game.start_game()
        update = True
        return {"message": "Game started"}

@app.put("/join_game/{player_id}/{game_id}")
async def join_game(player_id: str, game_id: str):
    if game_id not in games:
        return {"message": "Game not found"}
    
    game = games[game_id]

    if len(game.players) == game.size:
        return {"message": "Game is full"}

    game.players.append(playersBD[player_id])
    playersBD[player_id].enter_a_game()
    update = True
    return game

@app.websocket("/ws/{player_id}")
async def websocket_endpoint(websocket: WebSocket, player_id: str):
    await manager.connect(websocket)
    try:
        while True:
            data = await websocket.receive_text()
            if update:
                await manager.broadcast(games)
                update = False
    except WebSocketDisconnect:
        manager.disconnect(websocket)
        await manager.broadcast(f"Client #{player_id} left the chat")