import uuid
from fastapi import FastAPI, HTTPException, WebSocket, WebSocketDisconnect
from typing import List


class Game:
    def __init__(self, name: str, size: int):
        self.name = name
        self.state = "waiting"
        self.size = size
        self.players = []
        self.game_id = str(uuid.uuid4())
        self.host = None

    def start_game(self):
        self.state = "playing"