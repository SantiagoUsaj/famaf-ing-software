import React, { useEffect, useState } from "react";
import { Button, Modal, Card, Row, Col } from "antd";
import { useNavigate } from "react-router-dom";
import MovementCard from "../components/MovementCard";
import FigureCard from "../components/FigureCard";
//import gameBoard from "../components/Board";
import {
  ChangeTurn,
  LeaveGame,
  GameData,
  DeleteGame,
  PossiblesMoves,
  SwapTiles,
} from "../services/GameServices";
import "../styles/GamePage.css";
import confetti from "canvas-confetti";
import { usePlayerContext } from "../context/PlayerContext.jsx";
import { useGameContext } from "../context/GameContext.jsx";

const GamePage = () => {
  const navigate = useNavigate();
  const [turn, setTurn] = useState();
  const [socket, setSocket] = useState(null);
  const [gameName, setGameName] = useState();
  const [gamestate, setGamestate] = useState();
  const [isCreator, setIsCreator] = useState();
  const [numberOfPlayers, setNumberOfPlayers] = useState();
  const [maxNumberOfPlayers, setMaxNumberOfPlayers] = useState();
  const [playersList, setPlayersList] = useState([]);
  const [partidas, setPartidas] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const { playerID } = usePlayerContext();
  const { game_id } = useGameContext();
  const [board, setBoard] = useState([]);
  const [selectedSquares, setSelectedSquares] = useState(Array(36).fill(false));

  // Variables para el movimiento de las fichas
  const [SelectMovCard, setSelectMovCard] = useState(null);
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
      }
    } catch (error) {
      console.error("Error getting new game data", error);
    }
  };

  const finishGame = async (game_id) => {
    console.log("Success");

    try {
      console.log("Game ID:", game_id);
      // Esperamos la resolución de la promesa de LeaveGame
      const response = await DeleteGame(game_id);

      if (response) {
        console.log("New Game Info:", response);
        // Navegamos solo cuando la respuesta está lista
        navigate(`/lobby`);
      }
    } catch (error) {
      console.error("Error getting new game data", error);
    }
  };

  const handleSquareClick = (index) => {
    const newSelectedSquares = [...selectedSquares];
    newSelectedSquares[index] = !newSelectedSquares[index];

    setSelectedSquares(newSelectedSquares);
    if (SelectFirstTitle === null) {
      setSelectFirstTitle(index);
      console.log(`First square ${index} clicked`);
    } else {
      setSelectSecondTitle(index);
      console.log(`Second square ${index} clicked`);
    }
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
            item.highlight ||
            item.id === PossibleTiles1 ||
            item.id === PossibleTiles2 ||
            item.id === PossibleTiles3 ||
            item.id === PossibleTiles4
              ? "5px solid white"
              : "none",
          boxShadow: selectedSquares[item.id]
            ? "0 0 10px 5px rgba(255, 255, 255, 0.8)"
            : "none",
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
          setSelectedSquares(Array(36).fill(false));
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
    console.log("Success");

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
    // Llamamos a la función getGameInfo
    getGameInfo(game_id).then((response) => {
      if (response) {
        setGameName(response.game_name);
        setGamestate(response.state);
        setIsCreator(response.host_id);
        setNumberOfPlayers(response.players);
        setMaxNumberOfPlayers(response.game_size);
        setPlayersList(response.player_details);
      }
    });

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

      if (data.players === 1) {
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
        <FigureCard />
        <MovementCard onSelectMovCard={(title) => setSelectMovCard(title)} />
      </div>
      <div className="turn text-white">
        <h3>Turno de:</h3>
        {playersList.map((player) => (
          <div key={player.player_id}>
            {player.player_id === turn && <h2>{player.player_name}</h2>}
          </div>
        ))}
      </div>
      <div
        style={{
          position: "fixed",
          bottom: "20px",
          left: "50%",
          transform: "translateX(-50%)",
        }}
      >
        {playerID === turn && (
          <Button type="primary" onClick={() => passTurn(game_id)}>
            Terminar Turno
          </Button>
        )}
        <Button
          className="bottom-0"
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
          <p className="text-negrofondo text-lg ">Has ganado la partida.</p>
          <Button
            className="mt-5"
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
