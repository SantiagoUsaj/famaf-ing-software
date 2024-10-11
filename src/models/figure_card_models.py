from sqlalchemy import Column, Integer, String, Boolean, ForeignKey, create_engine
from sqlalchemy.ext.declarative import declarative_base
from models.game_models import Game, engine, Base, session
from models.player_models import Player, PlayerGame
import random

class Figure_card(Base):
    __tablename__ = "Figure_cards"

    gameid = Column(String, ForeignKey('games.gameid'), nullable=False, primary_key=True)
    playerid = Column(String, ForeignKey('players.playerid'), nullable=False, primary_key=True)
    figure = Column(Integer, nullable=False, primary_key=True)
    in_hand = Column(Boolean, default=False)
    blocked = Column(Boolean, default=False)

    def __init__(self,game_id,player_id,figure):
        self.game_id = game_id
        self.player_id = player_id
        self.figure = figure

    def take_card(self):
        self.in_hand = True

    def return_card(self):
        session.delete(self)

    def block_card(self):
        self.blocked = True
    
    def unblock_card(self):
        self.blocked = False

def shuffle(game):
    easy_figures = list(range(1, 8)) * 2
    hard_figures = list(range(9, 26)) * 2 
    random.shuffle(easy_figures)  # Mezclar las figuras
    random.shuffle(hard_figures)

    players = session.query(PlayerGame).filter_by(gameid=game).all()
    num_players = len(players)

    # Repartir las easy_figures de manera que haya 2 de cada una
    for i, figure in enumerate(easy_figures):  # Duplicar las easy_figures
        player = players[i % num_players]
        figure_card = Figure_card(game_id=game, player_id=player.playerid, figure=figure)

        session.add(figure_card)
    try:
        session.commit()
    except:
        session.rollback()
        raise

    
    for i, figure in enumerate(hard_figures):  
        player = players[i % num_players]
        figure_card = Figure_card(game_id=game, player_id=player.playerid, figure=figure)
        
        session.add(figure_card)
    try:
        session.commit()
    except:
        session.rollback()
        raise 

def take_cards(game, player):
    num_cards = 3 - session.query(Figure_card).filter_by(game_id=game, player_id=player, in_hand=True).count()
    cards = session.query(Figure_card).filter_by(game_id=game, player_id=player, in_hand=False).limit(num_cards).all()
    for card in cards:
        card.take_card()
        session.add(card)
    try:
        session.commit()
    except:
        session.rollback()
        raise

# Create the table
Base.metadata.create_all(bind=engine)