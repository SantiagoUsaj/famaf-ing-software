from fastapi import APIRouter, HTTPException
from models.game_models import Game, session
from models.board_models import Tile,get_connected_component_for_tile_by_number,match_figures,Table,Figures,normalize_points
from models.player_models import Player
from models.handMovements_models import HandMovements
from models.movementChart_models import MovementChart
from models.figure_card_models import Figure_card
from models.partialMovements_models import PartialMovements, get_partial_movements_by_movement_id
router = APIRouter()

@router.get("/possible_movements/{player_id}/{game_id}/{movement_id}/{tile_id}")
async def possible_movements(player_id: str, game_id: str, movement_id: str, tile_id: str):
    game = session.query(Game).filter_by(gameid=game_id).first()
    player = session.query(Player).filter_by(playerid=player_id).first()
    cordenada = session.query(Tile).filter_by(id=tile_id).first()
    if player is None:
        raise HTTPException(status_code=404, detail="Player not found")
    elif game is None:
        raise HTTPException(status_code=404, detail="Game not found")
    elif HandMovements.player_have_not_movement(player_id, game_id, movement_id):
        raise HTTPException(status_code=409, detail="Player has not this movement")
    elif cordenada is None or cordenada.x < 0 or cordenada.x > 5 or cordenada.y < 0 or cordenada.y > 5 or int(tile_id) > 36 or int(tile_id) < 1:
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

@router.post("/use_figure_chart/{player_id}/{game_id}/{figure_id}/{tile_id}")
async def use_figure_chart(player_id: str, game_id: str, figure_id: int, tile_id: int):
    game = session.query(Game).filter_by(gameid=game_id).first()
    player = session.query(Player).filter_by(playerid=player_id).first()
    table = session.query(Table).filter_by(gameid=game_id).first()
    tile = session.query(Tile).filter_by(number=tile_id, table_id=table.id).first() if table else None
    figures_card = session.query(Figure_card).filter_by(playerid=player_id, in_hand=1).all()
    figure_card = session.query(Figure_card).filter_by(playerid=player_id, in_hand=1, figure=figure_id).first()
    if player is None:
        raise HTTPException(status_code=404, detail="Player not found")
    elif game is None:
        raise HTTPException(status_code=404, detail="Game not found")
    elif not any(figure.figure == figure_id for figure in figures_card):
        raise HTTPException(status_code=409, detail="Player has not this figure")
    else:
        components = get_connected_component_for_tile_by_number(tile)
        figure = session.query(Figures).filter_by(id=figure_card.figure).first()
        if check_tile_coordinates_with_rotations(figure, components):
            movimientos_parciales = get_partial_movements_by_movement_id(game_id)
            for movimiento in movimientos_parciales:
                session.delete(movimiento)
            session.delete(figure_card)
            session.commit()
            
            return {"message": "Figure card used and removed from hand"}
        else:
            raise HTTPException(status_code=409, detail="Figure does not match the tile configuration")

@router.delete("/delete_hand_movements")
async def delete_all():
    session.query(HandMovements).delete()
    session.commit()
    return {"message": "All hand movements deleted"}
    
def check_tile_coordinates_with_rotations(figure, tiles):
    rotations = [
        normalize_points(figure.rot90.split(",")),
        normalize_points(figure.rot180.split(",")),
        normalize_points(figure.rot270.split(",")),
        normalize_points(figure.points.split(","))
    ]
    
    tile_coords = normalize_points([(tile.x, tile.y) for tile in tiles])
    
    for rotation in rotations:
        rotation_coords = [(int(coord[0]), int(coord[1])) for coord in rotation]
        if sorted(tile_coords) == sorted(rotation_coords):
            return True
    return False