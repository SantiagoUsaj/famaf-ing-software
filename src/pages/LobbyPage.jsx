import React from "react";
import { useEffect, useState, useRef } from "react";
import { Button, Slider, Switch } from "antd";
import { useNavigate } from "react-router-dom";
import LobbySquares from "../components/LobbySquares";
import TableGames from "../components/TableGames";
import { usePlayerContext } from "../context/PlayerContext.jsx";
import music from "../assets/sounds/musicaMenuAgeII.mp3";

const LobbyPage = () => {
  const navigate = useNavigate();
  const [socket, setSocket] = useState(null);
  const [partidas, setPartidas] = useState([]);
  // Obtener playerID desde el contexto
  const { playerID } = usePlayerContext();

  const audioRef = useRef(null); // Referencia para el elemento <audio>
  const [volume, setVolume] = useState(0.5); // Estado inicial del volumen (50%)

  // Función para manejar cambios en el volumen
  const handleVolumeChange = (event) => {
    const newVolume = event.target.value;
    setVolume(newVolume); // Actualiza el estado del volumen
    audioRef.current.volume = newVolume; // Cambia el volumen del audio
  };

  const [disabled, setDisabled] = useState(false);
  const onChange = (checked) => {
    setDisabled(checked);
  };

  console.log("playerID", playerID);

  const handleClick = () => {
    navigate(`/creategame`);
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

      // Agregar la clave 'key' a cada objeto en data
      const dataWithKeys = data.map((item, index) => ({
        ...item,
        key: index,
      }));

      // Actualizar la lista de partidas con los datos modificados
      setPartidas(dataWithKeys);
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
    <div>
      <LobbySquares />
      <h1 className="text-blancofondo font-sans uppercase m-auto pt-40 text-center text-4xl">
        LobbyPage
      </h1>
      <TableGames gamesList={partidas} />
      <Button
        className="flex m-auto my-3 text-blancofondo"
        type="primary"
        htmlType="submit"
        size="large"
        onClick={handleClick}
      >
        Crear Partida
      </Button>

      {/* Control de volumen vertical en la esquina inferior izquierda */}
      <div className="h-10 fixed bottom-10 left-5">
        <audio ref={audioRef} src={music} autoPlay loop />
        <Slider
          vertical
          id="volume"
          min={0}
          max={1}
          step={0.01}
          value={volume}
          onChange={(value) => handleVolumeChange({ target: { value } })}
        />
        <button onClick={() => audioRef.current.play()}>Play ▶️</button>
        <button onClick={() => audioRef.current.pause()}>Pause ⏸️</button>
      </div>
    </div>
  );
};
export default LobbyPage;
