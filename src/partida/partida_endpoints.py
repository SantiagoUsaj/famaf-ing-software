import uuid
from partida_models import Game
from fastapi import FastAPI, HTTPException, WebSocket, WebSocketDisconnect
from typing import List

app = FastAPI()

games = {}

@app.post("/create_game")
async def create_game(name: str, size: int):
    game_id = str(uuid.uuid4())
    games[game_id] = Game(name, size)
    return {"game_id": game_id}

@app.post("/join_game")
async def join_game(game_id: str):
    game = games.get(game_id)
    if not game:
        raise HTTPException(status_code=404, detail="Game not found")
    if len(game.players) >= 4:
        raise HTTPException(status_code=400, detail="Game is full")
    return {"message": "You can now connect to the game via WebSocket", "game_id": game_id}

@app.websocket("/ws/{game_id}")
async def websocket_endpoint(websocket: WebSocket, game_id: str):
    game = games.get(game_id)
    if not game:
        await websocket.close()
        raise HTTPException(status_code=404, detail="Game not found")
    await game.connect_player(websocket)
    try:
        while True:
            # Game logic here
            pass
    except Exception as e:
        game.disconnect_player(websocket)