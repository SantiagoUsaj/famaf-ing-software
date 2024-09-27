import uuid
from fastapi import FastAPI, HTTPException, WebSocket, WebSocketDisconnect
from typing import List

class Player:
    def __init__(self, name: str):
        self.name = name
        self.playerid = str(uuid.uuid4())
        self.state = "not in game"

    def enter_a_game(self):
        self.state = "in game"
        
    def leave_a_game(self):
        self.state = "not in game"