import pytest
from unittest.mock import MagicMock, patch
from fastapi.testclient import TestClient

from app import app

client = TestClient(app)

# @patch('app.create_player')
# def test_create_player(mock_create_player, player_1):
#   mock_player = MagicMock()
#   mock_player.create_player.json.return_value = player_1
#   mock_create_player.json.return_value = mock_player
  
#   response = client.post("/create_player/Fede")
#   assert response.status_code == 200
#   assert response.json() == player_1

# Test de crear player

def test_create_player_invalid_name():
  player_name = "Santi Afonso!"  
  response = client.post(f"/create_player/{player_name}")

  assert response.status_code == 400
  assert response.json() == {"detail": "Player name must be less than 20 character or alphanumeric"}

def test_create_player_name_too_long():
  player_name = "a" * 21
  response = client.post(f"/create_player/{player_name}")

  assert response.status_code == 400
  assert response.json() == {"detail": "Player name must be less than 20 character or alphanumeric"}


# Test de crear game

def test_create_game_invalid_name():
  player_name = "ValidPlayer"
  response_player = client.post(f"/create_player/{player_name}")
  player_id = response_player.json()["player_id"]

  game_name = "In val!d G@me"
  game_size = 3
  response = client.post(f"/create_game/{player_id}/{game_name}/{game_size}")

  assert response.status_code == 400
  assert response.json() == {"detail": "Game name must be less than 20 characters or alphanumeric"}

def test_create_game_name_too_long():
  player_name = "ValidPlayer"
  response_player = client.post(f"/create_player/{player_name}")
  player_id = response_player.json()["player_id"]

  game_name = "a" * 21
  game_size = 3
  response = client.post(f"/create_game/{player_id}/{game_name}/{game_size}")

  assert response.status_code == 400
  assert response.json() == {"detail": "Game name must be less than 20 characters or alphanumeric"}
  
def test_create_game_invalid_size():
  player_name = "ValidPlayer"
  response_player = client.post(f"/create_player/{player_name}")
  player_id = response_player.json()["player_id"]
  
  game_name = "ValidGame"
  game_size = 1
  response = client.post(f"/create_game/{player_id}/{game_name}/{game_size}")

  assert response.status_code == 400
  assert response.json() == {"detail": "Game size must be between 2 and 4"}
  
def test_create_game_size_too_big():
  player_name = "ValidPlayer"
  response_player = client.post(f"/create_player/{player_name}")
  player_id = response_player.json()["player_id"]
  
  game_name = "ValidGame"
  game_size = 10
  response = client.post(f"/create_game/{player_id}/{game_name}/{game_size}")

  assert response.status_code == 400
  assert response.json() == {"detail": "Game size must be between 2 and 4"}
  
def test_create_game_player_not_found():
  player_name = "ValidPlayer"
  player_id = "1234"
  
  game_name = "ValidGame"
  game_size = 3
  response = client.post(f"/create_game/{player_id}/{game_name}/{game_size}")

  assert response.status_code == 404
  assert response.json() == {"detail": "Player not found"}
  
  
# Test de get players

def test_get_players():
  client.delete("/delete_all")
  player_name = "ValidPlayer"
  response_player = client.post(f"/create_player/{player_name}")
  player_id = response_player.json()["player_id"]
  
  response = client.get("/players")
  assert response.status_code == 200
  assert response.json() == [{"player_name": player_name, "player_id": player_id}]


# Test de get games

def test_get_games():
  client.delete("/delete_all")
  player_name = "ValidPlayer"
  response_player = client.post(f"/create_player/{player_name}")
  player_id = response_player.json()["player_id"]
  game_name = "ValidGame"
  game_size = 3
  response_game = client.post(f"/create_game/{player_id}/{game_name}/{game_size}")
  game_id = response_game.json()["game_id"]
  game_state = "waiting"
  current_player = 1
  
  response = client.get("/games")
  assert response.status_code == 200
  assert response.json() == [{"game_name": game_name, "game_id": game_id, "host_id": player_id, "state": game_state, "size": game_size, "current player": current_player}]
  

# Test de get game