import React, { createContext, useContext, useState, useEffect } from "react";

// Crear el contexto
const GameContext = createContext();

// Proveedor del contexto
export const GameProvider = ({ children }) => {
  const [game_id, setGameID] = useState(() => {
    // Al cargar la página, intento obtener el game_id del localStorage
    const storedGameID = localStorage.getItem("game_id");
    return storedGameID ? JSON.parse(storedGameID) : null;
  });

  // Efecto para guardar el game_id en localStorage cuando cambie
  useEffect(() => {
    if (game_id) {
      localStorage.setItem("game_id", JSON.stringify(game_id));
    }
  }, [game_id]);

  return (
    <GameContext.Provider value={{ game_id, setGameID }}>
      {children}
    </GameContext.Provider>
  );
};

// Hook para usar el contexto
export const useGameContext = () => {
  return useContext(GameContext);
};
