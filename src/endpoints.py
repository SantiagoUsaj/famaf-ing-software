from fastapi import FastAPI, WebSocket, WebSocketDisconnect, HTTPException
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
    try:
        if len(player_name) > 20 or not player_name.isalnum():
            raise ValueError("Player name must be less than 20 characters or alphanumeric")
        
        player = Player(player_name)
        playersBD[player.playerid] = player
        return player.playerid
    except ValueError as e:
        raise HTTPException(status_code=400, detail=str(e))

@app.post("/create_game/{player_id}/{game_name}/{game_size}")
async def create_game(player_id: str, game_name: str, game_size: int):
    try:
        if len(game_name) > 20 or not game_name.isalnum():
            raise ValueError("Game name must be less than 20 characters or alphanumeric")
        elif game_size < 2 or game_size > 4:
            raise ValueError("Game size must be between 2 and 4")
        elif player_id not in playersBD:
            raise HTTPException(status_code=404, detail="Player not found")
        else:
            game = Game(game_name, game_size)
            games[game.game_id] = game
            game.create_game(playersBD[player_id])
            global updatea
            update = True
            return game
    except ValueError as e:
        raise HTTPException(status_code=400, detail=str(e))

@app.put("/leave_game/{player_id}/{game_id}")
async def leave_game(player_id: str, game_id: str):
    if game_id not in games:
        raise HTTPException(status_code=404, detail="Game not found")
    elif player_id not in playersBD:
        raise HTTPException(status_code=404, detail="Player not found")
    else:
        game = games[game_id]

        if not any(player.playerid == player_id for player in game.players):
            raise HTTPException(status_code=404, detail="Player not found in game")
        elif get_host() == player_id:
            raise HTTPException(status_code=409, detail="You can't leave the game if you are the host")
        else:
            game.remove_player(playersBD[player_id])
            update=True
            return game

@app.put("/start_game/{player_id}/{game_id}")
async def start_game(player_id: str, game_id: str):
    if game_id not in games:
        raise HTTPException(status_code=404, detail="Game not found")
    elif player_id not in playersBD:
        raise HTTPException(status_code=404, detail="Player not found")
    else:
        game = games[game_id]

        if player_id != game.host:
            raise HTTPException(status_code=409, detail="Only the host can start the game")
        else:
            game.start_game()
            update = True
            return {"message": "Game started"}

@app.put("/join_game/{player_id}/{game_id}")
async def join_game(player_id: str, game_id: str): #chequear si el jugador ya esta en el juego
    
    if game_id not in games:
        raise HTTPException(status_code=404, detail="Game not found")
    elif player_id not in playersBD:
        raise HTTPException(status_code=404, detail="Player not found")
    else:
        game = games[game_id]

        if len(game.players) == game.size:
            raise HTTPException(status_code=409, detail="Game is full")
        elif any(player.playerid == player_id for player in game.players):
            raise HTTPException(status_code=409, detail="Player already in the game")
        else:
            game.add_player(playersBD[player_id])
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