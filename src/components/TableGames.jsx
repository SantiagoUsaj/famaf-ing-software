import React from "react";
import { Space, Table, Tag } from "antd";
const { Column, ColumnGroup } = Table;

const TableGames = ({ gamesList }) => {
  const data = [
    {
      key: "1",
      game_name: "Juego1",
    },
    {
      key: "2",
      game_name: "Juego2",
    },
    {
      key: "3",
      game_name: "Juego3",
    },
  ];

  return (
    <>
      <Table className="w-1/4" dataSource={gamesList}>
        <Column title="Nombre Partida" dataIndex="game_name" key="game_name" />
        <Column
          title="Action"
          key="action"
          render={(_, record) => (
            <Space size="middle">
              <button onClick={() => alert(`Joining ${record.firstName}`)}>
                Unirme
              </button>
            </Space>
          )}
        />
      </Table>
    </>
  );
};
export default TableGames;
