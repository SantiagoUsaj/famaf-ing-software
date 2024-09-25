import React, { useState } from "react";
import { Card, List } from "antd";
import cambio from "../assets/images/cambiocolor.png"; // Add your image path here
import mas2 from "../assets/images/mas2.png"; // Add your image path here
import mas4 from "../assets/images/mas4.png"; // Add your image path here

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

  const getImageForTitle = (title) => {
    switch (title) {
      case "Title 1":
        return cambio;
      case "Title 2":
        return mas2;
      case "Title 3":
        return mas4;
      default:
        return cambio;
    }
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
            cover={<img alt={item.title} src={getImageForTitle(item.title)} />} // Add your image path here
          >
            Card content
          </Card>
        </List.Item>
      )}
    />
  );
};

export default MovementCard;
