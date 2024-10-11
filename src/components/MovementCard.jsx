import React, { useEffect, useState } from "react";
import { Card, List } from "antd";
import mov1 from "../assets/images/mov1.svg"; // Add your image path here
import mov2 from "../assets/images/mov2.svg"; // Add your image path here
import mov3 from "../assets/images/mov3.svg"; // Add your image path here
import mov4 from "../assets/images/mov4.svg"; // Add your image path here
import mov5 from "../assets/images/mov5.svg"; // Add your image path here
import mov6 from "../assets/images/mov6.svg"; // Add your image path here
import mov7 from "../assets/images/mov7.svg"; // Add your image path here
import { MovesHandData } from "../services/HandServices";
import { usePlayerContext } from "../context/PlayerContext.jsx";
import { useGameContext } from "../context/GameContext.jsx";

const MovementCard = () => {
  const { playerID } = usePlayerContext();
  const { game_id } = useGameContext();
  const [data, setData] = useState([]);

  const getMoves = async () => {
    console.log("Success");

    try {
      // Esperamos la resolución de la promesa de GameData
      const response = await MovesHandData(playerID, game_id);

      if (response) {
        console.log("Moves:", response);

        return response;
      }
    } catch (error) {
      console.error("Error getting game data", error);
    }
  };

  const handleCardClick = (id) => {
    console.log(`Card with title ${id} clicked`);
    const index = data.findIndex((item) => item.id === id);
    if (index !== -1) {
      const newData = [...data];
      newData.splice(index, 1);
      setData(newData);
    }
  };

  const getImageForCard = (id) => {
    switch (id) {
      case 1:
        return mov1;
      case 2:
        return mov2;
      case 3:
        return mov3;
      case 4:
        return mov4;
      case 5:
        return mov5;
      case 6:
        return mov6;
      case 7:
        return mov7;
      default:
        return mov1;
    }
  };

  useEffect(() => {
    getMoves().then((response) => {
      setData(response.ids_of_movement_charts);
      console.log("Data:", response);
    });
  }, []);

  const idObjects = data.map((movementId) => ({ id: movementId }));

  return (
    <List
      grid={{
        gutter: 0,
        column: 3,
      }}
      dataSource={idObjects}
      renderItem={(item) => (
        <List.Item style={{ display: "flex", justifyContent: "center" }}>
          <Card
            onClick={() => handleCardClick(item.id)}
            hoverable
            style={{ width: 284 / 3, height: 425 / 3 }} // Adjust the width and height as needed
            cover={
              <img alt={`Card ${item.id}`} src={getImageForCard(item.id)} />
            }
          />
        </List.Item>
      )}
    />
  );
};

export default MovementCard;
