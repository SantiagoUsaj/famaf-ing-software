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
  // Obtener playerID desde el contexto
  const { playerID } = usePlayerContext();
  // Obtener game_id desde el contexto
  const { game_id } = useGameContext();
  const [board, setBoard] = useState([]);
  const [selectedSquares, setSelectedSquares] = useState(Array(36).fill(false));


  const handleSquareClick = (index) => {
    const newSelectedSquares = [...selectedSquares];
    newSelectedSquares[index] = !newSelectedSquares[index];
    setSelectedSquares(newSelectedSquares);
  };


  const showModal = () => {
    setIsModalOpen(true);
  };

  const winner = () => {
    // do this for 5 seconds
    var duration = 5 * 1000;
    var end = Date.now() + duration;

    (function frame() {
      // launch a few confetti from the left edge
      confetti({
        particleCount: 4,
        angle: 60,
        spread: 55,
        origin: { x: 0 },
      });
      // and launch a few from the right edge
      confetti({
        particleCount: 4,
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
        //setBoard(response.board);
        
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

  const rotateBoardLeft = (board, size) => {
    return board.map((item) => {
      const newX = item.y;
      const newY = size - 1 - item.x;
      return { ...item, x: newX, y: newY };
    });
  };

  const gameBoard = (board) => {
    const size = 6;
    const rotatedBoard = rotateBoardLeft(board, size);

    return rotatedBoard.sort((a, b) => {
      if (a.y === b.y) {
      return a.x - b.x;
      }
      return a.y - b.y;
    }).map((item) => (
      <Card
      key={item.id}
      onClick={() => handleSquareClick(item.id)}
      style={{
        width: "40px",
        height: "40px",
        backgroundColor: item.color,
        border: item.highlight ? "2px solid lightblue" : "none",
        boxShadow: selectedSquares[item.id] ? "0 0 10px 5px rgba(255, 255, 255, 0.8)" : "none",
      }}
      >
      </Card>
    ));
  };

  return (
    <div className="text-white text-center m-auto flex flex-col items-center justify-center min-h-screen">
      <div
        className="container"
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(6, 40px)",
          gap: "5px",
          justifyContent: "center",
        }}
      >
        {gameBoard(board)}
      </div>
      <div 
        className="Cards"
        style={{
          marginTop: "50px",
        }}
      >
        <FigureCard />
        <MovementCard />
      </div>
      <div className="turn text-white mt-4">
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
          <p className="text-black text-lg ">Has ganado la partida.</p>
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
