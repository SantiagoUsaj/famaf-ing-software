import React from "react";
import { Button } from "antd";
import { useNavigate } from "react-router-dom";

const LobbyPage = ({ playerID }) => {
  const navigate = useNavigate();

  const handleClick = () => {
    navigate(`/${playerID}/creategame`);
  };

  return (
    <div className="text-white text-center">
      <h1>LobbyPage</h1>
      <Button
        type="primary"
        htmlType="submit"
        size="large"
        onClick={handleClick}
      >
        Crear Partida
      </Button>
    </div>
  );
};
export default LobbyPage;
