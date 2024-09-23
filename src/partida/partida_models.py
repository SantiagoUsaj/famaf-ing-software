import uuid
from fastapi import FastAPI, HTTPException, WebSocket, WebSocketDisconnect
from typing import List


class Game:
    def __init__(self, name: str, size: int):
        self.name = name
        self.state = "waiting"
        self.size = size
        self.players = []

    async def connect_player(self, websocket: WebSocket):
        if self.state == "playing":
            await websocket.close()
            return
        if len(self.players) < 4:
            await websocket.accept()
            self.players.append(websocket)
        else:
            await websocket.close()

    def start_game(self):
        self.state = "playing"

    def disconnect_player(self, websocket: WebSocket):
        self.players.remove(websocket)