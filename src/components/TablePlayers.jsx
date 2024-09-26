import React from "react";
import { Space, Table, Tag } from "antd";

const TablePlayers = ({ playersList, isCreator }) => {
  const getRandomColor = () => {
    const colors = ["red", "blue", "green", "yellow"];
    return colors[Math.floor(Math.random() * colors.length)];
  };
  const tags = ["Creador", "Jugador"];

  const columns = [
    {
      title: "Jugadores",
      dataIndex: "name",
      key: "name",
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

  const data = [
    {
      name: "Santi Usaj",
      playerid: "sdfdsf",
    },
    {
      name: "Fede",
      playerid: "vbnbvc",
    },
    {
      name: "Afonso",
      playerid: "ytty",
    },
    {
      name: "Mateo",
      playerid: "sghjf",
    },
  ];

  const data1 = playersList.map((player) => ({
    ...player,
    tags: [player.playerid === isCreator ? "Creador" : "Jugador"],
  }));
  return (
    <>
      <Table
        className="w-1/4  my-8"
        pagination={false}
        columns={columns}
        align="center"
        dataSource={data1}
      />
      <div data-testid="table-players">Table Players Component</div>
    </>
  );
};
export default TablePlayers;
