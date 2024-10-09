from fastapi import APIRouter, HTTPException
from models.game_models import Game, session
from models.player_models import Player, PlayerGame
from models.hand_movements_models import HandMovements
from models.movement_chart_models import MovementChart
import random

router = APIRouter()

@router.get("/is_valid_movement/{game_id}/{player_id}/{movement_id}/{x}/{y}")
async def is_valid_movement(game_id: str, player_id: str, movement_id: int, x: int, y: int):
    game = session.query(Game).filter_by(gameid=game_id).first()
    if game is None:
        raise HTTPException(status_code=404, detail="Game not found")
    player = session.query(Player).filter_by(playerid=player_id).first()
    if player is None:
        raise HTTPException(status_code=404, detail="Player not found")
    movement = session.query(MovementChart).filter_by(movementid=movement_id).first()
    if movement is None:
        raise HTTPException(status_code=404, detail="Movement not found")
    elif HandMovements.player_have_movement(player_id, game_id, movement_id):
        raise HTTPException(status_code=409, detail="Player has not this movement")
    return {"is_valid": True}


@router.get("/possible_movements/{game_id}/{player_id}/{movement_id}/{tile_id}")
async def possible_movements(game_id: str, player_id: str, movement_id: int, x: int, y: int):
    game = session.query(Game).filter_by(gameid=game_id).first()
    player = session.query(Player).filter_by(playerid=player_id).first()
    movement = session.query(MovementChart).filter_by(movementid=movement_id).first()
    if game is None:
        raise HTTPException(status_code=404, detail="Game not found")
    elif player is None:
        raise HTTPException(status_code=404, detail="Player not found")
    elif movement is None:
        raise HTTPException(status_code=404, detail="Movement not found")
    elif HandMovements.player_have_movement(player_id, game_id, movement_id):
        raise HTTPException(status_code=409, detail="Player has not this movement")
    elif x < 0 or x > 5 or y < 0 or y > 5:
        raise HTTPException(status_code=400, detail="Invalid coordinates")
    else:
        movementchart = MovementChart.get_movement_chart_by_id(movement_id)
        rot0 = movementchart.rot0.split(",")
        if int(rot0[0])+x < 0 or int(rot0[0])+x > 5 or int(rot0[1])+y < 0 or int(rot0[1])+y > 5:
            retrot0 = None
        else:
            retrot0 = f"({int(rot0[0])+x}, {int(rot0[1])+y})"
            
        rot90 = movementchart.rot90.split(",")
        if int(rot90[0])+x < 0 or int(rot90[0])+x > 5 or int(rot90[1])+y < 0 or int(rot90[1])+y > 5:
            retrot90 = None
        else:
            retrot90 = f"({int(rot90[0])+x}, {int(rot90[1])+y})"
            
        rot180 = movementchart.rot180.split(",")
        if int(rot180[0])+x < 0 or int(rot180[0])+x > 5 or int(rot180[1])+y < 0 or int(rot180[1])+y > 5:
            retrot180 = None
        else:
            retrot180 = f"({int(rot180[0])+x}, {int(rot180[1])+y})"
            
        rot270 = movementchart.rot270.split(",")
        if int(rot270[0])+x < 0 or int(rot270[0])+x > 5 or int(rot270[1])+y < 0 or int(rot270[1])+y > 5:
            retrot270 = None
        else:
            retrot270 = f"({int(rot270[0])+x}, {int(rot270[1])+y})"
        
        return {"rot0": retrot0, "rot90": retrot90, "rot180": retrot180, "rot270": retrot270}
    