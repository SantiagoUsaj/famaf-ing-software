import React, { useEffect } from "react";
import { Table, Tag } from "antd";
import { usePlayerColor } from "../context/PlayerColorContext.jsx";

const TablePlayers = ({ playersList, isCreator }) => {
  const { playerColors, assignColorToPlayer } = usePlayerColor();

  useEffect(() => {
    playersList.forEach((player) => {
      assignColorToPlayer(player.player_id);
    });
  }, [playersList, assignColorToPlayer]);

  const columns = [
    {
      title: "Jugadores",
      dataIndex: "player_name",
      key: "player_name",
      render: (text) => <span>{text}</span>,
    },
    {
      title: "Tags",
      key: "tags",
      dataIndex: "tags",
      align: "center",
      render: (_, { tags, player_id }) => (
        <>
          {tags.map((tag) => {
            const color = playerColors[player_id]; // Usar el color del contexto
            return (
              <Tag color={color} key={tag}>
                {tag.toUpperCase()}
              </Tag>
            );
          })}
        </>
      ),
    },
  ];

  const data = playersList.map((player) => ({
    ...player,
    tags: [player.player_id === isCreator ? "Creador" : "Jugador"],
  }));

  return (
    <>
      <Table
        className="w-1/4 my-8"
        pagination={false}
        columns={columns}
        align="center"
        dataSource={data}
      />
    </>
  );
};

export default TablePlayers;
