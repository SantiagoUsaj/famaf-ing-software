import React, { useState } from "react";
import { Card, List } from "antd";

const MovementCard = () => {
  const [data, setData] = useState([
    {
      title: "Title 1",
    },
    {
      title: "Title 2",
    },
    {
      title: "Title 3",
    },
  ]);

  const handleCardClick = (title) => {
    console.log(`Card with title ${title} clicked`);
    setData(data.filter((item) => item.title !== title));
  };

  return (
    <List
      grid={{
        gutter: 0,
        column: 3,
      }}
      dataSource={data}
      renderItem={(item) => (
        <List.Item style={{ display: "flex", justifyContent: "center" }}>
          <Card
            title={item.title}
            onClick={() => handleCardClick(item.title)}
            hoverable
            style={{ width: 300, height: 200 }} // Adjust the width and height as needed
          >
            Card content
          </Card>
        </List.Item>
      )}
    />
  );
};

export default MovementCard;
