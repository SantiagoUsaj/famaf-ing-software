from sqlalchemy import Column, Integer, String
from models.board_models import Tile
from models.game_models import engine, Base, session

class MovementChart(Base):
    __tablename__ = 'movement_chart'
    
    movementid = Column(Integer, primary_key=True, autoincrement=True)
    rot0 = Column(String, nullable=False)
    rot90 = Column(String, nullable=False)
    rot180 = Column(String, nullable=False)
    rot270 = Column(String, nullable=False)
    
    def __init__(self, rot0: str, rot90: str, rot180: str, rot270: str):
        self.rot0 = rot0
        self.rot90 = rot90
        self.rot180 = rot180
        self.rot270 = rot270
        
    @staticmethod
    def create_movement_chart(rot0: str, rot90: str, rot180: str, rot270: str):
        new_movement = MovementChart(rot0=rot0, rot90=rot90, rot180=rot180, rot270=rot270)
        session.add(new_movement)
        session.commit()
        return new_movement
    
    @staticmethod
    def get_movement_chart_by_id(movementid: int):
        return session.query(MovementChart).filter_by(movementid=movementid).first()
    
    @staticmethod
    def get_movement_chart_by_player_id(player_id: str, game_id: str):
        return session.query(MovementChart).filter_by(playerid=player_id, gameid=game_id).all()
    
    @staticmethod
    def is_table_empty():
        return session.query(MovementChart).count() == 0
    
    @staticmethod
    def get_tile_for_rotation(rotation, cordenada:Tile):
            rot = rotation.split(",")
            new_x = int(rot[0]) + cordenada.x
            new_y = int(rot[1]) + cordenada.y
            if new_x < 0 or new_x > 5 or new_y < 0 or new_y > 5:
                return None
            else:
                tile = session.query(Tile).filter_by(x=new_x, y=new_y).first()
                return tile.id if tile else None
    
    @staticmethod
    def game_movement():
        MovementChart.create_movement_chart("2,2", "-2,2", "-2,-2", "2,-2")
        MovementChart.create_movement_chart('0,2', '-2,0', '0,-2', '2,0')
        MovementChart.create_movement_chart('0,1', '-1,0', '0,-1', '1,0')
        MovementChart.create_movement_chart('1,1', '-1,1', '-1,-1', '1,-1')
        MovementChart.create_movement_chart('1,2', '-2,1', '-1,-2', '2,-1')
        MovementChart.create_movement_chart('2,1', '-1,2', '-2,-1', '1,-2')
        MovementChart.create_movement_chart('0,4', '-4,0', '0,-4', '4,0')
        
# Create the table
Base.metadata.create_all(bind=engine)

# Ejecutar game_movement solo si la tabla está vacía
if MovementChart.is_table_empty():
    MovementChart.game_movement()
    