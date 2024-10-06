import pytest
from unittest.mock import MagicMock, patch
from fastapi.testclient import TestClient
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker
from app import app
from models.game_models import Base, Game, engine, session
from models.player_models import Player, PlayerGame

# Crea todas las tabl as
Base.metadata.create_all(engine)

client = TestClient(app)

@pytest.fixture(scope="function", autouse=True)
def setup_and_teardown():
    # Configuración antes de cada prueba
    yield
    # Limpieza después de cada prueba
    session.rollback()
    session.close()

# Test de get players

def test_get_players():
  client.delete("/delete_all")
  player_name = "ValidPlayer"
  response_player = client.post(f"/create_player/{player_name}")
  player_id = response_player.json()["player_id"]
  
  response = client.get("/players")
  assert response.status_code == 200
  assert response.json() == [{"player_name": player_name, "player_id": player_id}]


# Actualizar las pruebas fallidas

def test_delete_game():
    client.delete("/delete_all")
    player_name = "ValidPlayer"
    response_player = client.post(f"/create_player/{player_name}")
    player_id = response_player.json()["player_id"]
    
    game_name = "ValidGame"
    game_size = 3
    response_game = client.post(f"/create_game/{player_id}/{game_name}/{game_size}")
    game_id = response_game.json()["game_id"]
    
    response = client.delete(f"/delete_game/{game_id}")
    assert response.status_code == 200
    assert response.json() == {"message": "Game and all associated data deleted"}

def test_delete_all():
    response = client.delete("/delete_all")
    assert response.status_code == 200
    assert response.json() == {"message": "All players, games, tables, and tiles deleted"}

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
  turn = None
  game_state = "waiting"
  current_player = 1
  
  response = client.get("/games")
  assert response.status_code == 200
  assert response.json() == [{"game_name": game_name, "game_id": game_id, "host_id": player_id, "state": game_state, "size": game_size, "current_player": current_player, "turn": turn}]
  
  
# Test de get game for id

def test_get_game_for_id():
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
  
  response = client.get(f"/game/{game_id}")
  assert response.status_code == 200
  assert response.json() == {"game_name": game_name, "game_id": game_id, "state": game_state, "game_size": game_size, "players": current_player ,"player_details": [{"player_id": player_id, "player_name": player_name}], "host_id": player_id, "turn": None}
  
def test_get_game_for_id_not_found():
  client.delete("/delete_all")
  game_id = "1234"
  
  response = client.get(f"/game/{game_id}")
  assert response.status_code == 404
  assert response.json() == {"detail": "Game not found"}


# Test de get player for id

def test_get_player_for_game_id():
  client.delete("/delete_all")
  player_name = "ValidPlayer"
  response_player = client.post(f"/create_player/{player_name}")
  player_id = response_player.json()["player_id"]

  response = client.get(f"/player/{player_id}")
  assert response.status_code == 200
  assert response.json() == {"name": player_name, "playerid": player_id}

def test_get_player_for_game_id_not_found():
  client.delete("/delete_all")
  player_id = "3456735675672"

  response = client.get(f"/player/{player_id}")
  assert response.status_code == 404
  assert response.json() == {"detail": "Player not found"}
  

# Test de get players in game

def test_get_players_in_game():
  client.delete("/delete_all")
  player_name = "ValidPlayer"
  response_player = client.post(f"/create_player/{player_name}")
  player_id = response_player.json()["player_id"]
  game_name = "ValidGame"
  game_size = 3
  response_game = client.post(f"/create_game/{player_id}/{game_name}/{game_size}")
  game_id = response_game.json()["game_id"]
  
  response = client.get(f"/players_in_game/{game_id}")
  assert response.status_code == 200
  assert response.json() == [{"player_name": player_name, "player_id": player_id}]
  
def test_get_players_in_game_not_found():
  game_id = "12323523546"
  
  response = client.get(f"/players_in_game/{game_id}")
  assert response.status_code == 404
  assert response.json() == {"detail": "Game not found"}


# Test de crear player

