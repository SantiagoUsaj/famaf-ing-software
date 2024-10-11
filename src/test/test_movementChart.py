import pytest
from fastapi.testclient import TestClient
from app import app
from models.game_models import Base, Game, Table, TableGame, Tile, engine, session
from models.player_models import Player, PlayerGame
from models.handMovements_models import HandMovements

# Crea todas las tablas en la base de datos
Base.metadata.create_all(engine)

client = TestClient(app)

@pytest.fixture(scope='function', autouse=True)
def setup_database():
    # Limpiar la base de datos antes de cada prueba
    session.rollback()
    session.query(HandMovements).delete()
    session.query(Game).delete()
    session.query(Player).delete()
    session.query(PlayerGame).delete()
    session.query(TableGame).delete()
    session.query(Table).delete()
    session.query(Tile).delete() 
    session.commit()
    yield
    # Limpiar después de cada prueba
    session.rollback()
    session.query(HandMovements).delete()
    session.query(Game).delete()
    session.query(Player).delete()
    session.query(PlayerGame).delete()
    session.query(TableGame).delete()
    session.query(Table).delete()
    session.query(Tile).delete()
    session.commit()
    


# Test para possible_movements

def test_possible_movements():
    player_name1 = "ValidPlayer1"
    player_name2 = "ValidPlayer2"
    game_name = "ValidGame"
    game_size = 2
    movement_id = "3"
    tile_id = 15

    response_player1 = client.post(f"/create_player/{player_name1}")
    player_id1 = response_player1.json()["player_id"]
    
    response_player2 = client.post(f"/create_player/{player_name2}")
    player_id2 = response_player2.json()["player_id"]
    
    response_game = client.post(f"/create_game/{player_id1}/{game_name}/{game_size}")
    game_id = response_game.json()["game_id"]
    
    client.put(f"/join_game/{player_id2}/{game_id}")
    client.put(f"/start_game/{player_id1}/{game_id}")
    
    game = session.query(Game).filter_by(gameid=game_id).first()
    assert game is not None, "Game not found"
    turn = game.turn
    assert turn is not None, "Turn not found"
    first_turn = turn.split(",")[0]
    
    session.query(HandMovements).filter_by(playerid=first_turn, gameid=game_id).delete()
    session.commit()
    session.add(HandMovements(movementid=movement_id, playerid=first_turn, gameid=game_id))
    session.commit()
    
    response = client.get(f"/possible_movements/{first_turn}/{game_id}/{movement_id}/{tile_id}")
    assert response.status_code == 200
    assert response.json() == {"tile_1": 16, "tile_2": 9, "tile_3": 14, "tile_4": 21}

def test_possible_movements_player_not_found():
    player_name1 = "ValidPlayer1"
    player_name2 = "ValidPlayer2"
    player_id3 = "invalid_player_id"
    game_name = "ValidGame"
    game_size = 2
    movement_id = "3"
    tile_id = 15

    response_player1 = client.post(f"/create_player/{player_name1}")
    player_id1 = response_player1.json()["player_id"]
    
    response_player2 = client.post(f"/create_player/{player_name2}")
    player_id2 = response_player2.json()["player_id"]
    
    response_game = client.post(f"/create_game/{player_id1}/{game_name}/{game_size}")
    game_id = response_game.json()["game_id"]
    
    client.put(f"/join_game/{player_id2}/{game_id}")
    client.put(f"/start_game/{player_id1}/{game_id}")
    
    game = session.query(Game).filter_by(gameid=game_id).first()
    assert game is not None, "Game not found"
    turn = game.turn
    assert turn is not None, "Turn not found"
    first_turn = turn.split(",")[0]
    
    session.query(HandMovements).filter_by(playerid=first_turn, gameid=game_id).delete()
    session.commit()
    session.add(HandMovements(movementid=movement_id, playerid=first_turn, gameid=game_id))
    session.commit()

    response = client.get(f"/possible_movements/{player_id3}/{game_id}/{movement_id}/{tile_id}")
    assert response.status_code == 404
    assert response.json() == {"detail": "Player not found"}
    
