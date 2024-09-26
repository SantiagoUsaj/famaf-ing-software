import axios from "axios";

export const GameData = async (game_id) => {
  try {
    const response = await axios.get(`http://127.0.0.1:8000/game/${game_id}`);

    console.log(response.data);

    return response.data;
  } catch (error) {
    console.error("Error al obtener datos:", error);
  }
};
