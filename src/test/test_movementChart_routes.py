import pytest
from fastapi.testclient import TestClient
from app import app
from models.game_models import Base, engine, session, Game
from models.board_models import Table, Tile, TableGame, Figures
from models.player_models import Player, PlayerGame
from models.handMovements_models import HandMovements
from models.movementChart_models import MovementChart
from models.figure_card_models import Figure_card, has_blocked_card

# Crea todas las tablas en la base de datos
Base.metadata.drop_all(engine)
Base.metadata.create_all(engine)
MovementChart.game_movement()
Figures.create_figures()

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
    MovementChart.game_movement()
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
    
    game_password = "1234"
    response_game = client.post(f"/create_game/{player_id1}/{game_name}/{game_size}/{game_password}")
    game_id = response_game.json()["game_id"]
    
    client.put(f"/join_game/{player_id2}/{game_id}/{game_password}")
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
    
    game_password = "1234"
    response_game = client.post(f"/create_game/{player_id1}/{game_name}/{game_size}/{game_password}")
    game_id = response_game.json()["game_id"]
    
    client.put(f"/join_game/{player_id2}/{game_id}/{game_password}")
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
    
    game_password = "1234"
    response_game = client.post(f"/create_game/{player_id1}/{game_name}/{game_size}/{game_password}")
    game_id = response_game.json()["game_id"]
    
    client.put(f"/join_game/{player_id2}/{game_id}/{game_password}")
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
    
    game_password = "1234"
    response_game = client.post(f"/create_game/{player_id1}/{game_name}/{game_size}/{game_password}")
    game_id = response_game.json()["game_id"]
    
    client.put(f"/join_game/{player_id2}/{game_id}/{game_password}")
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
    
    game_password = "1234"
    response_game = client.post(f"/create_game/{player_id1}/{game_name}/{game_size}/{game_password}")
    game_id = response_game.json()["game_id"]
    
    client.put(f"/join_game/{player_id2}/{game_id}/{game_password}")
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
    
    game_password = "1234"
    response_game = client.post(f"/create_game/{player_id1}/{game_name}/{game_size}/{game_password}")
    game_id = response_game.json()["game_id"]
    
    client.put(f"/join_game/{player_id2}/{game_id}/{game_password}")
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
    assert response.json() == {"ids_of_movement_charts": [3]}

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
    
    game_password = "1234"
    response_game = client.post(f"/create_game/{player_id1}/{game_name}/{game_size}/{game_password}")
    game_id = response_game.json()["game_id"]
    
    client.put(f"/join_game/{player_id2}/{game_id}/{game_password}")
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
    
    game_password = "1234"
    response_game = client.post(f"/create_game/{player_id1}/{game_name}/{game_size}/{game_password}")
    game_id = response_game.json()["game_id"]
    
    client.put(f"/join_game/{player_id2}/{game_id}/{game_password}")
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
    
    game_password = "1234"
    response_game = client.post(f"/create_game/{player_id1}/{game_name}/{game_size}/{game_password}")
    game_id = response_game.json()["game_id"]
    
    client.put(f"/join_game/{player_id2}/{game_id}/{game_password}")
    client.put(f"/start_game/{player_id1}/{game_id}")

    response = client.delete("/delete_hand_movements")
    assert response.status_code == 200
    assert response.json() == {"message": "All hand movements deleted"}

    hand_movements = session.query(HandMovements).all()
    assert len(hand_movements) == 0

# FIX TEST 

# def test_use_figure_chart():
#     player_name1 = "ValidPlayer1"
#     player_name2 = "ValidPlayer2"
#     game_name = "ValidGame"
#     game_size = 2
#     figure_id = 2
#     tile_id = 1
    
#     session.commit()
#     response_player1 = client.post(f"/create_player/{player_name1}")
#     player_id1 = response_player1.json()["player_id"]
    
#     response_player2 = client.post(f"/create_player/{player_name2}")
#     player_id2 = response_player2.json()["player_id"]
    
#     game_password = "1234"
#     response_game = client.post(f"/create_game/{player_id1}/{game_name}/{game_size}/{game_password}")
#     game_id = response_game.json()["game_id"]
    
#     client.put(f"/join_game/{player_id2}/{game_id}/{game_password}")
#     client.put(f"/start_game/{player_id1}/{game_id}")

