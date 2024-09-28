import React, { useState } from "react";
import { Card, List } from "antd";
import mov1 from "../assets/images/mov1.svg"; // Add your image path here
import mov2 from "../assets/images/mov2.svg"; // Add your image path here
import mov3 from "../assets/images/mov3.svg"; // Add your image path here
import mov4 from "../assets/images/mov4.svg"; // Add your image path here
import mov5 from "../assets/images/mov5.svg"; // Add your image path here
import mov6 from "../assets/images/mov6.svg"; // Add your image path here
import mov7 from "../assets/images/mov7.svg"; // Add your image path here

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
        return mov1;
      case "Title 2":
        return mov2;
      case "Title 3":
        return mov3;
      default:
        return mov4;
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