def test_create_player():
  client.delete("/delete_all")
  player_name = "ValidPlayer"
  response = client.post(f"/create_player/{player_name}")

  assert response.status_code == 200
  assert response.json() == {"player_id": response.json()["player_id"]}

def test_create_player_invalid_name():
  client.delete("/delete_all")
  player_name = "Santi Afonso!"  
  response = client.post(f"/create_player/{player_name}")

  assert response.status_code == 400
  assert response.json() == {"detail": "Player name must be less than 20 character or alphanumeric"}

def test_create_player_name_too_long():
  client.delete("/delete_all")
  player_name = "a" * 21
  response = client.post(f"/create_player/{player_name}")

  assert response.status_code == 400
  assert response.json() == {"detail": "Player name must be less than 20 character or alphanumeric"}


# Test de crear game

def test_create_game():
  client.delete("/delete_all")
  player_name = "ValidPlayer"
  response_player = client.post(f"/create_player/{player_name}")
  player_id = response_player.json()["player_id"]

  game_name = "ValidGame"
  game_size = 3
  response = client.post(f"/create_game/{player_id}/{game_name}/{game_size}")
  game_id = response.json()["game_id"]

  assert response.status_code == 200
  assert response.json() == {"game_id": game_id}

def test_create_game_invalid_name():
  client.delete("/delete_all")
  player_name = "ValidPlayer"
  response_player = client.post(f"/create_player/{player_name}")
  player_id = response_player.json()["player_id"]

  game_name = "In val!d G@me"
  game_size = 3
  response = client.post(f"/create_game/{player_id}/{game_name}/{game_size}")

  assert response.status_code == 400
  assert response.json() == {"detail": "Game name must be less than 20 characters or alphanumeric"}

def test_create_game_name_too_long():
  client.delete("/delete_all")
  player_name = "ValidPlayer"
  response_player = client.post(f"/create_player/{player_name}")
  player_id = response_player.json()["player_id"]

  game_name = "a" * 21
  game_size = 3
  response = client.post(f"/create_game/{player_id}/{game_name}/{game_size}")

  assert response.status_code == 400
  assert response.json() == {"detail": "Game name must be less than 20 characters or alphanumeric"}
  
def test_create_game_invalid_size():
  client.delete("/delete_all")
  player_name = "ValidPlayer"
  response_player = client.post(f"/create_player/{player_name}")
  player_id = response_player.json()["player_id"]
  
  game_name = "ValidGame"
  game_size = 1
  response = client.post(f"/create_game/{player_id}/{game_name}/{game_size}")

  assert response.status_code == 400
  assert response.json() == {"detail": "Game size must be between 2 and 4"}
  
def test_create_game_size_too_big():
  client.delete("/delete_all")
  player_name = "ValidPlayer"
  response_player = client.post(f"/create_player/{player_name}")
  player_id = response_player.json()["player_id"]
  
  game_name = "ValidGame"
  game_size = 10
  response = client.post(f"/create_game/{player_id}/{game_name}/{game_size}")

  assert response.status_code == 400
  assert response.json() == {"detail": "Game size must be between 2 and 4"}
  
def test_create_game_player_not_found():
  client.delete("/delete_all")
  player_name = "ValidPlayer"
  player_id = "1234"
  
  game_name = "ValidGame"
  game_size = 3
  response = client.post(f"/create_game/{player_id}/{game_name}/{game_size}")

  assert response.status_code == 404
  assert response.json() == {"detail": "Player not found"}

# Test join game

def test_join_game():
  client.delete("/delete_all")
  player_name = "ValidPlayer"
  response_player = client.post(f"/create_player/{player_name}")
  player_id = response_player.json()["player_id"]
  
  player_name2 = "ValidPlayer2"
  response_player2 = client.post(f"/create_player/{player_name2}")
  player_id2 = response_player2.json()["player_id"]
  
  game_name = "ValidGame"
  game_size = 3
  response_game = client.post(f"/create_game/{player_id}/{game_name}/{game_size}")
  game_id = response_game.json()["game_id"]
  
  response = client.put(f"/join_game/{player_id2}/{game_id}")
  assert response.status_code == 200
  assert response.json() == {"message": player_name2 + " joined the game " + game_name}
  
