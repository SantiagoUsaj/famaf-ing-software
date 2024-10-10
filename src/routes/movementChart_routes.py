from fastapi import APIRouter, HTTPException
from models.game_models import Game, session, Tile
from models.player_models import Player
from models.handMovements_models import HandMovements
from models.movementChart_models import MovementChart

router = APIRouter()

@router.get("/possible_movements/{player_id}/{game_id}/{movement_id}/{tile_id}")
async def possible_movements(player_id: str, game_id: str, movement_id: int, tile_id: int):
    game = session.query(Game).filter_by(gameid=game_id).first()
    player = session.query(Player).filter_by(playerid=player_id).first()
    cordenada = session.query(Tile).filter_by(id=tile_id).first()
    if player is None:
        raise HTTPException(status_code=404, detail="Player not found")
    elif game is None:
        raise HTTPException(status_code=404, detail="Game not found")
    elif HandMovements.player_have_not_movement(player_id, game_id, movement_id):
        raise HTTPException(status_code=409, detail="Player has not this movement")
    elif cordenada is None or cordenada.x < 0 or cordenada.x > 5 or cordenada.y < 0 or cordenada.y > 5 or tile_id > 36 or tile_id < 1:
        raise HTTPException(status_code=404, detail="Tile not found")
    else:
        movementchart = MovementChart.get_movement_chart_by_id(movement_id)
    
        retrot0 = MovementChart.get_tile_for_rotation(movementchart.rot0, cordenada)
        retrot90 = MovementChart.get_tile_for_rotation(movementchart.rot90, cordenada)
        retrot180 = MovementChart.get_tile_for_rotation(movementchart.rot180, cordenada)
        retrot270 = MovementChart.get_tile_for_rotation(movementchart.rot270, cordenada)
                
        return {"tile_1": retrot0, "tile_2": retrot90,  "tile_3": retrot180, "tile_4": retrot270}


@router.get("/player_movement_charts/{player_id}/{game_id}")
async def player_movement_charts(player_id: str, game_id: str):
    game = session.query(Game).filter_by(gameid=game_id).first()
    player = session.query(Player).filter_by(playerid=player_id).first()
    if player is None:
        raise HTTPException(status_code=404, detail="Player not found")
    elif game is None:
        raise HTTPException(status_code=404, detail="Game not found")
    return {"ids_of_movement_charts": HandMovements.get_movements_charts_by_player_id(player_id, game_id)}

@router.delete("/delete_hand_movements")
async def delete_all():
    session.query(HandMovements).delete()
    session.commit()
    return {"message": "All hand movements deleted"}
    