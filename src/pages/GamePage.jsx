import React, { useEffect, useState } from "react";
import { Button } from "antd";
import { useNavigate } from "react-router-dom";
import MovementCard from "../components/MovementCard";
import FigureCard from "../components/FigureCard";
import { LeaveGame } from "../services/GameServices";
import "../styles/GamePage.css";

const GamePage = ({ playerID, game_id }) => {
  const navigate = useNavigate();
  const [turn, setTurn] = useState("santiago");

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

  return (
    <div className="text-white text-center m-auto">
      <h1>GamePage</h1>
      <div className="container">
        {Array.from({ length: 36 }, (_, index) => (
          <div key={index} className="grid-item">
            <FigureCard />
          </div>
        ))}
      </div>
      <MovementCard />
      <Button danger ghost onClick={() => quitRoom(game_id)}>
        Abandonar
      </Button>
      <div className="turn text-white">
        <h3>Turno de:</h3>
        <h1>{turn}</h1>
      </div>
    </div>
  );
};
export default GamePage;
