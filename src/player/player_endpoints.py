import uuid
from player_models import Player
from partida_models import Game
from fastapi import FastAPI, HTTPException, WebSocket, WebSocketDisconnect

app = FastAPI()

players = {}

@app.post("/create_player/{player_id}/{name_player}")
async def create_player(player_name: str, webscket: WebSocket):
    Player(player_name, webscket)
    players[Player.player_id]
    return {"player_id": Player.player_id}