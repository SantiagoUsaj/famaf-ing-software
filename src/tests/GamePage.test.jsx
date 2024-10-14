import React, { act } from "react";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { describe, it, expect, vi, beforeEach } from "vitest";
import GamePage from "../pages/GamePage"; // Asegúrate de que la ruta sea correcta
import { BrowserRouter } from "react-router-dom";
import { ChangeTurn, PlayerMovements } from "../services/GameServices";
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

  it("should call ChangeTurn on button click", async () => {
    const { ChangeTurn } = await import("../services/GameServices");

    fireEvent.click(screen.getByText(/Terminar Turno/i));

    await waitFor(() => {
      expect(ChangeTurn).toHaveBeenCalled();
    });
  });

  it("should call LeaveGame when quitting the room", async () => {
    const { LeaveGame } = await import("../services/GameServices");

    fireEvent.click(screen.getByText(/Abandonar/i));

    await waitFor(() => {
      expect(LeaveGame).toHaveBeenCalled();
    });
  });

  it("should call UndoMovement when undoing a movement", async () => {
    const { UndoMovement } = await import("../services/GameServices");

    fireEvent.click(screen.getByText(/Deshacer Movimiento/i));

    await waitFor(() => {
      expect(UndoMovement).toHaveBeenCalled();
    });
  });

  it("should call UndoAllMovements when undoing all movements", async () => {
    const { UndoAllMovements } = await import("../services/GameServices");

    fireEvent.click(screen.getByText(/Deshacer todos los Movimientos/i));

    await waitFor(() => {
      expect(UndoAllMovements).toHaveBeenCalled();
    });
  });

  it("should call DeleteGame when finishing the game", async () => {
    const { DeleteGame } = await import("../services/GameServices");

    fireEvent.click(screen.getByText(/Volver al Lobby/i));

    await waitFor(() => {
      expect(DeleteGame).toHaveBeenCalled();
    });
  });

  it("should call resetSelect when resetting selection", async () => {
    fireEvent.click(screen.getByText(/Resetear Seleccion/i));

    await waitFor(() => {
      expect(screen.queryByText(/First square/i)).not.toBeInTheDocument();
      expect(screen.queryByText(/Second square/i)).not.toBeInTheDocument();
    });
  });

  it("should call PossiblesMoves on component mount", async () => {
    const { PossiblesMoves } = await import("../services/GameServices");

    await waitFor(() => {
      expect(PossiblesMoves).toHaveBeenCalled();
    });
  });

  it("should call SwapTiles on valid swap", async () => {
    const { SwapTiles } = await import("../services/GameServices");

    fireEvent.click(screen.getByText(/First square/i));
    fireEvent.click(screen.getByText(/Second square/i));

    await waitFor(() => {
      expect(SwapTiles).toHaveBeenCalled();
    });
  });

  it("should show modal on game win", async () => {
    fireEvent.click(screen.getByText(/Ganar/i));

    await waitFor(() => {
      expect(screen.getByText(/¡Felicidades!/i)).toBeInTheDocument();
    });
  });

  it("should call finishGame on modal button click", async () => {
    const { DeleteGame } = await import("../services/GameServices");

    fireEvent.click(screen.getByText(/Ganar/i));
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

  it("should call startMove when SelectFirstTitle and SelectMovCard are set", async () => {
    const { PossiblesMoves } = await import("../services/GameServices");

    fireEvent.click(screen.getByText(/First square/i));
    fireEvent.click(screen.getByText(/Second square/i));

    await waitFor(() => {
      expect(PossiblesMoves).toHaveBeenCalled();
    });
  });

  it("should call swap when SelectFirstTitle and SelectSecondTitle are set", async () => {
    const { SwapTiles } = await import("../services/GameServices");

    fireEvent.click(screen.getByText(/First square/i));
    fireEvent.click(screen.getByText(/Second square/i));

    await waitFor(() => {
      expect(SwapTiles).toHaveBeenCalled();
    });
  });

  it("should call UndoMovement on button click", async () => {
    const { UndoMovement } = await import("../services/GameServices");

    fireEvent.click(screen.getByText(/Deshacer Movimiento/i));

    expect(UndoMovement).toHaveBeenCalled();
  });

  it("should call UndoAllMovements on button click", async () => {
    const { UndoAllMovements } = await import("../services/GameServices");

    fireEvent.click(screen.getByText(/Deshacer todos los Movimientos/i));

    expect(UndoAllMovements).toHaveBeenCalled();
  });

  it("should call DeleteGame on button click", async () => {
    const { DeleteGame } = await import("../services/GameServices");

    fireEvent.click(screen.getByText(/Volver al Lobby/i));

    expect(DeleteGame).toHaveBeenCalled();
  });

  it("should call resetSelect on button click", async () => {
    fireEvent.click(screen.getByText(/Resetear Seleccion/i));

    expect(screen.queryByText(/First square/i)).not.toBeInTheDocument();
    expect(screen.queryByText(/Second square/i)).not.toBeInTheDocument();
  });

  it("should call getPossibleMoves on component mount", async () => {
    const { PossiblesMoves } = await import("../services/GameServices");

    expect(PossiblesMoves).toHaveBeenCalled();
  });

  it("should call SwapTiles on valid swap", async () => {
    const { SwapTiles } = await import("../services/GameServices");

    fireEvent.click(screen.getByText(/First square/i));
    fireEvent.click(screen.getByText(/Second square/i));

    expect(SwapTiles).toHaveBeenCalled();
  });

  it("should show modal on game win", async () => {
    fireEvent.click(screen.getByText(/Ganar/i));

    expect(screen.getByText(/¡Felicidades!/i)).toBeInTheDocument();
  });

  it("should call finishGame on modal button click", async () => {
    const { DeleteGame } = await import("../services/GameServices");

    fireEvent.click(screen.getByText(/Ganar/i));
    fireEvent.click(screen.getByText(/Volver al Lobby/i));

    expect(DeleteGame).toHaveBeenCalled();
  });

  it("should call getGameInfo on component mount", async () => {
    const { GameData } = await import("../services/GameServices");

    expect(GameData).toHaveBeenCalledWith("game123");
  });

  it("should call startMove when SelectFirstTitle and SelectMovCard are set", async () => {
    const { PossiblesMoves } = await import("../services/GameServices");

    fireEvent.click(screen.getByText(/First square/i));
    fireEvent.click(screen.getByText(/Second square/i));

    expect(PossiblesMoves).toHaveBeenCalled();
  });

  it("should call swap when SelectFirstTitle and SelectSecondTitle are set", async () => {
    const { SwapTiles } = await import("../services/GameServices");

    fireEvent.click(screen.getByText(/First square/i));
    fireEvent.click(screen.getByText(/Second square/i));

    expect(SwapTiles).toHaveBeenCalled();
  });
});
