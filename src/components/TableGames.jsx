import React from "react";
import { Space, Table, Tag } from "antd";
const { Column, ColumnGroup } = Table;
import { JoinGame } from "../services/LobbyServices";
import { useNavigate } from "react-router-dom";
import { usePlayerContext } from "../context/PlayerContext.jsx";
import { useGameContext } from "../context/GameContext.jsx";

const TableGames = ({ gamesList }) => {
  const navigate = useNavigate();
  const { playerID } = usePlayerContext();
  const { setGameID } = useGameContext();

  const join = async (game_id) => {
    console.log("Success");

    try {
      // Esperamos la resolución de la promesa de LeaveGame
      const response = await JoinGame(playerID, game_id);

      if (response) {
        console.log("New Game Info:", response);

        // Actualizar el gameID en el contexto
        setGameID(game_id);

        // Navegamos solo cuando la respuesta está lista
        navigate(`/waitingRoom`);
      }
    } catch (error) {
      console.error("Error getting new game data", error);
    }
  };

  return (
    <>
      <Table
        className="w-1/4 m-auto my-2 rounded-lg"
        dataSource={gamesList}
        pagination={{ pageSize: 5, size: "small" }} // Set pagination size to small
        style={{ backgroundColor: "#fafafa" }} // Set background color for pagination
      >
        <Column
          title={<div style={{ textAlign: "center" }}>Nombre Partida</div>}
          dataIndex="game_name"
          key="game_name"
        />
        <Column
          className="text-center"
          title={<div style={{ textAlign: "center" }}>Jugadores</div>}
          key="players"
          render={(_, record) =>
            record.state === "playing"
              ? `${record.game_size} / ${record.game_size}`
              : `${record.players} / ${record.game_size}`
          }
        />
        <Column
          title={<div style={{ textAlign: "center" }}>Estado</div>}
          dataIndex="game_id"
          key="game_id"
          align="center"
          render={(_, record) => (
            <Space size="middle">
              {record.state === "waiting" &&
              record.players < record.game_size ? (
                <button
                  className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-2 rounded"
                  onClick={() => join(record.game_id)}
                >
                  Unirme
                </button>
              ) : record.state === "playing" ? (
                <span className="text-green-500 font-bold">Jugando</span>
              ) : (
                <span className="text-red-500 font-bold">Sala llena</span>
              )}
            </Space>
          )}
        />
      </Table>
    </>
  );
};
export default TableGames;
