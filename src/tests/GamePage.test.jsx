import React, { act } from "react";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { describe, it, expect, vi, beforeEach } from "vitest";
import GamePage from "../pages/GamePage"; // Asegúrate de que la ruta sea correcta
import { BrowserRouter } from "react-router-dom";
import {
  ChangeTurn,
  GameData,
  LeaveGame,
  DeleteGame,
  PossiblesMoves,
  SwapTiles,
  UndoMovement,
  UndoAllMovements,
} from "../services/GameServices";

import { usePlayerContext } from "../context/PlayerContext";
import { useGameContext } from "../context/GameContext";

// Mock useNavigate from react-router-dom
const mockNavigate = vi.fn();
vi.mock("react-router-dom", async () => {
  const actual = await vi.importActual("react-router-dom");
  return {
    ...actual,
    useNavigate: () => mockNavigate,
  };
});

// Mock usePlayerContext
vi.mock("../context/PlayerContext.jsx", () => ({
  usePlayerContext: vi.fn(),
}));

// Mock useGameContext
vi.mock("../context/GameContext.jsx", () => ({
  useGameContext: vi.fn(),
}));

vi.mock("../services/GameServices", () => ({
  GameData: vi.fn(),
  LeaveGame: vi.fn(),
  ChangeTurn: vi.fn(),
  DeleteGame: vi.fn(),
  PossiblesMoves: vi.fn(),
  SwapTiles: vi.fn(),
  UndoMovement: vi.fn(),
  UndoAllMovements: vi.fn(),
  FinishGame: vi.fn(),
  PlayerMovements: vi.fn(),
}));

vi.mock("../components/MovementCard", () => ({
  default: () => <div>MovementCard Mock</div>,
}));

vi.mock("../components/FigureCard", () => ({
  default: () => <div>FigureCard Mock</div>,
}));

// Mock WebSocket
const mockWebSocket = {
  onopen: vi.fn(),
  onmessage: vi.fn(),
  onclose: vi.fn(),
  close: vi.fn(),
};
global.WebSocket = vi.fn((url) => {
  if (!url.startsWith("http://")) {
    throw new Error(`Invalid WebSocket URL: ${url}`);
  }
  return mockWebSocket;
});

vi.mock("canvas-confetti", () => ({
  default: () => ({
    add: () => {},
    reset: () => {},
  }),
}));

describe("GamePage", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    usePlayerContext.mockReturnValue({ playerID: "player1" });
    useGameContext.mockReturnValue({ game_id: "game123" });
    render(
      <BrowserRouter>
        <GamePage />
      </BrowserRouter>
    );
  });

  it("should render the GamePage component", async () => {
    expect(screen.getByText(/Turno de:/)).toBeInTheDocument();
    expect(screen.getByText(/Abandonar/i)).toBeInTheDocument();
  });

  it("should call LeaveGame on button click", async () => {
    const { LeaveGame } = await import("../services/GameServices");

    fireEvent.click(screen.getByText(/Abandonar/i));

    expect(LeaveGame).toHaveBeenCalled();
  });

  it("should handle WebSocket messages", async () => {
    const mockMessage = {
      data: JSON.stringify({
        turn: "player2",
        board: [],
        players: 2,
      }),
    };

    act(() => mockWebSocket.onmessage(mockMessage));

    await waitFor(() => {
      expect(screen.getByText(/Turno de:/)).toBeInTheDocument();
    });
  });

  it("should call ChangeTurn on button click if it's my turn", async () => {
    const { ChangeTurn } = await import("../services/GameServices");

    // Simulate receiving a WebSocket message indicating it's the player's turn
    const mockMessage = {
      data: JSON.stringify({
        turn: "player1", // Assuming "player1" is the current player
        board: [],
        players: 2,
      }),
    };

    act(() => mockWebSocket.onmessage(mockMessage));

    fireEvent.click(screen.getByText(/Terminar Turno/i));

    await waitFor(() => {
      expect(ChangeTurn).toHaveBeenCalled();
    });
  });

  it("should call resetSelect when resetting selection", async () => {
    fireEvent.click(screen.getByText(/Resetear Seleccion/i));

    await waitFor(() => {
      expect(screen.queryByText(/First square/i)).not.toBeInTheDocument();
      expect(screen.queryByText(/Second square/i)).not.toBeInTheDocument();
    });
  });

  it("should show modal on game win", async () => {
    // Simulate receiving a WebSocket message indicating it's the player's turn
    const mockMessage = {
      data: JSON.stringify({
        turn: "player1", // Assuming "player1" is the current player
        board: [],
        players: 1,
      }),
    };

    act(() => mockWebSocket.onmessage(mockMessage));

    await waitFor(() => {
      expect(screen.getByText(/¡Felicidades!/i)).toBeInTheDocument();
    });
  });

  it("should call finishGame on modal button click", async () => {
    const { DeleteGame } = await import("../services/GameServices");

    // Simulate receiving a WebSocket message indicating it's the player's turn
    const mockMessage = {
      data: JSON.stringify({
        turn: "player1", // Assuming "player1" is the current player
        board: [],
        players: 1,
      }),
    };

    act(() => mockWebSocket.onmessage(mockMessage));

    fireEvent.click(screen.getByText(/Volver al Lobby/i));

    await waitFor(() => {
      expect(DeleteGame).toHaveBeenCalled();
    });
  });

  it("should call GameData on component mount", async () => {
    const { GameData } = await import("../services/GameServices");

    await waitFor(() => {
      expect(GameData).toHaveBeenCalledWith("game123");
    });
  });

  it("should call UndoMovement on button click", async () => {
    const { UndoMovement } = await import("../services/GameServices");

    // Simulate receiving a WebSocket message indicating it's the player's turn
    const mockMessage = {
      data: JSON.stringify({
        turn: "player1", // Assuming "player1" is the current player
        board: [],
        players: 2,
      }),
    };

    act(() => mockWebSocket.onmessage(mockMessage));

    fireEvent.click(screen.getByText(/Deshacer Movimiento/i));

    expect(UndoMovement).toHaveBeenCalled();
  });

  it("should call DeleteGame on button click", async () => {
    const { DeleteGame } = await import("../services/GameServices");

    // Simulate receiving a WebSocket message indicating it's the player's turn
    const mockMessage = {
      data: JSON.stringify({
        turn: "player1", // Assuming "player1" is the current player
        board: [],
        players: 1,
      }),
    };

    act(() => mockWebSocket.onmessage(mockMessage));

    fireEvent.click(screen.getByText(/Volver al Lobby/i));

    expect(DeleteGame).toHaveBeenCalled();
  });
});
