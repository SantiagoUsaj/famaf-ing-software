from sqlalchemy import Column, Integer, String, ForeignKey, create_engine, Boolean
from sqlalchemy.orm import declarative_base
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

class Figures(Base):
    __tablename__ = 'figures'

    id = Column(Integer, primary_key=True)
    points = Column(String)
    rot90=Column(String)
    rot180=Column(String)
    rot270=Column(String)

    @staticmethod
    def detect_figures(table_id: int):
        table = session.query(Table).filter_by(id=table_id).first()
        tiles = session.query(Tile).filter_by(table_id=table_id).all()
        points = 0
        for tile in tiles:
            points += 1
            tile.highlight = True
            session.commit()
        return points
    
def find_connected_components(tiles):
    def dfs(tile, visited, component):
        stack = [tile]
        while stack:
            current_tile = stack.pop()
            if current_tile not in visited:
                visited.add(current_tile)
                component.append(current_tile)
                neighbors = [
                    t for t in tiles if (
                        t.color == current_tile.color and (
                            (t.x == current_tile.x and abs(t.y - current_tile.y) == 1) or
                            (t.y == current_tile.y and abs(t.x - current_tile.x) == 1)
                        )
                    )
                ]
                stack.extend(neighbors)
    visited = set()
    components = []
    for tile in tiles:
        if tile not in visited:
            component = []
            dfs(tile, visited, component)
            components.append(component)
    return components

def normalize_points(points):
    # Convert points to a list of tuples (x, y)
    points = [tuple(map(int, point)) for point in points]
    # Find the point with the smallest x and y values
    min_x = min(point[0] for point in points)
    min_y = min(point[1] for point in points)
    # Normalize points so that the smallest point is (0, 0)
    normalized_points = {(x - min_x, y - min_y) for x, y in points}
    return normalized_points

def match_figures(connected_components, figures):
    matching_tiles = {}
    for component in connected_components:
        component_points = {f"{tile.x}{tile.y}" for tile in component}
        normalized_component_points = normalize_points(component_points)
        matched = False
        for figure in figures:
            figure_points_variants = [
                set(figure.points.split(",")),
                set(figure.rot90.split(",")),
                set(figure.rot180.split(",")),
                set(figure.rot270.split(","))
            ]
            for figure_points in figure_points_variants:
                normalized_figure_points = normalize_points(figure_points)
                if normalized_component_points == normalized_figure_points:
                    for tile in component:
                        tile.highlight = True
                        matching_tiles[f"{tile.x}{tile.y}"] = figure.id
                    matched = True
                    break
            if matched:
                break
        if not matched:
            for tile in component:
                tile.highlight = False
    session.commit()  # Commit the changes to the database
    return matching_tiles

    def compare_tile_with_figure(tile_id: int, figure_id: int):
        tile = session.query(Tile).filter_by(id=tile_id).first()
        figure = session.query(Figures).filter_by(id=figure_id).first()
        
 
        
        # Get all tiles in the same table
        tiles = session.query(Tile).filter_by(table_id=tile.table_id).all()
        
        # Find connected components starting from the given tile
        connected_components = find_connected_components(tiles)
        
        # Find the component that contains the given tile
        component = next((comp for comp in connected_components if tile in comp), None)
        
        if not component:
            return False
        
        # Normalize the component points
        component_points = {f"{t.x}{t.y}" for t in component}
        normalized_component_points = normalize_points(component_points)
        
        # Get all rotations of the figure points
        figure_points_variants = [
            set(figure.points.split(",")),
            set(figure.rot90.split(",")),
            set(figure.rot180.split(",")),
            set(figure.rot270.split(","))
        ]
        
        # Check if any rotation of the figure matches the component
        for figure_points in figure_points_variants:
            normalized_figure_points = normalize_points(figure_points)
            if normalized_component_points == normalized_figure_points:
                return True
        
        return False