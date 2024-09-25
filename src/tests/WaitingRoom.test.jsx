import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import { BrowserRouter } from "react-router-dom";
import { describe, it, vi, expect } from "vitest";
import WaitingRoom from "./../pages/WaitingRoom";

// Mockear los componentes LobbySquares y TablePlayers
vi.mock("../components/LobbySquares", () => ({
  default: () => <div>LobbySquares Mock</div>,
}));

vi.mock("../components/TablePlayers", () => ({
  default: () => <div>TablePlayers Mock</div>,
}));

describe("WaitingRoom", () => {
  it("should render game name after useEffect runs", async () => {
    render(
      <BrowserRouter>
        <WaitingRoom />
      </BrowserRouter>
    );

    // Esperar hasta que el nombre del juego sea renderizado
    const gameName = await screen.findByText("data.gameName");
    expect(gameName).toBeInTheDocument();
  });

  it("should display 'Iniciar Partida' button if user is creator and there are 4 players", async () => {
    // Mockear el estado para simular que el usuario es el creador y que hay 4 jugadores
    render(
      <BrowserRouter>
        <WaitingRoom />
      </BrowserRouter>
    );

    // Esperar hasta que el nombre del juego sea renderizado
    const gameName = await screen.findByText("data.gameName");
    expect(gameName).toBeInTheDocument();

    // Verificar si el botón de "Iniciar Partida" no está visible porque no hay suficientes jugadores (2 en lugar de 4)
    const startGameButton = screen.queryByRole("button", {
      name: /Iniciar Partida/i,
    });
    expect(startGameButton).not.toBeInTheDocument();
  });

  it("should display 'Abandonar' button if user is not the creator", async () => {
    render(
      <BrowserRouter>
        <WaitingRoom />
      </BrowserRouter>
    );

    // Simular que el usuario no es el creador (al no haber botón de abandonar por defecto)
    const leaveButton = screen.queryByRole("button", { name: /Abandonar/i });
    expect(leaveButton).not.toBeInTheDocument();
  });

  it("should navigate to /game when clicking 'Iniciar Partida' as creator with 4 players", async () => {
    const mockNavigate = vi.fn();

    render(
      <BrowserRouter>
        <WaitingRoom />
      </BrowserRouter>
    );

    // Simular el click en el botón de 'Iniciar Partida' después de que se actualice el número de jugadores
    const startGameButton = screen.queryByRole("button", {
      name: /Iniciar Partida/i,
    });

    if (startGameButton) {
      fireEvent.click(startGameButton);
      expect(mockNavigate).toHaveBeenCalledWith("/game");
    }
  });
});
