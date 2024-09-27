import uuid
from fastapi import FastAPI, HTTPException, WebSocket, WebSocketDisconnect
from typing import List
from player_models import Player


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
        
    def create_game(self, player: Player):
        self.players.append(player)
        self.host = player.playerid
        player.enter_a_game()
        
    def add_player(self, player: Player):
        self.players.append(player)
        player.enter_a_game()
        
    def remove_player(self, player: Player):
        self.players.remove(player)
        player.leave_a_game()
        
    def get_host(self):
        return self.host