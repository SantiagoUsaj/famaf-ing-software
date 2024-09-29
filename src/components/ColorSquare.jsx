import React from "react";
import red_square from "../assets/images/A.svg";

const ColorSquare = ({ color }) => {
  return (
    <div
      style={{
        width: "100px",
        height: "100px",
        backgroundColor: color,
      }}
    />
  );
};
