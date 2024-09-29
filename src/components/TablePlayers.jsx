import React from "react";
import { Space, Table, Tag } from "antd";

const TablePlayers = ({ playersList, isCreator }) => {
  const getRandomColor = () => {
    const colors = ["red", "blue", "green", "yellow"];
    return colors[Math.floor(Math.random() * colors.length)];
  };

  const columns = [
    {
      title: "Jugadores",
      dataIndex: "player_name",
      key: "player_name",
      render: (text) => <a>{text}</a>,
    },
    {
      title: "Tags",
      key: "tags",
      dataIndex: "tags",
      align: "center",
      render: (_, { tags }) => (
        <>
          {tags.map((tag) => {
            const color = getRandomColor();
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
        className="w-1/4  my-8"
        pagination={false}
        columns={columns}
        align="center"
        dataSource={data}
      />
      <div data-testid="table-players"></div>
    </>
  );
};
export default TablePlayers;