def test_join_game_not_found():
  client.delete("/delete_all")
  player_name = "ValidPlayer"
  response_player = client.post(f"/create_player/{player_name}")
  player_id = response_player.json()["player_id"]
  game_id = "1234"
  
  response = client.put(f"/join_game/{player_id}/{game_id}")
  assert response.status_code == 404
  assert response.json() == {"detail": "Game not found"}
  
def test_join_game_player_not_found():
  client.delete("/delete_all")
  player_name = "ValidPlayer"
  player_id2 = "1234"
  player_name1 = "ValidPlayer2"
  response_player = client.post(f"/create_player/{player_name}")
  player_id = response_player.json()["player_id"]
  game_name = "ValidGame"
  game_size = 3
  response_game = client.post(f"/create_game/{player_id}/{game_name}/{game_size}")
  game_id = response_game.json()["game_id"]
  
  response = client.put(f"/join_game/{player_id2}/{game_id}")
  assert response.status_code == 404
  assert response.json() == {"detail": "Player not found"}
  
def test_join_game_game_is_already_playing():
    client.delete("/delete_all")
    player_name = "ValidPlayer"
    response_player = client.post(f"/create_player/{player_name}")
    player_id = response_player.json()["player_id"]
    
    player_name2 = "ValidPlayer2"
    response_player2 = client.post(f"/create_player/{player_name2}")
    player_id2 = response_player2.json()["player_id"]
    
    player_name3 = "ValidPlayer3"
    response_player3 = client.post(f"/create_player/{player_name3}")
    player_id3 = response_player3.json()["player_id"]
    
    game_name = "ValidGame"
    game_size = 2
    response_game = client.post(f"/create_game/{player_id}/{game_name}/{game_size}")
    game_id = response_game.json()["game_id"]
    
    response_join = client.put(f"/join_game/{player_id2}/{game_id}")
    assert response_join.json() == {"message": player_name2 + " joined the game " + game_name}
    
    response_start = client.put(f"/start_game/{player_id}/{game_id}")
    response_join_again = client.put(f"/join_game/{player_id3}/{game_id}")
    assert response_join_again.status_code == 409
    assert response_join_again.json() == {"detail": "The game is already in progress"}
  
def test_join_game_player_is_in_game():
  client.delete("/delete_all")
  player_name = "ValidPlayer"
  response_player = client.post(f"/create_player/{player_name}")
  player_id = response_player.json()["player_id"]
  
  player_name2 = "ValidPlayer2"
  response_player2 = client.post(f"/create_player/{player_name2}")
  player_id2 = response_player2.json()["player_id"]
  
  game_name = "ValidGame"
  game_size = 3
  response_game = client.post(f"/create_game/{player_id}/{game_name}/{game_size}")
  game_id = response_game.json()["game_id"]
  client.put(f"/join_game/{player_id2}/{game_id}")
  
  response = client.put(f"/join_game/{player_id2}/{game_id}")
  assert response.status_code == 409
  assert response.json() == {"detail": "Player is already in the game"}
  
def test_join_game_player_is_in_another_game():
  player_name = "ValidPlayer"
  response_player = client.post(f"/create_player/{player_name}")
  player_id = response_player.json()["player_id"]
  
  player_name2 = "ValidPlayer2"
  response_player2 = client.post(f"/create_player/{player_name2}")
  player_id2 = response_player2.json()["player_id"]
  
  game_name = "ValidGame"
  game_size = 3
  response_game = client.post(f"/create_game/{player_id}/{game_name}/{game_size}")
  game_id = response_game.json()["game_id"]
  
  game_name2 = "ValidGame2"
  game_size2 = 3
  response_game2 = client.post(f"/create_game/{player_id2}/{game_name2}/{game_size2}")
  game_id2 = response_game2.json()["game_id"]
  
  response = client.put(f"/join_game/{player_id2}/{game_id}")
  assert response.status_code == 409
  assert response.json() == {"detail": "Player is already in another game"}

