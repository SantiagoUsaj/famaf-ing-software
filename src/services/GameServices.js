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

export const LeaveGame = async (player_id, game_id) => {
  try {
    console.log("Player ID:", player_id);
    console.log("Game ID:", game_id);
    const response = await axios.put(
      `http://127.0.0.1:8000/leave_game/${player_id}/${game_id}`
    );

    console.log(response.data);

    return response.data;
  } catch (error) {
    console.error("Error al obtener datos:", error);
  }
};

export const StartGame = async (player_id, game_id) => {
  try {
    const response = await axios.put(
      `http://127.0.0.1:8000/start_game/${player_id}/${game_id}`
    );

    console.log(response.data);

    return response.data;
  } catch (error) {
    console.error("Error al obtener datos:", error);
  }
};
