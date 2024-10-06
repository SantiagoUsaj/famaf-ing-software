from sqlalchemy import Column, Integer, String, ForeignKey, create_engine, Boolean
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker, relationship
import random
import uuid
import os
# Crear la carpeta "base de datos" si no existe
if not os.path.exists('database'):
    os.makedirs('database')

# Configurar el motor de la base de datos para usar un archivo SQLite en la carpeta "base de datos"
engine = create_engine('sqlite:///database/games.db', connect_args={'check_same_thread': False})
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

    id = Column(Integer, primary_key=True)
    gameid = Column(String, ForeignKey('games.gameid'), nullable=False)
    tiles = relationship("Tile", backref="table")
    

    def __init__(self, gameid: str):
        self.gameid = gameid

class Tile(Base):
    __tablename__ = 'tiles'
    id = Column(Integer, primary_key=True)
    table_id = Column(Integer, ForeignKey('table.id'), nullable=False)
    x = Column(Integer, nullable=False)
    y = Column(Integer, nullable=False)
    color = Column(String, default="white")
    highlight = Column(Boolean, default=False)

    def __init__(self, table_id: int, x: int, y: int, color: str, highlight: bool):
        self.table_id = table_id
        self.x = x
        self.y = y
        self.color = color
        self.highlight = False

    @staticmethod
    def create_tiles_for_table(table_id: int):
        colors = ['red', 'green', 'yellow', 'blue']
        tiles = []
        color_distribution = colors * 9  # 36 tiles, 9 of each color
        random.shuffle(color_distribution)
        
        for i in range(6):
            for j in range(6):
                color = color_distribution.pop()
                tiles.append(Tile(table_id=table_id, x=i, y=j, color=color, highlight=False))
        session.add_all(tiles)
        session.commit()

    @staticmethod
    def swap_tiles_color(tile_id1: int, tile_id2: int):
        tile1 = session.query(Tile).filter_by(id=tile_id1).first()
        tile2 = session.query(Tile).filter_by(id=tile_id2).first()
        if tile1 and tile2:
            tile1.color, tile2.color = tile2.color, tile1.color
            session.commit()

class TableGame(Base):
    __tablename__ = 'tablegames'

    tableid = Column(Integer, ForeignKey('table.id'), primary_key=True)
    gameid = Column(String, ForeignKey('games.gameid'), primary_key=True)

    def __init__(self, tableid: int, gameid: str):
        self.tableid = tableid
        self.gameid = gameid

    @staticmethod
    def create_table_for_game(gameid: str):
        table = Table(gameid)
        session.add(table)
        session.commit()
        Tile.create_tiles_for_table(table.id)

Base.metadata.create_all(engine)