from fastapi import FastAPI, HTTPException, WebSocket, WebSocketDisconnect
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import Dict
from game_models import Game, session 
from player_models import Player, PlayerGame
from fastapi.responses import HTMLResponse
from manager_models import ConnectionManager

app = FastAPI()

manager = ConnectionManager()
update=False

# Configurar el middleware de CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"],  # Puedes permitir solo este origen o usar ["*"] para permitir todos
    allow_credentials=True,
    allow_methods=["*"],  # Permite todos los métodos (GET, POST, etc.)
    allow_headers=["*"],  # Permite todas las cabeceras
)

@app.get("/players")
async def get_players():
    players = session.query(Player).all()
    return [{"player_name": player.name, "player_id": player.playerid} for player in players]

@app.get("/games")
async def get_games():
    games = session.query(Game).all()
    return [{"game_name": game.name, "game_id": game.gameid, "host_id": game.host, "state": game.state,"size":game.size,"current player":PlayerGame.get_count_of_players_in_game(session,game.gameid)} for game in games]

@app.get("/game/{game_id}")
async def get_game(game_id: str):
    game = session.query(Game).filter_by(gameid=game_id).first()
    if game is None:
        return {"message": "Game not found"}
    return game

@app.get("/player/{player_id}")
async def get_player(player_id: str):
    player = session.query(Player).filter_by(playerid=player_id).first()
    if player is None:
        return {"message": "Player not found"}
    return player

@app.get("/players_in_game/{game_id}")
async def get_players_in_game(game_id: str):
    game = session.query(Game).filter_by(gameid=game_id).first()
    if game is None:
        return {"message": "Game not found"}
    else:
        player_games = session.query(PlayerGame).filter_by(gameid=game_id).all()
        players_in_game = [session.query(Player).filter_by(playerid=pg.playerid).first() for pg in player_games]
        return [{"player_name": player.name, "player_id": player.playerid} for player in players_in_game]

@app.post("/create_player/{player_name}")
async def create_player(player_name: str):
    try:
        if len(player_name) > 20 or not player_name.isalnum():
            raise ValueError("Player name must be less than 20 character or alphanumeric")
        player = Player(player_name)
        session.add(player)
        session.commit()
        return {"player_id": player.playerid}
    except ValueError as e:
        raise HTTPException(status_code=400, detail=str(e))

@app.post("/create_game/{player_id}/{game_name}/{game_size}")
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

@app.put("/join_game/{player_id}/{game_id}")
async def join_game(player_id: str, game_id: str):
    game = session.query(Game).filter_by(gameid=game_id).first()
    player = session.query(Player).filter_by(playerid=player_id).first()
    if game is None:
        raise HTTPException(status_code=404, detail="Game not found")
    elif player is None:
        raise HTTPException(status_code=404, detail="Player not found")
    elif game.state == "playing":
        raise HTTPException(status_code=404, detail="Game is already playing")
    elif session.query(PlayerGame).filter_by(gameid=game_id, playerid=player_id).count() > 0:
        raise HTTPException(status_code=409, detail="Player is already in the game")
    elif session.query(PlayerGame).filter_by(playerid=player_id).count() > 0:
        raise HTTPException(status_code=409, detail="Player is already in another game")
    elif session.query(PlayerGame).filter_by(gameid=game_id).count() == game.size:
        raise HTTPException(status_code=409, detail="Game is full")
    elif game.state == "playing":
        raise HTTPException(status_code=409, detail="Game is already playing")
    else:
        playergame = PlayerGame(player_id, game_id)
        session.add(playergame)
        session.commit()
        update = True
        return {"message": player.name + " joined the game " + game.name}
     
@app.put("/leave_game/{player_id}/{game_id}")
async def leave_game(player_id: str, game_id: str):
    if session.query(Game).filter_by(gameid=game_id).count() == 0:
        raise HTTPException(status_code=404, detail="Game not found")
    elif session.query(Player).filter_by(playerid=player_id).count() == 0:
        raise HTTPException(status_code=404, detail="Player not found")
    else:
        game = session.query(Game).filter_by(gameid=game_id).first()

        if game.host == player_id:
            raise HTTPException(status_code=409, detail="You can't leave the game if you are the host")
        elif session.query(PlayerGame).filter_by(playerid=player_id, gameid=game_id).count() == 0:
            raise HTTPException(status_code=409, detail="Player is not in the game")
        else:
            session.query(PlayerGame).filter_by(playerid=player_id, gameid=game_id).delete()
            player = session.query(Player).filter_by(playerid=player_id).first()
            global update
            update = True
            return {"message": player.name + " left the game " + game.name}
    
@app.put("/start_game/{player_id}/{game_id}")
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
            game.start_game()
            PlayerGame.assign_random_turns(session, game_id)
            session.commit()
            update = True
            return {"message": "Game started"}
        
@app.delete("/delete_player/{player_id}")
async def delete_player(player_id: str):
    player = session.query(Player).filter_by(playerid=player_id).first()
    if player is None:
        raise HTTPException(status_code=404, detail="Player not found")
    else:
        session.query(PlayerGame).filter_by(playerid=player_id).delete()
        session.query(Player).filter_by(playerid=player_id).delete()
        session.commit()
        return {"message": "Player deleted"}

@app.delete("/delete_game/{game_id}")
async def delete_game(game_id: str):
    game = session.query(Game).filter_by(gameid=game_id).first()
    if game is None:
        raise HTTPException(status_code=404, detail="Game not found")
    else:
        session.query(PlayerGame).filter_by(gameid=game_id).delete()
        session.query(Game).filter_by(gameid=game_id).delete()
        session.commit()
        return {"message": "Game deleted"}

@app.delete("/delete_all")
async def delete_all():
    session.query(PlayerGame).delete()
    session.query(Game).delete()
    session.query(Player).delete()
    session.commit()
    return {"message": "All players and games deleted"}

@app.websocket("/ws/{player_id}")
async def websocket_endpoint(websocket: WebSocket, player_id: str):
    await manager.connect(websocket)
    try:
        while True:
            games = session.query(Game).all()
            game_list = [{"game_name": game.name, "game_id": game.gameid,
                          "state": game.state, "game_size": game.size, "players": PlayerGame.get_count_of_players_in_game(session, game.gameid)} for game in games]
            await websocket.send_json(game_list)
    except WebSocketDisconnect:
        manager.disconnect(websocket)
        await manager.broadcast(f"Client #{player_id} left the chat")
        