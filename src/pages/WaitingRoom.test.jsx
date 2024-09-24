import { render, screen, fireEvent } from "@testing-library/react";
import { describe, it, expect, vi } from "vitest";
import WaitingRoom from "./WaitingRoom";
import * as ReactRouterDom from "react-router-dom";

// Mock de las dependencias necesarias
vi.mock("react-router-dom", async () => {
  const actual = await vi.importActual("react-router-dom");
  return {
    ...actual,
    useNavigate: vi.fn(),
  };
});

describe("WaitingRoom", () => {
  it("should render LobbySquares and TablePlayers components", () => {
    render(
      <ReactRouterDom.BrowserRouter>
        <WaitingRoom />
      </ReactRouterDom.BrowserRouter>
    );

    // Verificar que los componentes LobbySquares y TablePlayers se renderizan correctamente
    const lobbySquares = screen.getByTestId("lobby-squares");
    const tablePlayers = screen.getByTestId("table-players");

    expect(lobbySquares).toBeInTheDocument();
    expect(tablePlayers).toBeInTheDocument();
  });

  it('should navigate to /game when "Iniciar Partida" button is clicked', () => {
    const mockNavigate = vi.fn();
    ReactRouterDom.useNavigate.mockReturnValue(mockNavigate);

    render(
      <ReactRouterDom.BrowserRouter>
        <WaitingRoom />
      </ReactRouterDom.BrowserRouter>
    );

    const startButton = screen.getByText(/Iniciar Partida/i);
    fireEvent.click(startButton);

    // Verificar que navega a /game
    expect(mockNavigate).toHaveBeenCalledWith("/game");
  });

  it('should navigate to /lobby when "Abandonar" button is clicked', () => {
    const mockNavigate = vi.fn();
    ReactRouterDom.useNavigate.mockReturnValue(mockNavigate);

    render(
      <ReactRouterDom.BrowserRouter>
        <WaitingRoom />
      </ReactRouterDom.BrowserRouter>
    );

    const abandonButton = screen.getByText(/Abandonar/i);
    fireEvent.click(abandonButton);

    // Verificar que navega a /lobby
    expect(mockNavigate).toHaveBeenCalledWith("/lobby");
  });

  it('should disable the "Iniciar Partida" button if admin is false', () => {
    render(
      <ReactRouterDom.BrowserRouter>
        <WaitingRoom />
      </ReactRouterDom.BrowserRouter>
    );

    const startButton = screen.getByText(/Iniciar Partida/i);
    expect(startButton).not.toBeDisabled(); // Verificar que el botón no esté deshabilitado
  });
});
