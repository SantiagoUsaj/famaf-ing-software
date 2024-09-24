import React, { useEffect, useState } from "react";
import { Button } from "antd";
import { useNavigate } from "react-router-dom";
import MovementCard from "../components/MovementCard";
import FigureCard from "../components/FigureCard";

const GamePage = () => {
  const navigate = useNavigate();
  const [turnOf, setTurnOf] = useState("Santi");

  return (
    <div className="text-white text-center m-auto">
      <h1>GamePage</h1>
      <MovementCard />
      <FigureCard />
      <p className="text-white font-sans m-auto text-center ">
        Es el turno de: {turnOf}
      </p>
      <Button danger ghost onClick={() => navigate("/lobby")}>
        Abandonar
      </Button>
    </div>
  );
};
export default GamePage;
