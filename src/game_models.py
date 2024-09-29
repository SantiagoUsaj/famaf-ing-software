import uuid
from typing import List
from sqlalchemy import create_engine, Column, Integer, String, ForeignKey
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker

engine = create_engine('sqlite:///games.db', connect_args={'check_same_thread': False})
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
    turn = Column(Integer, default=1)

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
    
Base.metadata.create_all(engine)
