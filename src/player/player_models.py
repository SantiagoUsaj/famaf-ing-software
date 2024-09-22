import uuid
from fastapi import FastAPI, HTTPException, WebSocket, WebSocketDisconnect
from typing import List

class Player:
    def __init__(self, name: str, websocket:WebSocket):
        self.name = name
        self.playerid = str(uuid.uuid4())
        self.state = "not in game"
        self.websocket = websocket

    def enter_a_game(self):
        self.state = "in game"

