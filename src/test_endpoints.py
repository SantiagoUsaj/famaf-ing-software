import pytest
from fastapi.testclient import TestClient
from unittest.mock import MagicMock, patch

from .endpoints import app

client = TestClient(app)

@pytest.fixture
def player_1():
    return {
      "name": "Fede",
      "playerid": "1234",
      "state": "not in game"   
  }
    
@pytest.fixture
def playerid_1():
    return "1234"
    

    
@pytest.fixture
def player_2():
    return {
      "2222": {
      "name": "Ronnie",
      "playerid": "2222",
      "state": "not in game"
    }
}
    
@pytest.fixture
def player_3():
    return {
      "3456547": {
      "name": "Santi",
      "playerid": "3456547",
      "state": "not in game"
    }
}
    
@pytest.fixture
def game_1():
    return {
      "name": "game1",
      "state": "waiting",
      "size": 3,
      "players": [
          {
          "name": "Fede",
          "playerid": "1234",
          "state": "in game"
          }
      ],
      "game_id": "0000",
      "host": "1234"
}
    
@pytest.fixture
def game_2():
    return {
        "name": "game2",
        "state": "waiting",
        "size": 3,
        "players": [
            {
            "name": "Fede",
            "playerid": "1234",
            "state": "in game"
            }
        ],
        "game_id": "1111",
        "host": "1234"
}

    
# Test create_player

# Test create_player correct player
 @patch('src.endpoints.create_player')
 def test_create_player(mock_create_player, playerid_1):
   mock_player = MagicMock()
   mock_player.create_player.return_value = playerid_1
   mock_create_player.return_value = mock_player
  
   response = client.post('/create_player/Fede')
   assert response.status_code == 200
   assert response.json() == playerid_1
  
# # Test create_player incorrect player
# def test_create_player(mock_create_player):
#   mock_player = MagicMock()
#   mock_player.create_player.return_value = ValueError("Player name must be less than 20 characters or alphanumeric")
#   mock_create_player.return_value = mock_player
  
#   response = client.post("/create_player/Fede#&#123456789000000///&")
#   assert response.status_code == 400
#   assert response.json() == {"detail": "Player name must be less than 20 characters or alphanumeric"}
  
  
# # Test create_game 
  
# # Test create_game correct game
# @patch('src.endpoints.create_game')
# def test_create_game(mock_create_game, mock_create_player, player_1, game_1):
#   mock_game = MagicMock()
#   mock_game.create_game.return_value = game_1
#   mock_create_game.return_value = game_1
#   mock_player = MagicMock()
#   mock_player.create_player.return_value = player_1
#   mock_create_player.return_value = player_1
  
#   client.post("/create_player/Fede")
#   response = client.post("/create_game/1234/game1/3")
#   assert response.status_code == 200
#   assert response.json() == game_1
  
# # Test create_game not found player
# def test_create_game_not_found_player(mock_create_game, game_1):
#   mock_game = MagicMock()
#   mock_game.create_game.return_value = HTTPException(status_code=404, detail="Player not found")
#   mock_create_game.return_value = mock_game
  
#   response = client.post("/create_game/0000/game1/3")
#   assert response.status_code == 404
#   assert response.json() == {"detail": "Player not found"}
  
# # Test create_game incorrect game name
# def test_create_game_inc_game_name(mock_create_game):
#   mock_game = MagicMock()
#   mock_game.create_game.return_value = ValueError("Game name must be less than 20 characters or alphanumeric")
#   mock_create_game.return_value = mock_game
  
#   response = client.post("/create_game/1234/game1#&#1234563240&////&/3")
#   assert response.status_code == 400
#   assert response.json() == {"detail": "Game name must be less than 20 characters or alphanumeric"}
  
# # Test create_game incorrect game size
# def test_create_game_inc_game_size(mock_create_game):
#   mock_game = MagicMock()
#   mock_game.create_game.return_value = ValueError("Game size must be between 2 and 4")
#   mock_create_game.return_value = mock_game
  
#   response = client.post("/create_game/1234/game1/1")
#   assert response.status_code == 400
#   assert response.json() == {"detail": "Game size must be between 2 and 4"}
  

# # Test leave_game

# # Test leave_game correct game
# @patch('src.endpoints.leave_game')
# def test_leave_game(mock_leave_game, player_2, game_2):
#   mock_game = MagicMock()
#   mock_game.leave_game.return_value = game_2
#   mock_leave_game.return_value = game_2
  
#   client.put("/create_game/1234/game2/3")
#   client.put("/join_game/2222/1111")
#   response = client.put("/leave_game/2222/1111")
#   assert response.status_code == 200
#   assert response.json() == game_2
  
# # Test leave_game not found player
# def test_leave_game_not_found_player(mock_leave_game, game_2):
#   mock_game = MagicMock()
#   mock_game.leave_game.return_value = HTTPException(status_code=404, detail="Player not found")
#   mock_leave_game.return_value = mock_game
  
#   response = client.put("/leave_game/294673/1111")
#   assert response.status_code == 404
#   assert response.json() == {"detail": "Player not found"}
  
# # Test leave_game not found game
# def test_leave_game_not_found_game(mock_leave_game, player_2):
#   mock_game = MagicMock()
#   mock_game.leave_game.return_value = {"message": "Game not found"}
#   mock_leave_game.return_value = mock_game
  
#   response = client.put("/leave_game/2222/93495")
#   assert response.status_code == 404
#   assert response.json() == {"message": "Game not found"}



  
