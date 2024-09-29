import React from "react";
import { Space, Table, Tag } from "antd";
const { Column, ColumnGroup } = Table;
import { JoinGame } from "../services/LobbyServices";
import { useNavigate } from "react-router-dom";

const TableGames = ({ gamesList, playerID }) => {
  const navigate = useNavigate();

  const data = [
    {
      key: "1",
      game_name: "Juego1",
      game_id: "1",
      game_size: "4",
      players: "3",
    },
    {
      key: "2",
      game_name: "Juego2",
      game_id: "2",
      game_size: "2",
      players: "3",
    },
    {
      key: "3",
      game_name: "Juego3",
      game_id: "3",
      game_size: "4",
      players: "3",
    },
  ];

  const join = async (game_id) => {
    console.log("Success");

    try {
      // Esperamos la resolución de la promesa de LeaveGame
      const response = await JoinGame(playerID, game_id);

      if (response) {
        console.log("New Game Info:", response);

        // Navegamos solo cuando la respuesta está lista
        navigate(`/${playerID}/${game_id}/waitingRoom`);
      }
    } catch (error) {
      console.error("Error getting new game data", error);
    }
  };

  return (
    <>
      <Table
        className="w-1/4"
        dataSource={gamesList}
        pagination={{ pageSize: 5 }}
      >
        <Column title="Nombre Partida" dataIndex="game_name" key="game_name" />
        <Column
          title="Jugadores"
          key="players"
          render={(_, record) => `${record.players} / ${record.game_size}`}
        />
        <Column
          title="Action"
          dataIndex="game_id"
          key="game_id"
          align="center"
          render={(_, record) => (
            <Space size="middle">
              {record.players < record.game_size ? (
                <button
                  className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-2 rounded"
                  onClick={() => join(record.game_id)}
                >
                  Unirme
                </button>
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
