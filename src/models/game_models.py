from sqlalchemy import Column, Integer, String, ForeignKey, create_engine
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker, relationship
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

    def __init__(self, table_id: int, x: int, y: int):
        self.table_id = table_id
        self.x = x
        self.y = y

    @staticmethod
    def create_tiles_for_table(table_id: int):
        tiles = []
        for i in range(6):
            for j in range(6):
                tiles.append(Tile(table_id=table_id, x=i, y=j))
        session.add_all(tiles)
        session.commit()


Base.metadata.create_all(engine)