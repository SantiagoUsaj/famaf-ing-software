import React from "react";
import { Card } from "antd";
const { Meta } = Card;
import fig01 from "../assets/images/fig01.svg";

const FigureCard = () => {
  return (
    <Card
      className="text-white m-auto "
      hoverable
      style={{
        width: 150,
      }}
      cover={<img src={fig01} className="fig01" alt="Tetris Figure Card" />}
    >
      <Meta title={<span style={{ fontSize: 8 }}>Figura Tetris</span>} />
    </Card>
  );
};
export default FigureCard;
