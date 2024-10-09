from sqlalchemy import Column, Integer, String, ForeignKey
from sqlalchemy.orm import relationship
from models.game_models import engine, Base, session
import uuid
import random

class MovementChart(Base):
    __tablename__ = 'movement_chart'
    
    movementid = Column(Integer, primary_key=True, autoincrement=True)
    rot0 = Column(String, nullable=False)
    rot90 = Column(String, nullable=False)
    rot180 = Column(String, nullable=False)
    rot270 = Column(String, nullable=False)
    quantity = Column(Integer, nullable=False)
    
    def __init__(self, rot0: str, rot90: str, rot180: str, rot270: str, quantity: int):
        self.rot0 = rot0
        self.rot90 = rot90
        self.rot180 = rot180
        self.rot270 = rot270
        self.quantity = quantity  
        
    @staticmethod
    def create_movement_chart(rot0: str, rot90: str, rot180: str, rot270: str, quantity: int):
        new_movement = MovementChart(rot0=rot0, rot90=rot90, rot180=rot180, rot270=rot270, quantity=quantity)
        session.add(new_movement)
        session.commit()
        return new_movement
    
    @staticmethod
    def get_movement_chart_by_id(movementid: int):
        return session.query(MovementChart).filter_by(movementid=movementid).first()
    
    @staticmethod
    def get_random_movement_chart_id():
        movements = session.query(MovementChart).filter(MovementChart.quantity > 0).all()
        if not movements:
            return None
        random_movement = random.choice(movements)
        random_movement.quantity -= 1
        session.commit()
        return random_movement.movementid
    
    @staticmethod
    def game_movement():
        movement1 = MovementChart.create_movement_chart("2,2", "-2,2", "-2,-2", "2,-2", 55)
        movement2 = MovementChart.create_movement_chart('0,2', '-2,0', '0,-2', '2,0', 55)
        movement3 = MovementChart.create_movement_chart('0,1', '-1,0', '0,-1', '1,0', 55)
        movement4 = MovementChart.create_movement_chart('1,1', '-1,1', '-1,-1', '1,-1', 55)
        movement5 = MovementChart.create_movement_chart('1,2', '-2,1', '-1,-2', '2,-1', 55)
        movement6 = MovementChart.create_movement_chart('-1,2', '-2,-1', '1,-2', '2,1', 55)
        movement7 = MovementChart.create_movement_chart('0,4', '-4,0', '0,-4', '4,0', 55)

    @staticmethod
    def is_table_empty():
        return session.query(MovementChart).count() == 0


# Create the table
Base.metadata.create_all(bind=engine)

# Ejecutar game_movement solo si la tabla está vacía
if MovementChart.is_table_empty():
    MovementChart.game_movement()