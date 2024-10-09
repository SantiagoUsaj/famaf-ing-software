from fastapi import APIRouter, HTTPException
from models.game_models import Game, session, Tile
from models.player_models import Player
from models.handMovements_models import HandMovements
from models.movementChart_models import MovementChart

router = APIRouter()

@router.get("/possible_movements/{game_id}/{player_id}/{movement_id}/{tile_id}")
async def possible_movements(game_id: str, player_id: str, movement_id: int, tile_id: int):
    game = session.query(Game).filter_by(gameid=game_id).first()
    player = session.query(Player).filter_by(playerid=player_id).first()
    movement = session.query(MovementChart).filter_by(movementid=movement_id).first()
    cordenada = session.query(Tile).filter_by(id=tile_id).first()
    if game is None:
        raise HTTPException(status_code=404, detail="Game not found")
    elif player is None:
        raise HTTPException(status_code=404, detail="Player not found")
    elif movement is None:
        raise HTTPException(status_code=404, detail="Movement not found")
    elif cordenada is None:
        raise HTTPException(status_code=404, detail="Tile not found")
    elif HandMovements.player_have_movement(player_id, game_id, movement_id):
        raise HTTPException(status_code=409, detail="Player has not this movement")
    else:
        movementchart = MovementChart.get_movement_chart_by_id(movement_id)
    
        retrot0 = MovementChart.get_tile_for_rotation(movementchart.rot0, cordenada)
        retrot90 = MovementChart.get_tile_for_rotation(movementchart.rot90, cordenada)
        retrot180 = MovementChart.get_tile_for_rotation(movementchart.rot180, cordenada)
        retrot270 = MovementChart.get_tile_for_rotation(movementchart.rot270, cordenada)
                
        return {"rot0": retrot0, "rot90": retrot90,  "rot180": retrot180, "rot270": retrot270}


@router.get("/player_movements/{game_id}/{player_id}")
async def player_movement_charts(game_id: str, player_id: str):
    game = session.query(Game).filter_by(gameid=game_id).first()
    player = session.query(Player).filter_by(playerid=player_id).first()
    if game is None:
        raise HTTPException(status_code=404, detail="Game not found")
    elif player is None:
        raise HTTPException(status_code=404, detail="Player not found")
    return {"movements": HandMovements.get_movements_charts_by_player_id(player_id, game_id)}
    