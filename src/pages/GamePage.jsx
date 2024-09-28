import React from "react";
import MovementCard from "../components/MovementCard";
import "../styles/GamePage.css";

const GamePage = () => {
  return (
    <div className="text-white text-center m-auto">
      <h1>GamePage</h1>
      <div className="container text-white">
        <div className="hola">hola</div>
      </div>
      <MovementCard />
    </div>
  );
};
export default GamePage;
