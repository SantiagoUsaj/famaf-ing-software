import React from "react";
import { useEffect, useState } from "react";
import { Button } from "antd";
import { useNavigate } from "react-router-dom";
import LobbySquares from "../components/LobbySquares";
import TableGames from "../components/TableGames";

const LobbyPage = ({ playerID }) => {
  const navigate = useNavigate();
  const [socket, setSocket] = useState(null);
  const [partidas, setPartidas] = useState([]);

  console.log("playerID", playerID);

  const handleClick = () => {
    navigate(`/${playerID}/creategame`);
  };

  useEffect(() => {
    // Crear la conexión WebSocket al backend
    const ws = new WebSocket(`http://127.0.0.1:8000/ws/${playerID}`);

    // Manejar la apertura de la conexión
    ws.onopen = () => {
      console.log("Conectado al WebSocket del lobby");
    };

    // Manejar los mensajes recibidos
    ws.onmessage = (event) => {
      const data = JSON.parse(event.data);

      console.log("Mensaje recibido:", data);

      // Actualizar la lista de partidas cuando se conecta
      setPartidas(data);
    };

    // Manejar el cierre de la conexión
    ws.onclose = () => {
      console.log("Conexión WebSocket cerrada");
    };

    // Guardar el WebSocket en el estado para usarlo después
    setSocket(ws);

    // Limpiar el WebSocket al desmontar el componente
    return () => {
      ws.close();
    };
  }, []);

  return (
    <div className="pt-2 flex justify-center flex-col items-center">
      <LobbySquares />
      <h1 className="text-white font-sans uppercase m-auto mt-40 text-center  text-4xl">
        LobbyPage
      </h1>
      <TableGames gamesList={partidas} />
      <Button
        className="flex m-auto my-3"
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
