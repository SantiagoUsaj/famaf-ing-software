import React from "react";
import { Card } from "antd";
const { Meta } = Card;
import movDiagonal from "../assets/images/movimientoDiagonal.png";

const MovementCard = () => {
  return (
    <Card
      className="text-white m-auto"
      hoverable
      style={{
        width: 150,
      }}
      cover={<img src={movDiagonal} className="moveCard" alt="Move Card" />}
    >
      <Meta title={<span style={{ fontSize: 8 }}>Movimiento Diagonal</span>} />
    </Card>
  );
};
export default MovementCard;
