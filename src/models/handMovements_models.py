from sqlalchemy import Column, Integer, String, ForeignKey
from sqlalchemy.sql import func
from models.game_models import engine, Base, session
import uuid
import random

class HandMovements(Base):
    __tablename__ = 'hand_movements'
    
    handid = Column(String, primary_key=True, default=lambda: str(uuid.uuid4()))
    movementid = Column(Integer, ForeignKey('movement_chart.movementid'), primary_key=True, nullable=False)
    playerid = Column(String, ForeignKey('players.playerid'), primary_key=True, nullable=False)
    gameid = Column(Integer, ForeignKey('games.gameid'), primary_key=True, nullable=False)
    
    def __init__(self, movementid: int, playerid: str, gameid: str):
        self.movementid = movementid
        self.playerid = playerid
        self.gameid = gameid
        
    @staticmethod
    def count_movements_by_movementid(movementid: int, gameid: str):
        return session.query(HandMovements).filter_by(movementid=movementid, gameid=gameid).count()
    
    @staticmethod
    def player_have_not_movement(playerid: str, gameid: str, movementid: int):
        return session.query(HandMovements).filter_by(playerid=playerid, gameid=gameid, movementid=movementid).count() <= 0
    
    @staticmethod
    def count_movements_charts_by_gameid_and_playerid(gameid: str, playerid: str):
        if session.query(HandMovements).filter_by(gameid=gameid, playerid=playerid).count() > 3:
            raise Exception("The player has many movements")
        return session.query(HandMovements).filter_by(gameid=gameid, playerid=playerid).count()
    
    @staticmethod
    def get_movements_charts_by_player_id(playerid: str, gameid: str):
        return session.query(HandMovements).filter_by(playerid=playerid, gameid=gameid).all()
    
    # Reparte movimientos al jugador de la partida
    @staticmethod
    def deals_moves(playerid: str, gameid: str, quantity: int):
        for _ in range(quantity):
            movement_ids = []
            for chart in range(1, 7):
                movement = HandMovements.count_movements_by_movementid(chart, gameid)
                if 0 <= movement < 7:
                    movement_ids.append(chart)
                
            if movement_ids:
                movementid = random.choice(movement_ids)
                session.add(HandMovements(movementid=movementid, playerid=playerid, gameid=gameid))
                session.commit()
                
    


# Create the table
Base.metadata.create_all(bind=engine)