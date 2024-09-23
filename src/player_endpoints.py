import uuid
from player_models import Player
from fastapi import FastAPI, HTTPException, WebSocket, WebSocketDisconnect

app = FastAPI()

players = {}

@app.get("/players")
async def get_players():
    return players

@app.post("/create_player/{player_name}")
async def create_player(player_name: str):
    player = Player(player_name)
    players[player.playerid] = player
    return player.playerid
