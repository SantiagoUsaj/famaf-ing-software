import uuid
from game_models import Game, engine, Base, session
from typing import List
from sqlalchemy import Column, String, Integer, create_engine, ForeignKey
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker
import random

class Player(Base):
    __tablename__ = 'players'

    playerid = Column(String, primary_key=True, default=lambda: str(uuid.uuid4()))
    name = Column(String, nullable=False)

    def __init__(self, name: str):
        self.name = name

    @staticmethod
    def get_player_by_id(playerid: str):
        return session.query(Player).filter_by(playerid=playerid).first()

    @staticmethod
    def get_all_players():
        return session.query(Player).all()

    
class PlayerGame(Base):
    __tablename__ = 'playergames'

    playerid = Column(String, ForeignKey('players.playerid'), primary_key=True)
    gameid = Column(Integer, ForeignKey('games.gameid'), primary_key=True)
    turn = Column(Integer, nullable=True, default=None)


    def __init__(self, playerid: str, gameid: int):
        self.playerid = playerid
        self.gameid = gameid
        

    @staticmethod
    def assign_random_turns(session, gameid: int):
        players_in_game = session.query(PlayerGame).filter_by(gameid=gameid).all()
        turns = list(range(1, len(players_in_game) + 1))
        random.shuffle(turns)
        
        for player_game, turn in zip(players_in_game, turns):
            player_game.turn = turn
    
    def get_count_of_players_in_game(session, gameid: int):
        return session.query(PlayerGame).filter_by(gameid=gameid).count()
        

# Create the table
Base.metadata.create_all(bind=engine)
