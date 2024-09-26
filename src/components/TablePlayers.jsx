import React from "react";
import { Space, Table, Tag } from "antd";

const TablePlayers = ({ playersList, isCreator }) => {
  const columns = [
    {
      title: "Name",
      dataIndex: "name",
      key: "name",
      render: (text) => <a>{text}</a>,
    },
    {
      title: "Tags",
      key: "tags",
      dataIndex: "tags",
      render: (_, { tags }) => (
        <>
          {tags.map((tag) => {
            let color;
            if (tag === "Creador") {
              color = "volcano";
            } else {
              color = "blue";
            }
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
      key: "1",
      name: "Santi Usaj",
      tags: ["Creador"],
    },
    {
      key: "2",
      name: "Ferrari",
      tags: ["Jugador"],
    },
    {
      key: "3",
      name: "Mateo Angeli",
      tags: ["Jugador"],
    },
    {
      key: "4",
      name: "Fede Di Forte",
      tags: ["Jugador"],
    },
  ];
  return (
    <>
      <Table
        className="w-1/4  my-8"
        pagination={false}
        columns={columns}
        dataSource={playersList}
      />
      <div data-testid="table-players">Table Players Component</div>
    </>
  );
};
export default TablePlayers;
