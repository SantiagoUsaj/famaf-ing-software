import React from "react";
import MovementCard from "../components/MovementCard";
import FigureCard from "../components/FigureCard";
import "../styles/GamePage.css";

const GamePage = () => {
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
    </div>
  );
};
export default GamePage;
