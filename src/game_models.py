from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker
from sqlalchemy import create_engine, Column, String, Integer
from sqlalchemy import ForeignKey
import uuid

engine = create_engine('sqlite:///games.db')
Base = declarative_base()

Session = sessionmaker(bind=engine)
session = Session()

class Game(Base):
    __tablename__ = 'games'

    gameid = Column(String, primary_key=True)
    name = Column(String, nullable=False)
    state = Column(String, default="waiting")
    size = Column(Integer, nullable=False)
    host = Column(String, nullable=True)
    turn = Column(String, nullable=True)

    def __init__(self, name: str, size: int, host: str):
        self.gameid = str(uuid.uuid4())
        self.name = name
        self.size = size
        self.host = host

    def start_game(self):
        self.state = "playing"

    def get_host(self):
        return self.host
    
    def get_game_size(self):
        return self.size   
    
class Table(Base):
    __tablename__ = 'table'

    gameid = Column(String, ForeignKey('games.gameid'), primary_key=True)
    

    def __init__(self, gameid: str):
        self.gameid = gameid


# class Tile(Base):
#     __tablename__ = 'tiles'
#     id = Column(Integer, primary_key=True)
#     table_id = Column(Integer, ForeignKey('table.gameid'), nullable=False)
#     x = Column(Integer, nullable=False)
#     y = Column(Integer, nullable=False)
    
#     def __init__(self, table_id: str, x: int, y: int):
#         self.table_id = table_id
#         self.x = x
#         self.y = y
#         self.color = "white"

#     @staticmethod
#     def create_tiles_for_table(table_id: str):
#         tiles = []
#         for i in range(6):
#             for j in range(6):
#                 tiles.append(Tile(table_id=table_id, x=i, y=j))
#         session.add_all(tiles)
#         session.commit()
#         session.commit()


Base.metadata.create_all(engine)