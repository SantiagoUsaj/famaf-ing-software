import React, { useEffect, useState } from "react";
import { Button } from "antd";
import { useNavigate } from "react-router-dom";
import MovementCard from "../components/MovementCard";
import FigureCard from "../components/FigureCard";
import ColorSquare from "../components/ColorSquare";

const GamePage = ({ playerID, game_id }) => {
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
    <div className="text-white text-center m-auto flex flex-col items-center justify-center min-h-screen">
      {colorSquares}

      <div className="Cards">
        <MovementCard />
        <FigureCard />
      </div>
    </div>
  );
};
export default GamePage;
