from sqlalchemy import Column, Integer, String, ForeignKey
from sqlalchemy.orm import relationship
from models.game_models import engine, Base, session
from models.player_models import Player
from models.movement_chart_models import MovementChart
import uuid

class HandMovemens(Base):
    __tablename__ = 'hand_movements'
    
    handid = Column(String, primary_key=True, default=lambda: str(uuid.uuid4()))
    movementid = Column(Integer, ForeignKey('movement_chart.movementid'), primary_key=True, nullable=False)
    playerid = Column(String, ForeignKey('players.playerid'), primary_key=True, nullable=False)
    gameid = Column(Integer, ForeignKey('games.gameid'), primary_key=True, nullable=False)
    
    def __init__(self, movementid: int, playerid: str, gameid: str):
        self.movementid = movementid
        self.playerid = playerid
        self.gameid = gameid
    
    # Reparte 3 movimientos al jugador de la partida
    @staticmethod
    def deals_moves(playerid: str, gameid: str):
        for _ in range(3):
            movementid = MovementChart.get_random_movement_chart_id()
            new_movement_chart = HandMovemens(movementid=movementid, playerid=playerid, gameid=gameid)
            session.add(new_movement_chart)
            session.commit()
    
    @staticmethod
    def get_movement_chart_by_id(movementid: int, playerid: str, gameid: str):
        return session.query(MovementChart).filter_by(movementid=movementid, playerid=playerid, gameid=gameid).first()
    
    @staticmethod
    def get_movement_chart_by_gameid(gameid: str):
        return session.query(MovementChart).filter_by(gameid=gameid).all()
    
    @staticmethod
    def get_movement_chart_by_playerid(playerid: str):
        return session.query(MovementChart).filter_by(playerid=playerid).all()
    
    @staticmethod
    def get_movement_chart_by_gameid_and_playerid(gameid: str, playerid: str):
        return session.query(MovementChart).filter_by(gameid=gameid, playerid=playerid).all()


# Create the table
Base.metadata.create_all(bind=engine)