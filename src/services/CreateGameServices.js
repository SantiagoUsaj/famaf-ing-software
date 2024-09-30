import axios from "axios";

export const CreateAGame = async (player_id, game_name, game_size) => {
  try {
    const response = await axios.post(
      `http://127.0.0.1:8000/create_game/${player_id}/${game_name}/${game_size}`
    );

    console.log(response.data);

    return response.data;
  } catch (error) {
    console.error("Error al obtener datos:", error);
  }
};
