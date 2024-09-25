import React from "react";
import { render, screen } from "@testing-library/react";
import LobbySquares from "../components/LobbySquares";

describe("LobbySquares Component", () => {
  test("renders LobbySquares component", () => {
    render(<LobbySquares />);
    const lobbySquaresElement = screen.getByTestId("lobby-squares");
    expect(lobbySquaresElement).toBeInTheDocument();
  });

  test("renders all squares with correct classes", () => {
    render(<LobbySquares />);
    const squares = screen.getAllByTestId("square");
    expect(squares.length).toBe(12);

    const classNames = [
      "bg-red-400 absolute left-0 top-0 size-36 rounded-lg",
      "bg-green-400 absolute left-40 top-0 size-36 rounded-lg",
      "bg-blue-400 absolute left-80 top-0 size-36 rounded-lg",
      "bg-yellow-400 absolute left-0 top-40 size-36 rounded-lg",
      "bg-red-400 absolute left-40 top-40 size-36 rounded-lg",
      "bg-green-400 absolute left-0 top-80 size-36 rounded-lg",
      "bg-red-400 absolute bottom-0 right-0 size-36 rounded-lg",
      "bg-green-400 absolute bottom-0 right-40 size-36 rounded-lg",
      "bg-blue-400 absolute bottom-0 right-80 size-36 rounded-lg",
      "bg-yellow-400 absolute bottom-40 right-0 size-36 rounded-lg",
      "bg-red-400 absolute bottom-40 right-40 size-36 rounded-lg",
      "bg-green-400 absolute bottom-80 right-40 size-36 rounded-lg",
    ];

    squares.forEach((square, index) => {
      expect(square).toHaveClass(classNames[index]);
    });
  });
});
