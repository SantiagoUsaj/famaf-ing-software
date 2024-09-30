import React, { useEffect, useState } from "react";
import { Button } from "antd";
import { useNavigate } from "react-router-dom";
import TablePlayers from "../components/TablePlayers";
import LobbySquares from "../components/LobbySquares";
import { GameData, LeaveGame, StartGame } from "../services/GameServices";

const WaitingRoom = ({
  game_id,
  playerID,
  initialGameName = "",
  initialIsCreator = false,
  initialNumberOfPlayers = 0,
}) => {
  const navigate = useNavigate();
  const [gameName, setGameName] = useState(initialGameName);
  const [gamestate, setGamestate] = useState();
  const [isCreator, setIsCreator] = useState(initialIsCreator);
  const [numberOfPlayers, setNumberOfPlayers] = useState(
    initialNumberOfPlayers
  );
  const [maxNumberOfPlayers, setMaxNumberOfPlayers] = useState();
  const [playersList, setPlayersList] = useState([]);
  const [socket, setSocket] = useState(null);
  const [partidas, setPartidas] = useState([]);

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

  const start = async (game_id) => {
    console.log("Success");

    try {
      // Esperamos la resolución de la promesa de StartGame
      const response = await StartGame(playerID, game_id);

      if (response) {
        console.log("Info:", response);

        // Navegamos solo cuando la respuesta está lista
        navigate(`/${playerID}/${game_id}/game`);
      }
    } catch (error) {
      console.error("Error getting data", error);
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

      setNumberOfPlayers(data.players);
      setPlayersList(data.player_details);

      if (data.state === "playing") {
        navigate(`/${playerID}/${game_id}/game`);
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

  return (
    <div className="pt-2 flex justify-center flex-col items-center">
      <LobbySquares />
      <h1 className="text-white font-sans uppercase m-auto text-center  text-4xl">
        {gameName}
      </h1>
      <TablePlayers playersList={playersList} isCreator={isCreator} />
      <div className="flex gap-24 ">
        {playerID === isCreator && numberOfPlayers === maxNumberOfPlayers && (
          <Button
            type="primary"
            disabled={!isCreator}
            onClick={() => start(game_id)}
          >
            Iniciar Partida
          </Button>
        )}
        {playerID !== isCreator && (
          <Button danger ghost onClick={() => quitRoom(game_id)}>
            Abandonar
          </Button>
        )}
      </div>
    </div>
  );
};

export default WaitingRoom;
