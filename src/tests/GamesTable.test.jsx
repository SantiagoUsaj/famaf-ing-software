import { render, screen } from "@testing-library/react";
import { describe, it, expect } from "vitest";
import GamesTable from "../components/GamesTable";
import { BrowserRouter } from "react-router-dom";

describe("GamesTable Component", () => {
  it("debería mostrar solo los juegos en estado 'waiting' con espacio para más jugadores", () => {
    const gamesList = [
      {
        key: '1',
        name: 'Game 1',
        state: 'playing',
        size: 4,
        players: [{ name: 'Player 1' }, { name: 'Player 2' }],
      },
      {
        key: '2',
        name: 'Game 2',
        state: 'waiting',
        size: 2,
        players: [{ name: 'Player 3' }],
      },
      {
        key: '3',
        name: 'Game 3',
        state: 'waiting',
        size: 2,
        players: [{ name: 'Player 4' }, { name: 'Player 5' }],
      },
    ];

    // Renderizar el componente
    render(
      <BrowserRouter>
        <GamesTable gamesList={gamesList} />
      </BrowserRouter>
    );

    // Verificar que solo los juegos que cumplen con los criterios se muestran
    expect(screen.getByText(/Game 2/i)).toBeInTheDocument();
    expect(screen.queryByText(/Game 1/i)).not.toBeInTheDocument();
    expect(screen.queryByText(/Game 3/i)).not.toBeInTheDocument();
  });

  it("debería mostrar el título de la tabla con el estilo correcto", () => {
    const gamesList = [];

    // Renderizar el componente
    render(
      <BrowserRouter>
        <GamesTable gamesList={gamesList} />
      </BrowserRouter>
    );

    // Verificar que el título de la tabla se muestra con el estilo correcto
    const titleElement = screen.getByText(/Games Available/i);
    expect(titleElement).toBeInTheDocument();
    expect(titleElement).toHaveStyle({ fontSize: '24px', fontWeight: 'bold' });
  });
});