from fastapi import APIRouter, HTTPException
from models.game_models import Game, session,Table, Tile, TableGame
from models.player_models import Player, PlayerGame
import random
    
router = APIRouter()

@router.get("/games")
async def get_games():
    games = session.query(Game).all()
    return [{"game_name": game.name, "game_id": game.gameid, "host_id": game.host,
            "state": game.state, "size": game.size, "current_player": PlayerGame.get_count_of_players_in_game(session, game.gameid), 
            "turn": game.turn} for game in games]

@router.get("/game/{game_id}")
async def get_game(game_id: str):
    game = session.query(Game).filter_by(gameid=game_id).first()
    if game is None:
        raise HTTPException(status_code=404, detail="Game not found")

    players_in_game = session.query(PlayerGame).filter_by(gameid=game.gameid).all()
    player_details = [{"player_id": pg.playerid, "player_name": session.query(Player).filter_by(playerid=pg.playerid).first().name} for pg in players_in_game]

    return {
        "game_name": game.name,
        "game_id": game.gameid,
        "state": game.state,
        "game_size": game.size,
        "players": PlayerGame.get_count_of_players_in_game(session, game.gameid),
        "player_details": player_details,
        "host_id": game.host,
        "turn": game.turn
    }

@router.post("/create_game/{player_id}/{game_name}/{game_size}")
async def create_game(player_id: str, game_name: str, game_size: int):
    try:
        if len(game_name) > 20 or not game_name.isalnum():
            raise ValueError("Game name must be less than 20 characters or alphanumeric")
        elif game_size < 2 or game_size > 4:
            raise ValueError("Game size must be between 2 and 4")
        elif (session.query(Player).filter_by(playerid=player_id).first()) is None :
            raise HTTPException(status_code=404, detail="Player not found")
        else:
            player = session.query(Player).filter_by(playerid=player_id).first()
            game = Game(game_name, game_size, player.playerid)
            playergame = PlayerGame(player.playerid, game.gameid)
            session.add(game)
            session.add(playergame)
            session.commit()
            global update
            update = True
            return {"game_id": game.gameid}
    except ValueError as e:
        raise HTTPException(status_code=400, detail=str(e))

@router.put("/join_game/{player_id}/{game_id}")
async def join_game(player_id: str, game_id: str):
    game = session.query(Game).filter_by(gameid=game_id).first()
    player = session.query(Player).filter_by(playerid=player_id).first()
    if game is None:
        raise HTTPException(status_code=404, detail="Game not found")
    elif player is None:
        raise HTTPException(status_code=404, detail="Player not found")
    elif game.state == "playing":
        raise HTTPException(status_code=409, detail="Game is already playing")
    elif session.query(PlayerGame).filter_by(gameid=game_id, playerid=player_id).count() > 0:
        raise HTTPException(status_code=409, detail="Player is already in the game")
    elif session.query(PlayerGame).filter_by(playerid=player_id).count() > 0:
        raise HTTPException(status_code=409, detail="Player is already in another game")
    elif session.query(PlayerGame).filter_by(gameid=game_id).count() == game.size:
        raise HTTPException(status_code=409, detail="Game is full")
    else:
        playergame = PlayerGame(player_id, game_id)
        session.add(playergame)
        session.commit()
        global update
        update = True
        return {"message": player.name + " joined the game " + game.name}
     

@router.put("/leave_game/{player_id}/{game_id}")
async def leave_game(player_id: str, game_id: str):
    if session.query(Game).filter_by(gameid=game_id).count() == 0:
        raise HTTPException(status_code=404, detail="Game not found")
    elif session.query(Player).filter_by(playerid=player_id).count() == 0:
        raise HTTPException(status_code=404, detail="Player not found")
    else:
        game = session.query(Game).filter_by(gameid=game_id).first()

        if game.host == player_id and game.state == "waiting":
            raise HTTPException(status_code=409, detail="You can't leave the game if you are the host")
        elif session.query(PlayerGame).filter_by(playerid=player_id, gameid=game_id).count() == 0:
            raise HTTPException(status_code=409, detail="Player is not in the game")
        else:
            session.query(PlayerGame).filter_by(playerid=player_id, gameid=game_id).delete()
            # Remove the player from the turn order if they are in it and the game is in playing state
            if game.state == "playing":
                turn_order = game.turn.split(",")
                turn_order = [pid for pid in turn_order if pid != player_id]
                game.turn = ",".join(turn_order)
            
            session.commit()
            player = session.query(Player).filter_by(playerid=player_id).first()
            global update
            update = True
            return {"message": player.name + " left the game " + game.name}

