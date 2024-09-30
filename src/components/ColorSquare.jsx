import React from "react";
import red_square from "../assets/images/A.svg";
import yellow_square from "../assets/images/B.svg";
import green_square from "../assets/images/C.svg";
import blue_square from "../assets/images/D.svg";

const ColorSquare = ({ color }) => {
  const images = {
    red: red_square,
    yellow: yellow_square,
    green: green_square,
    blue: blue_square,
  };

  return (
    <img
      src={images[color]}
      alt="Color Square"
      style={{ width: "50px", height: "50px" }}
    />
  );
};

export default ColorSquare;
