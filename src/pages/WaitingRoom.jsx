import React, { useEffect, useState } from "react";
import { Button, Flex } from "antd";
import { useNavigate } from "react-router-dom";
import TablePlayers from "../components/TablePlayers";
import LobbySquares from "../components/LobbySquares";

const WaitingRoom = () => {
  const navigate = useNavigate();
  const [gameName, setGameName] = useState("");
  const [isCreator, setIsCreator] = useState();
  const [numberOfPlayers, setNumberOfPlayers] = useState();

  useEffect(() => {
    setGameName("Partida de Prueba");
    setIsCreator(true);
    setNumberOfPlayers(4);
  }, []);

  return (
    <div className="flex justify-center flex-col items-center">
      <LobbySquares />
      <h1 className="text-white font-sans uppercase m-auto text-center  text-4xl">
        {gameName}
      </h1>
      <TablePlayers />
      <div className="flex gap-24 ">
        {isCreator && numberOfPlayers == 4 && (
          <Button
            type="primary"
            disabled={!isCreator}
            onClick={() => navigate("/game")}
          >
            Iniciar Partida
          </Button>
        )}

        {!isCreator && (
          <Button danger ghost onClick={() => navigate("/lobby")}>
            Abandonar
          </Button>
        )}
      </div>
    </div>
  );
};
export default WaitingRoom;