def test_possible_movements_game_not_found():
    player_name1 = "ValidPlayer1"
    player_name2 = "ValidPlayer2"
    game_id2 = "invalid_game_id"
    game_name = "ValidGame"
    game_size = 2
    movement_id = "3"
    tile_id = 15

    response_player1 = client.post(f"/create_player/{player_name1}")
    player_id1 = response_player1.json()["player_id"]
    
    response_player2 = client.post(f"/create_player/{player_name2}")
    player_id2 = response_player2.json()["player_id"]
    
    response_game = client.post(f"/create_game/{player_id1}/{game_name}/{game_size}")
    game_id = response_game.json()["game_id"]
    
    client.put(f"/join_game/{player_id2}/{game_id}")
    client.put(f"/start_game/{player_id1}/{game_id}")
    
    game = session.query(Game).filter_by(gameid=game_id).first()
    assert game is not None, "Game not found"
    turn = game.turn
    assert turn is not None, "Turn not found"
    first_turn = turn.split(",")[0]
    
    session.query(HandMovements).filter_by(playerid=first_turn, gameid=game_id).delete()
    session.commit()
    session.add(HandMovements(movementid=movement_id, playerid=first_turn, gameid=game_id))
    session.commit()

    response = client.get(f"/possible_movements/{player_id2}/{game_id2}/{movement_id}/{tile_id}")
    
    assert response.status_code == 404
    assert response.json() == {"detail": "Game not found"}

def test_possible_movements_player_has_not_movement():
    player_name1 = "ValidPlayer1"
    player_name2 = "ValidPlayer2"
    game_name = "ValidGame"
    game_size = 2
    movement_id = "100"
    tile_id = 15

    response_player1 = client.post(f"/create_player/{player_name1}")
    player_id1 = response_player1.json()["player_id"]
    
    response_player2 = client.post(f"/create_player/{player_name2}")
    player_id2 = response_player2.json()["player_id"]
    
    response_game = client.post(f"/create_game/{player_id1}/{game_name}/{game_size}")
    game_id = response_game.json()["game_id"]
    
    client.put(f"/join_game/{player_id2}/{game_id}")
    client.put(f"/start_game/{player_id1}/{game_id}")
    
    game = session.query(Game).filter_by(gameid=game_id).first()
    assert game is not None, "Game not found"
    turn = game.turn
    assert turn is not None, "Turn not found"
    first_turn = turn.split(",")[0]

    response = client.get(f"/possible_movements/{first_turn}/{game_id}/{movement_id}/{tile_id}")
    assert response.status_code == 409
    assert response.json() == {"detail": "Player has not this movement"}

def test_possible_movements_tile_not_found():
    player_name1 = "ValidPlayer1"
    player_name2 = "ValidPlayer2"
    game_name = "ValidGame"
    game_size = 2
    movement_id = "3"
    tile_id = 200

    response_player1 = client.post(f"/create_player/{player_name1}")
    player_id1 = response_player1.json()["player_id"]
    
    response_player2 = client.post(f"/create_player/{player_name2}")
    player_id2 = response_player2.json()["player_id"]
    
    response_game = client.post(f"/create_game/{player_id1}/{game_name}/{game_size}")
    game_id = response_game.json()["game_id"]
    
    client.put(f"/join_game/{player_id2}/{game_id}")
    client.put(f"/start_game/{player_id1}/{game_id}")
    
    game = session.query(Game).filter_by(gameid=game_id).first()
    assert game is not None, "Game not found"
    turn = game.turn
    assert turn is not None, "Turn not found"
    first_turn = turn.split(",")[0]
    
    session.query(HandMovements).filter_by(playerid=first_turn, gameid=game_id).delete()
    session.commit()
    session.add(HandMovements(movementid=movement_id, playerid=first_turn, gameid=game_id))
    session.commit()

    response = client.get(f"/possible_movements/{first_turn}/{game_id}/{movement_id}/{tile_id}")
    assert response.status_code == 404
    assert response.json() == {"detail": "Tile not found"}


# Test para player_movements

