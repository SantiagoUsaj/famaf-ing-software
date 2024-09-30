import React from "react";
import MovementCard from "../components/MovementCard";
import FigureCard from "../components/FigureCard";

const GamePage = () => {
  return (
    <div className="text-white text-center">
      <h1>GamePage</h1>
      <MovementCard />
      <FigureCard />
    </div>
  );
};
export default GamePage;