#     id_table = session.query(Table).filter_by(gameid=game_id).first().id
#     # Obtener los registros que deseas eliminar
#     tiles_to_delete = session.query(Tile).filter_by(table_id=id_table).order_by(Tile.number).limit(4).all()

#     # Eliminar los registros obtenidos
#     for tile in tiles_to_delete:
#         session.delete(tile)

#     # Confirmar la transacción
#     session.commit()    
#     session.add_all([
#         Tile(table_id=id_table, color="red", number=1, x=0, y=0, highlight=False),
#         Tile(table_id=id_table, color="red", number=2, x=0, y=1, highlight=False),
#         Tile(table_id=id_table, color="red", number=3, x=1, y=0, highlight=False),
#         Tile(table_id=id_table, color="red", number=4, x=1, y=1, highlight=False)
#     ])
#     game = session.query(Game).filter_by(gameid=game_id).first()
#     assert game is not None, "Game not found"
#     turn = game.turn
#     assert turn is not None, "Turn not found"
#     first_turn = turn.split(",")[0]
    
#     session.query(Figure_card).filter_by(playerid=first_turn, gameid=game_id).delete()
#     session.commit()
#     session.add(Figure_card(figure=figure_id, player_id=first_turn, game_id=game_id))
#     a=session.query(Figure_card).filter_by(playerid=first_turn, gameid=game_id).first()
#     a.take_card()
#     session.commit()
    
#     response = client.post(f"/use_figure_chart/{first_turn}/{game_id}/{figure_id}/{tile_id}")
#     assert response.status_code == 200
#     assert response.json() == {"message": "Figure card used and removed from hand"}

def test_block_figure_card():
    player_name1 = "ValidPlayer1"
    player_name2 = "ValidPlayer2"
    game_name = "ValidGame"
    game_size = 2
    figure_id = 6
    tile_id = 1

    response_player1 = client.post(f"/create_player/{player_name1}")
    player_id1 = response_player1.json()["player_id"]  

    response_player2 = client.post(f"/create_player/{player_name2}")
    player_id2 = response_player2.json()["player_id"]
    
    response_game = client.post(f"/create_game/{player_id1}/{game_name}/{game_size}")
    game_id = response_game.json()["game_id"]

    client.put(f"/join_game/{player_id2}/{game_id}")
    client.put(f"/start_game/{player_id1}/{game_id}")

    id_table = session.query(Table).filter_by(gameid=game_id).first().id
    # Obtener los registros que deseas eliminar
    tiles_to_delete = session.query(Tile).filter_by(table_id=id_table).order_by(Tile.number).limit(4).all()

    # Eliminar los registros obtenidos
    for tile in tiles_to_delete:
        session.delete(tile)

    # Confirmar la transacción
    session.commit()    
    session.add_all([
        Tile(table_id=id_table, color="red", number=1, x=0, y=0, highlight=False),
        Tile(table_id=id_table, color="red", number=2, x=0, y=1, highlight=False),
        Tile(table_id=id_table, color="red", number=3, x=0, y=2, highlight=False),
        Tile(table_id=id_table, color="red", number=4, x=0, y=3, highlight=False)
    ])
    game = session.query(Game).filter_by(gameid=game_id).first()
    assert game is not None, "Game not found"
    turn = game.turn
    assert turn is not None, "Turn not found"
    first_turn = turn.split(",")[0]
    second_turn = turn.split(",")[1]
    session.query(Figure_card).filter().delete()
    session.commit()
    session.add(Figure_card(figure=figure_id, player_id=second_turn, game_id=game_id))
    a=session.query(Figure_card).filter_by(playerid=second_turn, gameid=game_id).first()
    a.in_hand=True
    
    game_t = session.query(Game).filter_by(gameid=game_id).first()
    target_player = session.query(PlayerGame).filter_by(playerid=first_turn, gameid=game_id).first()
    figure_card = session.query(Figure_card).filter_by(playerid=second_turn, id=a.id, in_hand=True).first()
    assert game_t is not None, "Game not found"
    assert target_player is not None, "Player not in game"
    assert figure_card is not None, "Figure card not found"
    assert target_player not in session.query(PlayerGame).filter_by(gameid=game_id).all(), "Player not in game"
    assert has_blocked_card(game_id, second_turn), "Player has blocked cards"



    response = client.post(f"/block_figure_chart/{first_turn}/{second_turn}/{game_id}/{a.id}/{tile_id}")
    assert response.status_code == 200
    assert response.json() == {"message": "Figure card used and removed from hand"}