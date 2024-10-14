import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { describe, it, expect, vi } from "vitest";
import GamePage from "../pages/GamePage"; // Asegúrate de que la ruta sea correcta
import { usePlayerContext } from "../context/PlayerContext.jsx";
import { useGameContext } from "../context/GameContext.jsx";
import { MemoryRouter } from "react-router-dom";

// Mocks para contextos y servicios
vi.mock("../context/PlayerContext.jsx", () => ({
  usePlayerContext: () => ({
    playerID: "player1",
  }),
}));

vi.mock("../context/GameContext.jsx", () => ({
  useGameContext: () => ({
    game_id: "game123",
  }),
}));

vi.mock("../services/GameServices", () => ({
  GameData: vi.fn(),
  LeaveGame: vi.fn(),
  ChangeTurn: vi.fn(),
  DeleteGame: vi.fn(),
}));

// Mock WebSocket
class MockWebSocket {
  constructor(url) {
    if (
      !url.startsWith("ws://") &&
      !url.startsWith("wss://") &&
      !url.startsWith("http://") &&
      !url.startsWith("https://")
    ) {
      throw new SyntaxError(
        "The URL's scheme must be either 'ws', 'wss', 'http', or 'https'."
      );
    }
    this.url = url;
    this.readyState = 1; // OPEN
    this.send = vi.fn();
    this.close = vi.fn();
    this.onmessage = null;
    setTimeout(() => {
      if (this.onopen) this.onopen();
    }, 0);
  }

  addEventListener(event, callback) {
    if (event === "message") {
      this.onmessage = callback;
    }
  }

  removeEventListener(event, callback) {
    if (event === "message" && this.onmessage === callback) {
      this.onmessage = null;
    }
  }

  dispatchEvent(event) {
    if (event.type === "message" && this.onmessage) {
      this.onmessage(event);
    }
  }
}

global.WebSocket = MockWebSocket;

describe("GamePage", () => {
  it("should render the GamePage component", async () => {
    render(
      <MemoryRouter>
        <GamePage />
      </MemoryRouter>
    );

    expect(screen.getByText(/Turno de:/)).toBeInTheDocument();
    expect(screen.getByText(/Abandonar/i)).toBeInTheDocument();
  });

  it("should call LeaveGame on button click", async () => {
    const { LeaveGame } = await import("../services/GameServices");

    render(
      <MemoryRouter>
        <GamePage />
      </MemoryRouter>
    );

    fireEvent.click(screen.getByText(/Abandonar/i));

    expect(LeaveGame).toHaveBeenCalled();
  });

  it("should handle WebSocket messages", async () => {
    render(
      <MemoryRouter>
        <GamePage />
      </MemoryRouter>
    );

    const mockMessage = {
      data: JSON.stringify({
        turn: "player2",
        board: [],
        players: 2,
      }),
    };

    global.WebSocket.prototype.dispatchEvent(
      new MessageEvent("message", mockMessage)
    );

    await waitFor(() => {
      expect(screen.getByText(/Turno de:/)).toBeInTheDocument();
    });
  });
});
