import pytest
import asyncio
import uvicorn
import json
from fastapi.testclient import TestClient
from multiprocessing import Process
from fastapi import WebSocket
from websockets import connect
from time import sleep
from app import app

client = TestClient(app)

@pytest.fixture(scope="session", autouse=True)
def start_server():
    # Inicia el servidor en un proceso separado
    process = Process(target=uvicorn.run, args=(app,), kwargs={"host": "127.0.0.1", "port": 8000})
    process.start()
    sleep(1)  # Espera un momento para que el servidor inicie
    yield
    process.terminate()
    process.join()

@pytest.mark.asyncio
async def test_websocket_connection():
    async with connect("ws://127.0.0.1:8000/ws/test_player") as websocket:
        await websocket.send(json.dumps({"message": "Hello WebSocket"}))
        response = await websocket.recv()
        response_data = json.loads(response)
        
        # Verificar que la respuesta sea una lista
        assert isinstance(response_data, list)
        
        # Verificar que cada juego tenga los campos esperados
        for game in response_data:
            assert "game_name" in game
            assert "game_id" in game
            assert "state" in game
            assert "game_size" in game
            assert "players" in game
            assert "player_details" in game
            assert isinstance(game["player_details"], list)

@pytest.mark.asyncio
async def test_game_websocket_connection():
    async with connect("ws://127.0.0.1:8000/ws/game/test_game") as websocket:
        await websocket.send(json.dumps({"message": "Hello Game WebSocket"}))
        response = await websocket.recv()
        response_data = json.loads(response)
        
        # Verificar que la respuesta contenga un error
        assert "error" in response_data
        assert response_data["error"] == "Game not found"

        # Verificar que la respuesta contenga los campos esperados en caso de éxito
        if "game_name" in response_data:
            assert "game_id" in response_data
            assert "state" in response_data
            assert "game_size" in response_data
            assert "players" in response_data
            assert "player_details" in response_data
            assert isinstance(response_data["player_details"], list)
            assert "turn" in response_data