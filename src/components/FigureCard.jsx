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
import { wSocketGame } from "../services/GameServices";

const FigureCard = () => {
  const { playerID } = usePlayerContext();
  const { game_id } = useGameContext();

  const ws = wSocketGame(game_id);

  const [data, setData] = useState([]);

  ws.onmessage = (event) => {
    const data = JSON.parse(event.data);

    console.log("Mensaje recibido:", data);

    const hand = data.player_details.find((p) => p.player_id === playerID);

    setData(hand.figure_cards);
  };

  const getImageForCard = (id) => {
    switch (id) {
      case 1:
        return fig01;
      case 2:
        return fig02;
      case 3:
        return fig03;
      case 4:
        return fig04;
      case 5:
        return fig05;
      case 6:
        return fig06;
      case 7:
        return fig07;
      case 8:
        return fig08;
      case 9:
        return fig09;
      case 10:
        return fig10;
      case 11:
        return fig11;
      case 12:
        return fig12;
      case 13:
        return fig13;
      case 14:
        return fig14;
      case 15:
        return fig15;
      case 16:
        return fig16;
      case 17:
        return fig17;
      case 18:
        return fig18;
      case 19:
        return fige01;
      case 20:
        return fige02;
      case 21:
        return fige03;
      case 22:
        return fige04;
      case 23:
        return fige05;
      case 24:
        return fige06;
      case 25:
        return fige07;
      default:
        return fig01;
    }
  };

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
            onClick={() => handleCardClick(item.card_id)}
            hoverable
            style={{ width: 284 / 3, height: 284 / 3 }}
            cover={
              <img
                alt={`Card ${item.card_id}`}
                src={getImageForCard(item.card_id)}
              />
            } // Add your image path here
          />
        </List.Item>
      )}
    />
  );
};
export default FigureCard;