def test_join_game_is_full():
  player_name = "ValidPlayer"
  response_player = client.post(f"/create_player/{player_name}")
  player_id = response_player.json()["player_id"]
  
  player_name2 = "ValidPlayer2"
  response_player2 = client.post(f"/create_player/{player_name2}")
  player_id2 = response_player2.json()["player_id"]
  
  player_name3 = "ValidPlayer3"
  response_player3 = client.post(f"/create_player/{player_name3}")
  player_id3 = response_player3.json()["player_id"]
  
  game_name = "ValidGame"
  game_size = 2
  response_game = client.post(f"/create_game/{player_id}/{game_name}/{game_size}")
  game_id = response_game.json()["game_id"]
  
  client.put(f"/join_game/{player_id2}/{game_id}")
  
  response = client.put(f"/join_game/{player_id3}/{game_id}")
  assert response.status_code == 409
  assert response.json() == {"detail": "Game is full"}
  

# Test leave game

def test_leave_game():
  client.delete("/delete_all")
  player_name = "ValidPlayer"
  response_player = client.post(f"/create_player/{player_name}")
  player_id = response_player.json()["player_id"]
  
  player_name2 = "ValidPlayer2"
  response_player2 = client.post(f"/create_player/{player_name2}")
  player_id2 = response_player2.json()["player_id"]
  
  game_name = "ValidGame"
  game_size = 3
  response_game = client.post(f"/create_game/{player_id}/{game_name}/{game_size}")
  game_id = response_game.json()["game_id"]
  
  response_join = client.put(f"/join_game/{player_id2}/{game_id}")
  assert response_join.json() == {"message": player_name2 + " joined the game " + game_name}
  
  response = client.put(f"/leave_game/{player_id2}/{game_id}")
  assert response.status_code == 200
  assert response.json() == {"message": player_name2 + " left the game " + game_name}

def test_leave_game_not_found():
  client.delete("/delete_all")
  player_name = "ValidPlayer"
  response_player = client.post(f"/create_player/{player_name}")
  player_id = response_player.json()["player_id"]
  game_id = "1234"
  
  response = client.put(f"/leave_game/{player_id}/{game_id}")
  assert response.status_code == 404
  assert response.json() == {"detail": "Game not found"}
  
def test_leave_game_player_not_found():
  client.delete("/delete_all")
  client.delete("/delete_all")
  player_name = "ValidPlayer"
  response_player = client.post(f"/create_player/{player_name}")
  player_id = response_player.json()["player_id"]
  
  player_name2 = "ValidPlayer2"
  player_id2 = "1234"
  game_name = "ValidGame"
  game_size = 3
  response_game = client.post(f"/create_game/{player_id}/{game_name}/{game_size}")
  game_id = response_game.json()["game_id"]
  
  response = client.put(f"/leave_game/{player_id2}/{game_id}")
  assert response.status_code == 404
  assert response.json() == {"detail": "Player not found"}
  
def test_leave_game_host_cant_leave_game():
  client.delete("/delete_all")
  player_name = "ValidPlayer"
  response_player = client.post(f"/create_player/{player_name}")
  player_id = response_player.json()["player_id"]
  
  game_name = "ValidGame"
  game_size = 3
  response_game = client.post(f"/create_game/{player_id}/{game_name}/{game_size}")
  game_id = response_game.json()["game_id"]
  
  response = client.put(f"/leave_game/{player_id}/{game_id}")
  assert response.status_code == 409
  assert response.json() == {"detail": "You can't leave the game if you are the host"}

def test_leave_game_player_is_not_in_game():
  client.delete("/delete_all")
  player_name = "ValidPlayer"
  response_player = client.post(f"/create_player/{player_name}")
  player_id = response_player.json()["player_id"]
  
  player_name2 = "ValidPlayer2"
  response_player2 = client.post(f"/create_player/{player_name2}")
  player_id2 = response_player2.json()["player_id"]
  
  game_name = "ValidGame"
  game_size = 3
  response_game = client.post(f"/create_game/{player_id}/{game_name}/{game_size}")
  game_id = response_game.json()["game_id"]
  
  response = client.put(f"/leave_game/{player_id2}/{game_id}")
  assert response.status_code == 409
  assert response.json() == {"detail": "Player is not in the game"}
  
  
