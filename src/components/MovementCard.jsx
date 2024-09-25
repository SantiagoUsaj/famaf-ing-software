import React from "react";
import { Card, List } from "antd";

const MovementCard = () => {
  const data = [
    {
      title: "Title 1",
    },
    {
      title: "Title 2",
    },
    {
      title: "Title 3",
    },
  ];
  const handleCardClick = (title) => {
    console.log(`Card with title ${title} clicked`);
  };

  return (
    <List
      grid={{
        gutter: 0,
        column: 3,
      }}
      dataSource={data}
      bordered={true}
      renderItem={(item) => (
        <List.Item>
          <Card
            title={item.title}
            onClick={() => handleCardClick(item.title)}
            hoverable
          >
            Card content
          </Card>
        </List.Item>
      )}
    />
  );
};
export default MovementCard;
