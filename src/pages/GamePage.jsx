import React, { useEffect, useState } from "react";
import { Button } from "antd";
import { useNavigate } from "react-router-dom";
import MovementCard from "../components/MovementCard";
import FigureCard from "../components/FigureCard";
import ColorSquare from "../components/ColorSquare";
import { LeaveGame } from "../services/GameServices";
import "../styles/GamePage.css";

const GamePage = ({ playerID, game_id }) => {
  const navigate = useNavigate();
  const [turn, setTurn] = useState("santiago");

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

  return (
    <div className="text-white text-center m-auto">
      <div
        className="container m-auto"
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
      </div>
      <div className="turn text-white absolute bottom-5">
        <h3>Turno de:</h3>
        <h1>{turn}</h1>
      </div>
      <div
        style={{
          position: "fixed",
          bottom: "20px",
          left: "50%",
          transform: "translateX(-50%)",
        }}
      >
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
