import React, { useEffect, useState } from "react";
import { Button, Modal } from "antd";
import { useNavigate } from "react-router-dom";
import MovementCard from "../components/MovementCard";
import FigureCard from "../components/FigureCard";
import {
  ChangeTurn,
  LeaveGame,
  GameData,
  DeleteGame,
  PossiblesMoves,
  SwapTiles,
  UndoMovement,
  UndoAllMovements,
} from "../services/GameServices";
import "../styles/GamePage.css";
import confetti from "canvas-confetti";
import { usePlayerContext } from "../context/PlayerContext.jsx";
import { useGameContext } from "../context/GameContext.jsx";
import { UndoOutlined } from "@ant-design/icons";

const GamePage = () => {
  const navigate = useNavigate();
  const [turn, setTurn] = useState();
  const [socket, setSocket] = useState(null);
  const [gamestate, setGamestate] = useState();
  const [playersList, setPlayersList] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const { playerID } = usePlayerContext();
  const { game_id } = useGameContext();
  const [board, setBoard] = useState([]);
  const [winnerPlayer, setWinnerPlayer] = useState(null);
  // Variables para el movimiento de las fichas
  const [SelectMovCard, setSelectMovCard] = useState(null);
  const [SelectFigCard, setSelectFigCard] = useState(null);
  const [SelectFirstTitle, setSelectFirstTitle] = useState(null);
  const [SelectSecondTitle, setSelectSecondTitle] = useState(null);
  const [PossibleTiles1, setPossibleTiles1] = useState();
  const [PossibleTiles2, setPossibleTiles2] = useState();
  const [PossibleTiles3, setPossibleTiles3] = useState();
  const [PossibleTiles4, setPossibleTiles4] = useState();

  const showModal = () => {
    setIsModalOpen(true);
  };

  const winner = () => {
    var duration = 1 * 100;
    var end = Date.now() + duration;

    (function frame() {
      // launch a few confetti from the left edge
      confetti({
        particleCount: 6,
        angle: 60,
        spread: 55,
        origin: { x: 0 },
      });
      // and launch a few from the right edge
      confetti({
        particleCount: 6,
        angle: 120,
        spread: 55,
        origin: { x: 1 },
      });

      // keep going until we are out of time
      if (Date.now() < end) {
        requestAnimationFrame(frame);
      }
    })();
  };

  const quitRoom = async (game_id) => {
    console.log("Success");

    try {
      console.log("Player ID:", playerID);
      console.log("Game ID:", game_id);

      if (playerID === turn) {
        await passTurn(game_id);
      }

      // Esperamos la resolución de la promesa de LeaveGame
      const response = await LeaveGame(playerID, game_id);

      if (response) {
        console.log("New Game Info:", response);

        // Navegamos solo cuando la respuesta está lista
        navigate(`/lobby`);
      }
    } catch (error) {
      console.error("Error getting new game data", error);
    }
  };

  const passTurn = async (game_id) => {
    console.log("Success");

    try {
      console.log("Player ID:", playerID);
      console.log("Game ID:", game_id);
      // Esperamos la resolución de la promesa de LeaveGame
      const response = await ChangeTurn(playerID, game_id);

      if (response) {
        console.log("New Game Info:", response);
        resetSelect();
      }
    } catch (error) {
      console.error("Error getting new game data", error);
    }
  };

  const undoMov = async (playerID, game_id) => {
    console.log("Success");

    try {
      // Esperamos la resolución de la promesa de UndoMovement
      const response = await UndoMovement(playerID, game_id);

      if (response) {
        console.log("Undo Mov:", response);
      }
    } catch (error) {
      console.error("Error getting new game data", error);
    }
  };

  const undoallMov = async (playerID, game_id) => {
    console.log("Success");

    try {
      // Esperamos la resolución de la promesa de UndoAllMovements
      const response = await UndoAllMovements(playerID, game_id);

      if (response) {
        console.log("Undo All Mov:", response);
      }
    } catch (error) {
      console.error("Error getting new game data", error);
    }
  };

  const finishGame = async (game_id) => {
    console.log("Success");

    try {
      console.log("Game ID:", game_id);

      if (playersList.length === 1) {
        // If the player is the last one in the game, delete the game
        const response = await DeleteGame(game_id);
        if (response) {
          console.log("Game Deleted:", response);
          navigate(`/lobby`);
        }
      } else {
        // Otherwise, just leave the game
        const response = await LeaveGame(playerID, game_id);
        if (response) {
          console.log("Left Game:", response);
          navigate(`/lobby`);
        }
      }
    } catch (error) {
      console.error("Error finishing the game", error);
    }
  };

  const handleSquareClick = (index) => {
    if (index === SelectFirstTitle) {
      resetSelect();
    } else if (SelectFirstTitle === null) {
      setSelectFirstTitle(index);
      console.log(`First square ${index} clicked`);
    } else {
      setSelectSecondTitle(index);
      console.log(`Second square ${index} clicked`);
    }
  };

  const resetSelect = () => {
    setSelectFirstTitle(null);
    setSelectSecondTitle(null);
    setSelectMovCard(null);
    setPossibleTiles1(null);
    setPossibleTiles2(null);
    setPossibleTiles3(null);
    setPossibleTiles4(null);
  };

  const invertBoard = (board, size) => {
    const rows = [];
    for (let i = 0; i < size; i++) {
      rows.push(board.slice(i * size, (i + 1) * size));
    }
    // Invertir el orden de las filas
    const invertedRows = rows.reverse();
    return invertedRows.flat();
  };

  const gameBoard = (board) => {
    const size = 6;
    const invertedBoard = invertBoard(board, size);

    return invertedBoard.map((item) => (
      <Button
        key={item.id}
        disabled={playerID !== turn}
        onClick={() => handleSquareClick(item.id)}
        style={{
          width: "40px",
          height: "40px",
          backgroundColor:
            item.color === "red"
              ? "#FF5959"
              : item.color === "blue"
              ? "#45B3EB"
              : item.color === "green"
              ? "#4ade80"
              : item.color === "yellow"
              ? "#FAD05A"
              : item.color,
          border:
            item.id === PossibleTiles1 ||
            item.id === PossibleTiles2 ||
            item.id === PossibleTiles3 ||
            item.id === PossibleTiles4
              ? "5px solid #FAFAFA"
              : item.highlight
              ? `5px solid ${
                  item.color === "red"
                    ? "#bf4343"
                    : item.color === "blue"
                    ? "#3486b0"
                    : item.color === "green"
                    ? "#38a660"
                    : item.color === "yellow"
                    ? "#bb9c44"
                    : "black"
                }`
              : "none",
          boxShadow:
            item.id === SelectFirstTitle ? "0 0 10px 5px #FAFAFA" : "none",
        }}
      ></Button>
    ));
  };

  const putSwap = async () => {
    console.log("Success");

    try {
      // Esperamos la resolución de la promesa de SwapTiles
      const response = await SwapTiles(
        playerID,
        game_id,
        SelectMovCard,
        SelectFirstTitle,
        SelectSecondTitle
      );

      if (response) {
        console.log("Swap:", response);

        return response;
      }
    } catch (error) {
      console.error("Error getting game data", error);
    }
  };

  const swap = () => {
    console.log("SelectFirstTitle:", SelectFirstTitle);
    console.log("SelectSecondTitle:", SelectSecondTitle);

    if (
      SelectSecondTitle === PossibleTiles1 ||
      SelectSecondTitle === PossibleTiles2 ||
      SelectSecondTitle === PossibleTiles3 ||
      SelectSecondTitle === PossibleTiles4
    ) {
      putSwap().then((response) => {
        if (response) {
          console.log("Swap response:", response);
          setSelectMovCard(null);
          setSelectFirstTitle(null);
          setSelectSecondTitle(null);
          setPossibleTiles1(null);
          setPossibleTiles2(null);
          setPossibleTiles3(null);
          setPossibleTiles4(null);
        }
      });
    }
  };

  const getPossibleMoves = async () => {
    console.log("Success");

    try {
      // Esperamos la resolución de la promesa de PossiblesMoves
      const response = await PossiblesMoves(
        playerID,
        game_id,
        SelectMovCard,
        SelectFirstTitle
      );

      if (response) {
        console.log("Possible Moves:", response);

        return response;
      }
    } catch (error) {
      console.error("Error getting game data", error);
    }
  };

  const startMove = () => {
    if (SelectMovCard && SelectFirstTitle && playerID === turn) {
      console.log("Carta de movimineto:", SelectMovCard);
      console.log("Ficha:", SelectFirstTitle);

      getPossibleMoves().then((response) => {
        if (response) {
          setPossibleTiles1(response.tile_1);
          setPossibleTiles2(response.tile_2);
          setPossibleTiles3(response.tile_3);
          setPossibleTiles4(response.tile_4);
        }
      });
    } else {
      alert("Selecciona ambos componentes primero");
    }
  };

  const getGameInfo = async (game_id) => {
    console.log("LLame a GAMEINFO");

    try {
      // Esperamos la resolución de la promesa de GameData
      const response = await GameData(game_id);

      if (response) {
        console.log("Game Info:", response);

        return response;
      }
    } catch (error) {
      console.error("Error getting game data", error);
    }
  };

  useEffect(() => {
    // Crear la conexión WebSocket al backend
    const ws = new WebSocket(`http://127.0.0.1:8000/ws/game/${game_id}`);

    // Manejar la apertura de la conexión
    ws.onopen = () => {
      console.log("Conectado al WebSocket del lobby");
    };

    // Manejar los mensajes recibidos
    ws.onmessage = (event) => {
      const data = JSON.parse(event.data);

      console.log("Mensaje recibido:", data);

      setTurn(data.turn);
      setBoard(data.board);
      setPlayersList(data.player_details);

      if (data.players === 1) {
        showModal();
      }

      const winnerPlayer = data.player_details.find(
        (player) => player.number_of_figure_card === 0
      );

      if (winnerPlayer) {
        setWinnerPlayer(winnerPlayer.player_name);
        showModal();
      }
    };

    // Manejar el cierre de la conexión
    ws.onclose = () => {
      console.log("Conexión WebSocket cerrada");
    };

    // Guardar el WebSocket en el estado para usarlo después
    setSocket(ws);

    // Limpiar el WebSocket al desmontar el componente
    return () => {
      ws.close();
    };
  }, []);

  useEffect(() => {
    if (!gamestate) {
      getGameInfo(game_id).then((response) => {
        if (response) {
          setGamestate(response.state);
          setPlayersList(response.player_details);
        }
      });
    }
  }, []);

  useEffect(() => {
    if (SelectFirstTitle !== null && SelectMovCard !== null) {
      startMove();
    }

    if (SelectFirstTitle !== null && SelectSecondTitle !== null) {
      swap();
    }
  }, [SelectFirstTitle, SelectSecondTitle, SelectMovCard]);

  return (
    <div className="text-blancofondo text-center m-auto flex flex-col items-center justify-center min-h-screen">
      <div
        className="container"
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(6, 40px)",
          gap: "5px",
          justifyContent: "center",
          marginBottom: "20px",
        }}
      >
        {gameBoard(board)}
      </div>
      <div className="Cards">
        <FigureCard
          playersList={playersList}
          onSelectFigCard={(title) => setSelectFigCard(title)}
          updateboard={board}
        />
        <MovementCard
          onSelectMovCard={(title) => setSelectMovCard(title)}
          updateboard={board}
        />
      </div>
      <div className="turn text-blancofondo font-sans uppercase">
        <h3>Turno de:</h3>
        {playersList.map((player) => (
          <div key={player.player_id}>
            {player.player_id === turn && <h2>{player.player_name}</h2>}
          </div>
        ))}
      </div>
      <div className="botones flex flex-col gap-4 fixed bottom-32 right-1/4 ">
        <Button
          className="text-blancofondo"
          type="primary"
          disabled={playerID !== turn}
          style={{
            backgroundColor: playerID !== turn ? "#eeecec" : "#1677ff",
          }}
          onClick={() => resetSelect()}
        >
          Resetear Seleccion
        </Button>
        <Button
          className="text-blancofondo"
          type="primary"
          disabled={playerID !== turn}
          style={{
            backgroundColor: playerID !== turn ? "#eeecec" : "#1677ff",
          }}
          onClick={() => undoMov(playerID, game_id)}
          icon={
            <UndoOutlined
              style={{
                fontSize: "24px",
                display: "block",
                margin: "0 auto",
              }}
            />
          }
        >
          Deshacer Movimiento
        </Button>
        <Button
          className="text-blancofondo"
          type="primary"
          disabled={playerID !== turn}
          style={{
            backgroundColor: playerID !== turn ? "#eeecec" : "#1677ff",
          }}
          onClick={() => undoallMov(playerID, game_id)}
          icon={
            <UndoOutlined
              style={{
                fontSize: "24px",
                display: "block",
                margin: "0 auto",
              }}
            />
          }
        >
          Deshacer todos los Movimientos
        </Button>
        <Button
          className="text-blancofondo"
          type="primary"
          disabled={playerID !== turn}
          style={{
            backgroundColor: playerID !== turn ? "#eeecec" : "#1677ff",
          }}
          onClick={() => passTurn(game_id)}
        >
          Terminar Turno
        </Button>

        <Button
          className="flex flex-col gap-4"
          danger
          ghost
          onClick={() => quitRoom(game_id)}
        >
          Abandonar
        </Button>
      </div>
      <div>
        <Modal
          title="¡Felicidades!"
          open={isModalOpen}
          footer={null}
          className="text-center"
          closable={false}
        >
          <p className="text-negrofondo text-lg ">
            {winnerPlayer} ha ganado la partida
          </p>
          <Button
            className="mt-5 text-blancofondo"
            type="primary"
            onClick={() => finishGame(game_id)}
          >
            Volver al Lobby
          </Button>
        </Modal>
        {isModalOpen && winner()}
      </div>
    </div>
  );
};
export default GamePage;
