import React, { createContext, useContext, useState, useEffect } from "react";

// Crear el contexto
const PlayerContext = createContext();

// Proveedor del contexto
export const PlayerProvider = ({ children }) => {
  const [playerID, setPlayerID] = useState(() => {
    // Al cargar la página, intento obtener el playerID del localStorage
    const storedPlayerID = localStorage.getItem("playerID");
    return storedPlayerID ? JSON.parse(storedPlayerID) : null;
  });

  // Efecto para guardar el playerID en localStorage cuando cambie
  useEffect(() => {
    if (playerID) {
      localStorage.setItem("playerID", JSON.stringify(playerID));
    }
  }, [playerID]);

  return (
    <PlayerContext.Provider value={{ playerID, setPlayerID }}>
      {children}
    </PlayerContext.Provider>
  );
};

// Hook para usar el contexto
export const usePlayerContext = () => {
  return useContext(PlayerContext);
};