# Test start game

def test_start_game():
  client.delete("/delete_all")
  player_name = "ValidPlayer"
  response_player = client.post(f"/create_player/{player_name}")
  player_id = response_player.json()["player_id"]
  
  player_name2 = "ValidPlayer2"
  response_player2 = client.post(f"/create_player/{player_name2}")
  player_id2 = response_player2.json()["player_id"]
  
  player_name3 = "ValidPlayer3"
  response_player3 = client.post(f"/create_player/{player_name3}")
  player_id3 = response_player3.json()["player_id"]
  
  game_name = "ValidGame"
  game_size = 3
  response_game = client.post(f"/create_game/{player_id}/{game_name}/{game_size}")
  game_id = response_game.json()["game_id"]
  
  response_join = client.put(f"/join_game/{player_id2}/{game_id}")
  assert response_join.json() == {"message": player_name2 + " joined the game " + game_name}
  
  response_join2 = client.put(f"/join_game/{player_id3}/{game_id}")
  assert response_join2.json() == {"message": player_name3 + " joined the game " + game_name}
  
  response = client.put(f"/start_game/{player_id}/{game_id}")
  assert response.status_code == 200
  assert response.json() == {"message": "Game started"}
  
def test_start_game_not_found():
  client.delete("/delete_all")
  player_name = "ValidPlayer"
  response_player = client.post(f"/create_player/{player_name}")
  player_id = response_player.json()["player_id"]
  game_id = "1234"
  
  response = client.put(f"/start_game/{player_id}/{game_id}")
  assert response.status_code == 404
  assert response.json() == {"detail": "Game not found"}
  
def test_start_game_player_not_found():
  client.delete("/delete_all")
  player_name = "ValidPlayer"
  player_id = "1234"
  
  game_name = "ValidGame"
  game_size = 3
  response_game = client.post(f"/create_game/{player_id}/{game_name}/{game_size}")
  assert response_game.status_code == 404
  assert response_game.json() == {"detail": "Player not found"}
  
def test_start_game_not_host():
  client.delete("/delete_all")
  player_name = "ValidPlayer"
  response_player = client.post(f"/create_player/{player_name}")
  player_id = response_player.json()["player_id"]
  
  player_name2 = "ValidPlayer2"
  response_player2 = client.post(f"/create_player/{player_name2}")
  player_id2 = response_player2.json()["player_id"]
  
  game_name = "ValidGame"
  game_size = 2
  response_game = client.post(f"/create_game/{player_id2}/{game_name}/{game_size}")
  game_id = response_game.json()["game_id"]
  
  response = client.put(f"/start_game/{player_id}/{game_id}")
  assert response.status_code == 409
  assert response.json() == {"detail": "Only the host can start the game"}
  
def test_start_game_is_not_full():
  client.delete("/delete_all")
  player_name = "ValidPlayer"
  response_player = client.post(f"/create_player/{player_name}")
  player_id = response_player.json()["player_id"]
  
  player_name2 = "ValidPlayer2"
  player_id2 = "1234"
  game_name = "ValidGame"
  game_size = 3
  response_game = client.post(f"/create_game/{player_id}/{game_name}/{game_size}")
  game_id = response_game.json()["game_id"]
  
  response = client.put(f"/start_game/{player_id}/{game_id}")
  assert response.status_code == 409
  assert response.json() == {"detail": "The game is not full"}
  
# Test para next turn 

def test_next_turn():
    client.delete("/delete_all")
    player_name = "ValidPlayer"
    response_player = client.post(f"/create_player/{player_name}")
    player_id = response_player.json()["player_id"]
    
    player_name2 = "ValidPlayer2"
    response_player2 = client.post(f"/create_player/{player_name2}")
    player_id2 = response_player2.json()["player_id"]
    
    game_name = "ValidGame"
    game_size = 2
    response_game = client.post(f"/create_game/{player_id}/{game_name}/{game_size}")
    game_id = response_game.json()["game_id"]
    
    response_join = client.put(f"/join_game/{player_id2}/{game_id}")
    assert response_join.json() == {"message": player_name2 + " joined the game " + game_name}
    
    response_start = client.put(f"/start_game/{player_id}/{game_id}")
    assert response_start.json() == {"message": "Game started"}
    
    response_next_turn = client.put(f"/next_turn/{player_id2}/{game_id}")
    assert response_next_turn.status_code == 200
    assert response_next_turn.json() == {"message": "Next turn"}

