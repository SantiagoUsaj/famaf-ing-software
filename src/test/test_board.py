import pytest
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker
from models.game_models import Base, Table, Tile, Figures, compare_tile_with_figure
from app import find_connected_components, match_figures 

# Configura una base de datos en memoria para las pruebas
TEST_DATABASE_URL = "sqlite:///:memory:"
engine = create_engine(TEST_DATABASE_URL)
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

# Crea todas las tablas
Base.metadata.create_all(bind=engine)

@pytest.fixture(scope="module")
def db_session():
    session = SessionLocal()
    yield session
    session.close()

def test_create_table(db_session):
    # Crear una nueva tabla
    new_table = Table(gameid="game_1")
    db_session.add(new_table)
    db_session.commit()

    # Verificar que la tabla se ha creado correctamente
    table = db_session.query(Table).filter_by(gameid="game_1").first()
    assert table is not None
    assert table.gameid == "game_1"

def test_create_tile(db_session):
    # Crear una nueva tabla para asociar el tile
    new_table = Table(gameid="game_2")
    db_session.add(new_table)
    db_session.commit()

    # Crear un nuevo tile
    new_tile = Tile(x=0, y=0, color="red", table_id=new_table.id,highlight=False)
    db_session.add(new_tile)
    db_session.commit()

    # Verificar que el tile se ha creado correctamente
    tile = db_session.query(Tile).filter_by(x=0, y=0, color="red").first()
    assert tile is not None
    assert tile.x == 0
    assert tile.y == 0
    assert tile.color == "red"
    assert tile.table_id == new_table.id

def test_create_figure(db_session):
    # Crear una nueva figura
    new_figure = Figures(points="00,01,02,03")
    db_session.add(new_figure)
    db_session.commit()

    # Verificar que la figura se ha creado correctamente
    figure = db_session.query(Figures).filter_by(points="00,01,02,03").first()
    assert figure is not None
    assert figure.points == "00,01,02,03"

def test_find_connected_components(db_session):
    # Crear una nueva tabla para asociar los tiles
    new_table = Table(gameid="game_3")
    db_session.add(new_table)
    db_session.commit()

    # Crear tiles conectados
    tiles = [
        Tile(x=0, y=0, color="red", table_id=new_table.id, highlight=False),
        Tile(x=0, y=1, color="red", table_id=new_table.id, highlight=False),
        Tile(x=1, y=0, color="blue", table_id=new_table.id, highlight=False),
        Tile(x=1, y=1, color="red", table_id=new_table.id, highlight=False)
    ]
    db_session.add_all(tiles)
    db_session.commit()

    # Obtener los tiles de la base de datos
    tiles = db_session.query(Tile).all()

    # Encontrar componentes conectados
    components = find_connected_components(tiles)
    assert len(components) == 2  # Debería haber 2 componentes conectados

def test_highlight_tiles():
    # Crear tiles conectados manualmente
    tiles = [
        Tile(x=0, y=0, color="red", table_id=1, highlight=False),
        Tile(x=0, y=1, color="red", table_id=1, highlight=False),
        Tile(x=0, y=2, color="red", table_id=1, highlight=False),
        Tile(x=0, y=3, color="red", table_id=1, highlight=False)
    ]

    # Crear una figura manualmente
    new_figure = Figures(points="00,01,02,03", rot90="00,10,20,30", rot180="00,01,02,03", rot270="00,10,20,30")

    # Encontrar componentes conectados
    components = find_connected_components(tiles)

    # Encontrar y actualizar los tiles coincidentes
    matched_tiles = match_figures(components, [new_figure])

    # Verificar que los tiles coincidentes tienen el atributo highlight en True
    expected_highlighted_tiles = {
        "00": 1,
        "01": 1,
        "02": 1,
        "03": 1
    }
    # Verificar que las coordenadas esperadas tienen highlight en True
    for coord, highlight in expected_highlighted_tiles.items():
        assert matched_tiles.get(coord) == None

def test_compare_tile_with_figure(db_session):
    # Crear una nueva tabla para asociar los tiles
    new_table = Table(gameid="game_4")
    db_session.add(new_table)
    db_session.commit()

    # Crear tiles conectados
    tiles = [
        Tile(x=0, y=0, color="red", table_id=4, highlight=False),
        Tile(x=0, y=1, color="red", table_id=4, highlight=False),
        Tile(x=0, y=2, color="red", table_id=4, highlight=False),
        Tile(x=0, y=3, color="red", table_id=4, highlight=False)
    ]
    db_session.add_all(tiles)
    db_session.commit()
    tile_id = tiles[0].id
    
    result = compare_tile_with_figure(tile_id, 1)
    assert result is True

    # Obtener los tiles de la base de datos
    