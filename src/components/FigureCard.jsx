import React from "react";
import { Card } from "antd";
import fig01 from "../assets/images/fig01.svg";

const FigureCard = () => {
  return (
    <Card
      className="text-white m-auto "
      style={{
        width: 50,
      }}
      cover={<img src={fig01} className="fig01" alt="Tetris Figure Card" />}
    ></Card>
  );
};
export default FigureCard;