@router.put("/start_game/{player_id}/{game_id}")
async def start_game(player_id: str, game_id: str):
    if session.query(Game).filter_by(gameid=game_id).count() == 0:
        raise HTTPException(status_code=404, detail="Game not found")
    elif session.query(Player).filter_by(playerid=player_id).count() == 0:
        raise HTTPException(status_code=404, detail="Player not found")
    else:
        game = session.query(Game).filter_by(gameid=game_id).first()
        if player_id != game.host:
            raise HTTPException(status_code=409, detail="Only the host can start the game")
        elif PlayerGame.get_count_of_players_in_game(session, game_id) < game.get_game_size():
            raise HTTPException(status_code=409, detail="The game is not full")
        else:
            global update
            update = True
            game.start_game()
            player_ids = [str(player.playerid) for player in session.query(PlayerGame).filter_by(gameid=game_id).all()]
            random.shuffle(player_ids)
            game.turn = ",".join(player_ids)
            session.commit()

            # Crear una tabla para el juego y las fichas asociadas
            TableGame.create_table_for_game(game_id)
            table = session.query(Table).filter_by(gameid=game_id).first()
            tablegame = TableGame(table.id,game_id)
            session.add(tablegame)
            session.commit()
            return {"message": "Game started"}

@router.put("/next_turn/{player_id}/{game_id}")
async def next_turn(player_id: str, game_id: str):
    if session.query(Game).filter_by(gameid=game_id).count() == 0:
        raise HTTPException(status_code=404, detail="Game not found")
    elif session.query(Player).filter_by(playerid=player_id).count() == 0:
        raise HTTPException(status_code=404, detail="Player not found")
    else:
        game = session.query(Game).filter_by(gameid=game_id).first()
        if player_id != game.turn.split(",")[0]:
            raise HTTPException(status_code=409, detail="It's not your turn")
        else:
            game.turn = ",".join(game.turn.split(",")[1:] + game.turn.split(",")[:1])
            session.commit()
            update = True
            return {"message": "Next turn"}

@router.put("/swap_tiles/{player_id}/{game_id}/{tile_id1}/{tile_id2}")
async def swap_tiles(player_id: str, game_id: str, tile_id1: int, tile_id2: int):
    if session.query(Game).filter_by(gameid=game_id).count() == 0:
        raise HTTPException(status_code=404, detail="Game not found")
    elif session.query(Player).filter_by(playerid=player_id).count() == 0:
        raise HTTPException(status_code=404, detail="Player not found")
    else:
        game = session.query(Game).filter_by(gameid=game_id).first()
        if player_id != game.turn.split(",")[0]:
            raise HTTPException(status_code=409, detail="It's not your turn")
        else:
            Tile.swap_tiles_color(tile_id1, tile_id2)
            session.commit()
            return {"message": "Tiles swapped"}

@router.delete("/delete_game/{game_id}")
async def delete_game(game_id: str):
    game = session.query(Game).filter_by(gameid=game_id).first()
    if game is None:
        raise HTTPException(status_code=404, detail="Game not found")
    
    # Eliminar todas las fichas asociadas a las tablas del juego
    tables = session.query(Table).filter_by(gameid=game_id).all()
    for table in tables:
        session.query(Tile).filter_by(table_id=table.id).delete()
    
    # Eliminar todas las tablas asociadas al juego
    session.query(Table).filter_by(gameid=game_id).delete()
    
    # Eliminar todas las relaciones de jugadores con el juego
    session.query(PlayerGame).filter_by(gameid=game_id).delete()
    
    session.query(Game).filter_by(gameid=game_id).delete()
    
    session.commit()
    return {"message": "Game and all associated data deleted"}