def test_next_turn_game_not_found():
    client.delete("/delete_all")
    player_name = "ValidPlayer"
    response_player = client.post(f"/create_player/{player_name}")
    player_id = response_player.json()["player_id"]
    game_id = "1234"
    
    response = client.put(f"/next_turn/{player_id}/{game_id}")
    assert response.status_code == 404
    assert response.json() == {"detail": "Game not found"}

def test_next_turn_player_not_found():
    client.delete("/delete_all")
    player_name = "ValidPlayer"
    response_player = client.post(f"/create_player/{player_name}")
    player_id = response_player.json()["player_id"]
    
    player_name2 = "ValidPlayer2"
    player_id2 = "1234"
    game_name = "ValidGame"
    game_size = 2
    response_game = client.post(f"/create_game/{player_id}/{game_name}/{game_size}")
    game_id = response_game.json()["game_id"]
    
    response = client.put(f"/next_turn/{player_id2}/{game_id}")
    assert response.status_code == 404
    assert response.json() == {"detail": "Player not found"}

def test_next_turn_not_your_turn():
  client.delete("/delete_all")
  player_name = "ValidPlayer"
  response_player = client.post(f"/create_player/{player_name}")
  player_id = response_player.json()["player_id"]
  
  player_name2 = "ValidPlayer2"
  response_player2 = client.post(f"/create_player/{player_name2}")
  player_id2 = response_player2.json()["player_id"]
  
  player_name3 = "ValidPlayer3"
  response_player3 = client.post(f"/create_player/{player_name3}")
  player_id3 = response_player3.json()["player_id"]
  
  game_name = "ValidGame"
  game_size = 2
  response_game = client.post(f"/create_game/{player_id}/{game_name}/{game_size}")
  game_id = response_game.json()["game_id"]
  
  client.put(f"/join_game/{player_id2}/{game_id}")
  client.put(f"/start_game/{player_id}/{game_id}")
  
  response = client.put(f"/next_turn/{player_id3}/{game_id}")
  assert response.status_code == 409
  assert response.json() == {"detail": "It's not your turn"}
  
  
# Test delete player

def test_delete_player():
  client.delete("/delete_all")
  player_name = "ValidPlayer"
  response_player = client.post(f"/create_player/{player_name}")
  player_id = response_player.json()["player_id"]
  
  response = client.delete(f"/delete_player/{player_id}")
  assert response.status_code == 200
  assert response.json() == {"message": "Player deleted"}
  
def test_delete_player_not_found():
  client.delete("/delete_all")
  player_id = "1234"
  
  response = client.delete(f"/delete_player/{player_id}")
  assert response.status_code == 404
  assert response.json() == {"detail": "Player not found"}
  
# Test delete game

def test_delete_game():
  client.delete("/delete_all")
  player_name = "ValidPlayer"
  response_player = client.post(f"/create_player/{player_name}")
  player_id = response_player.json()["player_id"]
  
  game_name = "ValidGame"
  game_size = 3
  response_game = client.post(f"/create_game/{player_id}/{game_name}/{game_size}")
  game_id = response_game.json()["game_id"]
  
  response = client.delete(f"/delete_game/{game_id}")
  assert response.status_code == 200
  assert response.json() == {"message": "Game deleted"}
  
def test_delete_game_not_found():
  client.delete("/delete_all")
  game_id = "1234"
  
  response = client.delete(f"/delete_game/{game_id}")
  assert response.status_code == 404
  assert response.json() == {"detail": "Game not found"}
  
  
# Test delete all

def test_delete_all():
  response = client.delete("/delete_all")
  assert response.status_code == 200
  assert response.json() == {"message": "All players and games deleted"}
  
  