import axios from "axios";

export const JoinLobby = async (playerName) => {
  try {
    const response = await axios.post(
      `http://127.0.0.1:8000/create_player/${playerName}`
    );

    console.log(response.data);
    console.log(typeof response.data);

    return response.data;
  } catch (error) {
    console.error("Error al obtener datos:", error);
  }
};
