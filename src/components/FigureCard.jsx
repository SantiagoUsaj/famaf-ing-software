import React, { useState } from "react";
import { Card, List } from "antd";
import fig01 from "../assets/images/fig01.svg";
import fig02 from "../assets/images/fig02.svg";
import fig03 from "../assets/images/fig03.svg";
import fig04 from "../assets/images/fig04.svg";
import fig05 from "../assets/images/fig05.svg";
import fig06 from "../assets/images/fig06.svg";
import fig07 from "../assets/images/fig07.svg";
import fig08 from "../assets/images/fig08.svg";
import fig09 from "../assets/images/fig09.svg";
import fig10 from "../assets/images/fig10.svg";
import fig11 from "../assets/images/fig11.svg";
import fig12 from "../assets/images/fig12.svg";
import fig13 from "../assets/images/fig13.svg";
import fig14 from "../assets/images/fig14.svg";
import fig15 from "../assets/images/fig15.svg";
import fig16 from "../assets/images/fig16.svg";
import fig17 from "../assets/images/fig17.svg";
import fig18 from "../assets/images/fig18.svg";
import fige01 from "../assets/images/fige01.svg";
import fige02 from "../assets/images/fige02.svg";
import fige03 from "../assets/images/fige03.svg";
import fige04 from "../assets/images/fige04.svg";
import fige05 from "../assets/images/fige05.svg";
import fige06 from "../assets/images/fige06.svg";
import fige07 from "../assets/images/fige07.svg";

const FigureCard = () => {
  const [data, setData] = useState([
    {
      title: `Title ${Math.floor(Math.random() * 7) + 1}`,
    },
    {
      title: `Title ${Math.floor(Math.random() * 7) + 1}`,
    },
    {
      title: `Title ${Math.floor(Math.random() * 7) + 1}`,
    },
  ]);

  const handleCardClick = (title) => {
    console.log(`Card with title ${title} clicked`);
    const index = data.findIndex((item) => item.title === title);
    if (index !== -1) {
      const newData = [...data];
      newData.splice(index, 1);
      setData(newData);
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
            style={{ width: 284 / 3, height: 284 / 3 }}
            cover={
              <img src={fig01} className="fig01" alt="Tetris Figure Card" />
            } // Add your image path here
          />
        </List.Item>
      )}
    />
  );
};
export default FigureCard;
