from fastapi import FastAPI, WebSocket, WebSocketDisconnect
from fastapi.middleware.cors import CORSMiddleware
from models.manager_models import ConnectionManager
from routes.player_routes import router as player_router
from routes.game_routes import router as game_router
import asyncio
from models.game_models import Game, session
from models.player_models import PlayerGame, Player

app = FastAPI()

manager = ConnectionManager()
game_managers = {}

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(player_router,tags=["player"])
app.include_router(game_router,tags=["game"])

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
            gamelist = []
            for game in games:
                players_in_game = session.query(PlayerGame).filter_by(gameid=game.gameid).all()
                player_details = [{"player_id": pg.playerid, "player_name": session.query(Player).filter_by(playerid=pg.playerid).first().name} for pg in players_in_game]
                gamelist.append({
                    "game_name": game.name,
                    "game_id": game.gameid,
                    "state": game.state,
                    "game_size": game.size,
                    "players": PlayerGame.get_count_of_players_in_game(session, game.gameid),
                    "player_details": player_details
                })
            await websocket.send_json(gamelist)
            await asyncio.sleep(1)  # Delay to avoid flooding the client with messages

    except WebSocketDisconnect:
        manager.disconnect(websocket)
        await manager.broadcast(f"Client #{player_id} left the chat")

@app.websocket("/ws/game/{game_id}")
async def game_websocket_endpoint(websocket: WebSocket, game_id: str):
    await manager.connect(websocket)
    try:
        while True:
            game = session.query(Game).filter_by(gameid=game_id).first()
            if game is None:
                await websocket.send_json({"error": "Game not found"})
                break

            players_in_game = session.query(PlayerGame).filter_by(gameid=game_id).all()
            player_details = [{"player_id": pg.playerid, "player_name": session.query(Player).filter_by(playerid=pg.playerid).first().name} for pg in players_in_game]
            turnos=game.turn
            if(turnos!=None):
                turnos=turnos.split(",")
                turnos=turnos[0]

            game_details = {
                "game_name": game.name,
                "game_id": game.gameid,
                "state": game.state,
                "game_size": game.size,
                "players": PlayerGame.get_count_of_players_in_game(session, game.gameid),
                "player_details": player_details,
                "turn": turnos
            }
        
           

            await websocket.send_json(game_details)
            await asyncio.sleep(1)  # Delay to avoid flooding the client with messages


    except WebSocketDisconnect:
        await game_managers[game_id].disconnect(websocket)
        await game_managers[game_id].broadcast(f"Client #{game_id} left the chat")
        