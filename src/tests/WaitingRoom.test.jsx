import React from "react";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { BrowserRouter } from "react-router-dom";
import { describe, it, expect, vi, beforeEach } from "vitest";
import WaitingRoom from "./../pages/WaitingRoom";
import { GameData, LeaveGame, StartGame } from "../services/GameServices";

// Mockear los componentes LobbySquares y TablePlayers
vi.mock("../components/LobbySquares", () => ({
  default: () => <div>LobbySquares Mock</div>,
}));

vi.mock("../components/TablePlayers", () => ({
  default: () => <div>TablePlayers Mock</div>,
}));

// Mock WebSocket
global.WebSocket = vi.fn(() => ({
  onopen: vi.fn(),
  onmessage: vi.fn(),
  onclose: vi.fn(),
  close: vi.fn(),
}));

// Mock useNavigate from react-router-dom
const mockNavigate = vi.fn();
vi.mock("react-router-dom", async (importOriginal) => {
  const actual = await importOriginal();
  return {
    ...actual,
    useNavigate: () => mockNavigate,
  };
});

vi.mock("../services/GameServices", () => ({
  GameData: vi.fn(),
  LeaveGame: vi.fn(),
  StartGame: vi.fn(),
}));

// Mock usePlayerContext
const mockSetPlayerID = vi.fn();
vi.mock("../context/PlayerContext", () => ({
  usePlayerContext: () => ({
    setPlayerID: mockSetPlayerID,
    playerID: "1",
  }),
}));

// Mock useGameContext
const mockSetGameID = vi.fn();
vi.mock("../context/GameContext", () => ({
  useGameContext: () => ({
    setGameID: mockSetGameID,
    game_id: "1",
  }),
}));

const renderWithRouter = (ui, { route = "/" } = {}) => {
  window.history.pushState({}, "Test page", route);
  return render(ui, { wrapper: BrowserRouter });
};

describe("WaitingRoom", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("should render game name after useEffect runs", async () => {
    GameData.mockResolvedValueOnce({
      game_name: "Test Game",
      state: "waiting",
      host_id: "1",
      players: 4,
      game_size: 4,
      player_details: [],
    });

    renderWithRouter(<WaitingRoom />);

    // Esperar hasta que el nombre del juego sea renderizado
    const gameName = await screen.findByText("Test Game");
    expect(gameName).toBeInTheDocument();
  });

  it("should display 'Iniciar Partida' button if user is creator and there are 4 players", async () => {
    GameData.mockResolvedValueOnce({
      game_name: "Test Game",
      state: "waiting",
      host_id: "1",
      players: 4,
      game_size: 4,
      player_details: [],
    });

    renderWithRouter(<WaitingRoom initialIsCreator={true} />);

    // Esperar hasta que el nombre del juego sea renderizado
    const gameName = await screen.findByText("Test Game");
    expect(gameName).toBeInTheDocument();

    // Verificar si el botón de "Iniciar Partida" está visible
    const startGameButton = screen.getByRole("button", {
      name: /Iniciar Partida/i,
    });
    expect(startGameButton).toBeInTheDocument();
  });

  it("should display 'Abandonar' button if user is not the creator", async () => {
    GameData.mockResolvedValueOnce({
      game_name: "Test Game",
      state: "waiting",
      host_id: "2",
      players: 4,
      game_size: 4,
      player_details: [],
    });

    renderWithRouter(<WaitingRoom initialIsCreator={false} />);

    // Esperar hasta que el nombre del juego sea renderizado
    const gameName = await screen.findByText("Test Game");
    expect(gameName).toBeInTheDocument();

    // Simular que el usuario no es el creador
    const leaveButton = screen.getByRole("button", { name: /Abandonar/i });
    expect(leaveButton).toBeInTheDocument();
  });

  it("should navigate to /game when clicking 'Iniciar Partida' as creator with 4 players", async () => {
    GameData.mockResolvedValueOnce({
      game_name: "Test Game",
      state: "waiting",
      host_id: "1",
      players: 4,
      game_size: 4,
      player_details: [],
    });

    StartGame.mockResolvedValueOnce({});

    renderWithRouter(<WaitingRoom initialIsCreator={true} />);

    // Esperar hasta que el nombre del juego sea renderizado
    const gameName = await screen.findByText("Test Game");
    expect(gameName).toBeInTheDocument();

    // Verificar si el botón de "Iniciar Partida" está visible
    const startGameButton = screen.getByRole("button", {
      name: /Iniciar Partida/i,
    });
    expect(startGameButton).toBeInTheDocument();

    // Simular el click en el botón de 'Iniciar Partida'
    fireEvent.click(startGameButton);
    await waitFor(() => {
      expect(mockNavigate).toHaveBeenCalledWith("/game");
    });
  });

  it("should navigate to /lobby when clicking 'Abandonar'", async () => {
    GameData.mockResolvedValueOnce({
      game_name: "Test Game",
      state: "waiting",
      host_id: "2",
      players: 4,
      game_size: 4,
      player_details: [],
    });

    LeaveGame.mockResolvedValueOnce({});

    renderWithRouter(<WaitingRoom initialIsCreator={false} />);

    // Simular el click en el botón de 'Abandonar'
    const leaveButton = screen.getByRole("button", { name: /Abandonar/i });

    fireEvent.click(leaveButton);
    await waitFor(() => {
      expect(mockNavigate).toHaveBeenCalledWith("/lobby");
    });
  });
});
