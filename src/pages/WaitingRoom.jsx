import React, { useEffect, useState } from "react";
import { Button } from "antd";
import { useNavigate } from "react-router-dom";
import TablePlayers from "../components/TablePlayers";
import LobbySquares from "../components/LobbySquares";
import { GameData } from "../services/WaitingRoomServices";

const WaitingRoom = ({
  game_id,
  playerID,
  initialGameName = "",
  initialIsCreator = false,
  initialNumberOfPlayers = 0,
}) => {
  const navigate = useNavigate();
  const [gameName, setGameName] = useState(initialGameName);
  const [isCreator, setIsCreator] = useState(initialIsCreator);
  const [numberOfPlayers, setNumberOfPlayers] = useState(
    initialNumberOfPlayers
  );
  const [maxNumberOfPlayers, setMaxNumberOfPlayers] = useState();
  const [playersList, setPlayersList] = useState([]);

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
        setGameName(response.name);
        setIsCreator(response.creator);
        setNumberOfPlayers(response.players.length);
        setMaxNumberOfPlayers(response.max_players);
        setPlayersList(response.players);
      }
    });
  }, []);

  return (
    <div className="flex justify-center flex-col items-center">
      <LobbySquares />
      <h1 className="text-white font-sans uppercase m-auto text-center  text-4xl">
        {gameName}
      </h1>
      <TablePlayers playersList={playersList} />
      <div className="flex gap-24 ">
        {playerID === isCreator && numberOfPlayers === maxNumberOfPlayers && (
          <Button
            type="primary"
            disabled={!isCreator}
            onClick={() => navigate("/game")}
          >
            Iniciar Partida
          </Button>
        )}
        {playerID !== isCreator && (
          <Button danger ghost onClick={() => navigate("/lobby")}>
            Abandonar
          </Button>
        )}

        <button
          className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
          onClick={() =>
            setNumberOfPlayers((numberOfPlayers) => numberOfPlayers + 1)
          }
        >
          count is {numberOfPlayers}
        </button>
        <button
          className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
          onClick={() => setIsCreator((initialIsCreator) => !initialIsCreator)}
        >
          Change creator {isCreator ? "true" : "false"}
        </button>
      </div>
    </div>
  );
};

export default WaitingRoom;
