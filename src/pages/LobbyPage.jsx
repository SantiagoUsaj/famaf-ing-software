import React, { useState, useEffect} from "react";
import { Button } from "antd";
import { useNavigate } from 'react-router-dom';
import GamesTable from "../components/GamesTable";
import LobbySquares from "../components/LobbySquares";


const LobbyPage = ({playerID}) => {
  const navigate = useNavigate();
  const [partidas, setPartidas] = useState([]);

  const handleClick = () => {
    navigate('/creategame'); 
  };

  useEffect(() => {
    // Create the WebSocket connection to the backend
    const ws = new WebSocket(`http://127.0.0.1:8000/ws/${playerID}`);

    // Handling connection opening
    ws.onopen = () => {
      console.log("Conectado al WebSocket del lobby");
    };

    // Handling received messages
    ws.onmessage = (event) => {
      const data = JSON.parse(event.data);

      console.log("Mensaje recibido:", data);

    // Update the list of games when connected
      setPartidas(data);
    };

    // Handling connection closure
    ws.onclose = () => {
      console.log("Conexión WebSocket cerrada");
    };

    // Clearing WebSocket 
    return () => {
      ws.close();
    };
  }, []);

  return (
    <div className="text-white text-center">
      <LobbySquares />
      <h1>LobbyPage</h1>
      <Button type="primary" htmlType="submit" size="large" onClick={handleClick}>
        Crear Partida
      </Button>
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh'}}>
        <GamesTable gamesList={gamesList} />
      </div>
    </div>


  );
};
export default LobbyPage;
