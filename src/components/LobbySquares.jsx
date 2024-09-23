import React from "react";

const LobbySquares = () => {
  return (
    <>
      <div className="square bg-red-400 absolute left-0 top-0 size-36 rounded-lg" />
      <div className="square bg-green-400 absolute left-40 top-0 size-36 rounded-lg" />
      <div className="square bg-blue-400 absolute left-80 top-0 size-36 rounded-lg" />
      <div className="square bg-yellow-400 absolute left-0 top-40 size-36 rounded-lg" />
      <div className="square bg-red-400 absolute left-40 top-40 size-36 rounded-lg" />
      <div className="square bg-green-400 absolute left-0 top-80 size-36 rounded-lg" />
      <div className="square bg-red-400 absolute bottom-0 right-0 size-36 rounded-lg" />
      <div className="square bg-green-400 absolute bottom-0 right-40 size-36 rounded-lg" />
      <div className="square bg-blue-400 absolute bottom-0 right-80 size-36 rounded-lg" />
      <div className="square bg-yellow-400 absolute bottom-40 right-0 size-36 rounded-lg" />
      <div className="square bg-red-400 absolute bottom-40 right-40 size-36 rounded-lg" />
      <div className="square bg-green-400 absolute bottom-80 right-40 size-36 rounded-lg" />
    </>
  );
};
export default LobbySquares;
