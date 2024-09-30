import React, { useEffect, useState } from "react";
import { Button } from "antd";
import { useNavigate } from "react-router-dom";
import React, { useEffect, useState } from "react";
import { Button } from "antd";
import { useNavigate } from "react-router-dom";
import MovementCard from "../components/MovementCard";
import FigureCard from "../components/FigureCard";
import ColorSquare from "../components/ColorSquare";
import { ChangeTurn, LeaveGame, GameData } from "../services/GameServices";
import "../styles/GamePage.css";
import confetti from "canvas-confetti";

const GamePage = ({ playerID, game_id }) => {
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

  const winner = () => {
    // do this for 10 seconds
    var duration = 10 * 1000;
    var end = Date.now() + duration;

    (function frame() {
      // launch a few confetti from the left edge
      confetti({
        particleCount: 7,
        angle: 60,
        spread: 55,
        origin: { x: 0 },
      });
      // and launch a few from the right edge
      confetti({
        particleCount: 7,
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
      // Esperamos la resolución de la promesa de LeaveGame
      const response = await LeaveGame(playerID, game_id);

      if (response) {
        console.log("New Game Info:", response);

        // Navegamos solo cuando la respuesta está lista
        navigate(`/lobby/${playerID}`);
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
        winner();
      }
    } catch (error) {
      console.error("Error getting new game data", error);
    }
  };

  const colorSquares = (() => {
    const colorCount = { red: 9, yellow: 9, green: 9, blue: 9 };
    const squares = [];

    for (let i = 0; i < 36; i++) {
      const availableColors = Object.keys(colorCount).filter(
        (color) => colorCount[color] > 0
      );
      const randomColor =
        availableColors[Math.floor(Math.random() * availableColors.length)];
      colorCount[randomColor]--;

      squares.push(
        <div
          key={`${randomColor}-${i}`}
          className="grid-item"
          style={{ width: "50px", height: "50px" }}
        >
          <ColorSquare color={randomColor} />
        </div>
      );
    }

    return squares;
  })();

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

  return (
    <div className="text-white text-center m-auto flex flex-col items-center justify-center min-h-screen">
      <div
        className="container"
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(6, 50px)",
          gap: "10px",
          justifyContent: "center",
        }}
      >
        {colorSquares}
      </div>
      <div className="Cards">
        <MovementCard />
        <FigureCard />
      </div>
      <div className="turn text-white mt-4">
        <h3>Turno de:</h3>
        {console.log("Turno:", turn)}
        {console.log("Players:", playersList)}
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
            Pasar Turno
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
    </div>
  );
};
export default GamePage;
