import React, { useState } from "react";
import { Card, List } from "antd";
import mov1 from "../assets/images/mov1.svg"; // Add your image path here
import mov2 from "../assets/images/mov2.svg"; // Add your image path here
import mov3 from "../assets/images/mov3.svg"; // Add your image path here
import mov4 from "../assets/images/mov4.svg"; // Add your image path here
import mov5 from "../assets/images/mov5.svg"; // Add your image path here
import mov6 from "../assets/images/mov6.svg"; // Add your image path here
import mov7 from "../assets/images/mov7.svg"; // Add your image path here

const MovementCard = ({ onSelectMovCard }) => {
  const [data, setData] = useState([
    {
      title: `4`,
    },
    {
      title: `6`,
    },
    {
      title: `1`,
    },
  ]);

  const handleCardClick = (title) => {
    console.log(`Card with title ${title} clicked`);
    onSelectMovCard(title);
    /* const index = data.findIndex((item) => item.title === title);
    if (index !== -1) {
      const newData = [...data];
      newData.splice(index, 1);
      setData(newData);
    } */
  };

  const getImageForTitle = (title) => {
    switch (title) {
      case "1":
        return mov1;
      case "2":
        return mov2;
      case "3":
        return mov3;
      case "4":
        return mov4;
      case "5":
        return mov5;
      case "6":
        return mov6;
      case "7":
        return mov7;
      default:
        return mov1;
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
            onClick={() => handleCardClick(item.title)}
            hoverable
            style={{ width: 284 / 3, height: 425 / 3 }} // Adjust the width and height as needed
            cover={<img alt={item.title} src={getImageForTitle(item.title)} />} // Add your image path here
          />
        </List.Item>
      )}
    />
  );
};

export default MovementCard;