def test_player_movement_charts():
    player_name1 = "ValidPlayer1"
    player_name2 = "ValidPlayer2"
    game_name = "ValidGame"
    game_size = 2
    movement_id = "3"

    response_player1 = client.post(f"/create_player/{player_name1}")
    player_id1 = response_player1.json()["player_id"]
    
    response_player2 = client.post(f"/create_player/{player_name2}")
    player_id2 = response_player2.json()["player_id"]
    
    response_game = client.post(f"/create_game/{player_id1}/{game_name}/{game_size}")
    game_id = response_game.json()["game_id"]
    
    client.put(f"/join_game/{player_id2}/{game_id}")
    client.put(f"/start_game/{player_id1}/{game_id}")
    
    game = session.query(Game).filter_by(gameid=game_id).first()
    assert game is not None, "Game not found"
    turn = game.turn
    assert turn is not None, "Turn not found"
    first_turn = turn.split(",")[0]
    
    session.query(HandMovements).filter_by(playerid=first_turn, gameid=game_id).delete()
    session.commit()
    session.add(HandMovements(movementid=movement_id, playerid=first_turn, gameid=game_id))
    session.commit()

    response = client.get(f"/player_movement_charts/{first_turn}/{game_id}")
    assert response.status_code == 200
    assert response.json() == {"ids_of_movement_charts": [int(movement_id)]}

def test_player_movement_charts_player_not_found():
    player_name1 = "ValidPlayer1"
    player_name2 = "ValidPlayer2"
    player_id3 = "1234"
    game_name = "ValidGame"
    game_size = 2
    movement_id = "3"

    response_player1 = client.post(f"/create_player/{player_name1}")
    player_id1 = response_player1.json()["player_id"]
    
    response_player2 = client.post(f"/create_player/{player_name2}")
    player_id2 = response_player2.json()["player_id"]
    
    response_game = client.post(f"/create_game/{player_id1}/{game_name}/{game_size}")
    game_id = response_game.json()["game_id"]
    
    client.put(f"/join_game/{player_id2}/{game_id}")
    client.put(f"/start_game/{player_id1}/{game_id}")
    
    game = session.query(Game).filter_by(gameid=game_id).first()
    assert game is not None, "Game not found"
    turn = game.turn
    assert turn is not None, "Turn not found"
    first_turn = turn.split(",")[0]
    
    session.query(HandMovements).filter_by(playerid=first_turn, gameid=game_id).delete()
    session.commit()
    session.add(HandMovements(movementid=movement_id, playerid=first_turn, gameid=game_id))
    session.commit()

    response = client.get(f"/player_movement_charts/{player_id3}/{game_id}")
    assert response.status_code == 404
    assert response.json() == {"detail": "Player not found"}
    
def test_player_movement_charts_game_not_found():
    player_name1 = "ValidPlayer1"
    player_name2 = "ValidPlayer2"
    game_id2 = "invalid_game_id"
    game_name = "ValidGame"
    game_size = 2
    movement_id = "3"

    response_player1 = client.post(f"/create_player/{player_name1}")
    player_id1 = response_player1.json()["player_id"]
    
    response_player2 = client.post(f"/create_player/{player_name2}")
    player_id2 = response_player2.json()["player_id"]
    
    response_game = client.post(f"/create_game/{player_id1}/{game_name}/{game_size}")
    game_id = response_game.json()["game_id"]
    
    client.put(f"/join_game/{player_id2}/{game_id}")
    client.put(f"/start_game/{player_id1}/{game_id}")
    
    game = session.query(Game).filter_by(gameid=game_id).first()
    assert game is not None, "Game not found"
    turn = game.turn
    assert turn is not None, "Turn not found"
    first_turn = turn.split(",")[0]
    
    session.query(HandMovements).filter_by(playerid=first_turn, gameid=game_id).delete()
    session.commit()
    session.add(HandMovements(movementid=movement_id, playerid=first_turn, gameid=game_id))
    session.commit()

    response = client.get(f"/player_movement_charts/{player_id2}/{game_id2}")
    assert response.status_code == 404
    assert response.json() == {"detail": "Game not found"} 


# Test para delete_all

def test_delete_all_hand_movements():
    player_name1 = "ValidPlayer1"
    player_name2 = "ValidPlayer2"
    game_name = "ValidGame"
    game_size = 2

    response_player1 = client.post(f"/create_player/{player_name1}")
    player_id1 = response_player1.json()["player_id"]
    
    response_player2 = client.post(f"/create_player/{player_name2}")
    player_id2 = response_player2.json()["player_id"]
    
    response_game = client.post(f"/create_game/{player_id1}/{game_name}/{game_size}")
    game_id = response_game.json()["game_id"]
    
    client.put(f"/join_game/{player_id2}/{game_id}")
    client.put(f"/start_game/{player_id1}/{game_id}")

    response = client.delete("/delete_hand_movements")
    assert response.status_code == 200
    assert response.json() == {"message": "All hand movements deleted"}

    hand_movements = session.query(HandMovements).all()
    assert len(hand_movements) == 0
