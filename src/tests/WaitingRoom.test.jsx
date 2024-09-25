import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import { BrowserRouter } from "react-router-dom";
import { describe, it, vi, expect } from "vitest";
import WaitingRoom from "./../pages/WaitingRoom";
import * as ReactRouterDom from "react-router-dom"; // Importamos todo el módulo de react-router-dom

// Mockear los componentes LobbySquares y TablePlayers
vi.mock("../components/LobbySquares", () => ({
  default: () => <div>LobbySquares Mock</div>,
}));

vi.mock("../components/TablePlayers", () => ({
  default: () => <div>TablePlayers Mock</div>,
}));

vi.mock("react-router-dom", async () => {
  const actual = await vi.importActual("react-router-dom"); // Importamos lo que no queremos mockear
  return {
    ...actual, // Retornamos el resto de las exportaciones reales
    useNavigate: vi.fn(), // Mock para useNavigate
  };
});

const renderWithRouter = (ui, { route = "/" } = {}) => {
  window.history.pushState({}, "Test page", route);
  return render(ui, { wrapper: BrowserRouter });
};

describe("WaitingRoom", () => {
  it("should render game name after useEffect runs", async () => {
    renderWithRouter(<WaitingRoom initialGameName="Test Game" />);

    // Esperar hasta que el nombre del juego sea renderizado
    const gameName = await screen.findByText("Test Game");
    expect(gameName).toBeInTheDocument();
  });

  it("should display 'Iniciar Partida' button if user is creator and there are 4 players", async () => {
    // Mockear el estado para simular que el usuario es el creador y que hay 4 jugadores
    renderWithRouter(
      <WaitingRoom
        initialGameName="Test Game"
        initialIsCreator={true}
        initialNumberOfPlayers={4}
      />
    );

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
    renderWithRouter(
      <WaitingRoom initialGameName="Test Game" initialIsCreator={false} />
    );

    // Simular que el usuario no es el creador
    const leaveButton = screen.getByRole("button", { name: /Abandonar/i });
    expect(leaveButton).toBeInTheDocument();
  });

  it("should navigate to /game when clicking 'Iniciar Partida' as creator with 4 players", async () => {
    const mockNavigate = vi.fn();

    // Mock correcto de useNavigate
    ReactRouterDom.useNavigate.mockReturnValue(mockNavigate);

    renderWithRouter(
      <WaitingRoom
        initialGameName="Test Game"
        initialIsCreator={true}
        initialNumberOfPlayers={4}
      />
    );

    // Simular el click en el botón de 'Iniciar Partida'
    const startGameButton = screen.getByRole("button", {
      name: /Iniciar Partida/i,
    });

    fireEvent.click(startGameButton);
    expect(mockNavigate).toHaveBeenCalledWith("/game");
  });

  it("debería mostrar el nombre del juego personalizado", () => {
    renderWithRouter(<WaitingRoom initialGameName="Partida de Test" />);
    expect(screen.getByText("Partida de Test")).toBeInTheDocument();
  });

  it("debería mostrar el botón 'Iniciar Partida' si es el creador y hay 4 jugadores", () => {
    renderWithRouter(
      <WaitingRoom
        initialGameName="Test Game"
        initialIsCreator={true}
        initialNumberOfPlayers={4}
      />
    );
    const startButton = screen.getByText("Iniciar Partida");
    expect(startButton).toBeInTheDocument();
    expect(startButton).toBeEnabled();
  });

  it("no debería mostrar el botón 'Iniciar Partida' si no hay suficientes jugadores", () => {
    renderWithRouter(
      <WaitingRoom
        initialGameName="Test Game"
        initialIsCreator={true}
        initialNumberOfPlayers={3}
      />
    );
    expect(screen.queryByText("Iniciar Partida")).toBeNull();
  });

  it("debería mostrar el botón 'Abandonar' si no es el creador", () => {
    renderWithRouter(
      <WaitingRoom initialGameName="Test Game" initialIsCreator={false} />
    );
    expect(screen.getByText("Abandonar")).toBeInTheDocument();
  });
});
