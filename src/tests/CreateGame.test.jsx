import { render, screen, fireEvent, act } from "@testing-library/react";
import { describe, it, expect, vi } from "vitest";
import CreateGame from "./../pages/CreateGame";
import * as ReactRouterDom from "react-router-dom";

vi.mock("react-router-dom", async () => {
  const actual = await vi.importActual("react-router-dom"); // Importamos lo que no queremos mockear
  return {
    ...actual, // Retornamos el resto de las exportaciones reales
    useNavigate: vi.fn(), // Mock para useNavigate
  };
});

describe("CreateGame", () => {
  it("should render the title 'Crear partida'", () => {
    render(
      <ReactRouterDom.BrowserRouter>
        <CreateGame />
      </ReactRouterDom.BrowserRouter>
    );
    const title = screen.getByText(/Crear partida/i);
    expect(title).toBeInTheDocument();
  });

  it("should render the form with game name field, amount of players field, password field and submit button", () => {
    render(
      <ReactRouterDom.BrowserRouter>
        <CreateGame />
      </ReactRouterDom.BrowserRouter>
    );

    const gameName = screen.getByLabelText(/Nombre de la Partida/i);
    expect(gameName).toBeInTheDocument();

    const players = screen.getByLabelText(/Cantidad máxima de Jugadores/i);
    expect(players).toBeInTheDocument();

    const password = screen.getByLabelText(/Contraseña/i);
    expect(password).toBeInTheDocument();

    const button = screen.getByRole("button", { name: /Crear/i });
    expect(button).toBeInTheDocument();
  });

  it("should display error when game name is missing", async () => {
    render(
      <ReactRouterDom.BrowserRouter>
        <CreateGame />
      </ReactRouterDom.BrowserRouter>
    );

    const button = screen.getByRole("button", { name: /Crear/i });

    fireEvent.click(button);

    const errorMessage = await screen.findByText(
      /¡Ingresar el nombre es obligatorio!/i
    );
    expect(errorMessage).toBeInTheDocument();
  });

  it("should display error for invalid (non-alphanumeric) game name", async () => {
    render(
      <ReactRouterDom.BrowserRouter>
        <CreateGame />
      </ReactRouterDom.BrowserRouter>
    );

    const button = screen.getByRole("button", { name: /Crear/i });

    fireEvent.change(screen.getByLabelText(/Nombre de la Partida/i), {
      target: { value: "game name!" },
    });

    fireEvent.click(button);

    const errorMessage = await screen.findByText(
      /¡Solo caracteres alfanuméricos!/i
    );
    expect(errorMessage).toBeInTheDocument();
  });

  it("should display error when amount of players is missing", async () => {
    render(
      <ReactRouterDom.BrowserRouter>
        <CreateGame />
      </ReactRouterDom.BrowserRouter>
    );

    const button = screen.getByRole("button", { name: /Crear/i });

    fireEvent.click(button);

    const errorMessage = await screen.findByText(
      /Por favor selecciona una opción/i
    );
    expect(errorMessage).toBeInTheDocument();
  });

  it("should navigate to /game when form is submitted", async () => {
    const mockNavigate = vi.fn();
    ReactRouterDom.useNavigate.mockReturnValue(mockNavigate);

    render(
      <ReactRouterDom.BrowserRouter>
        <CreateGame />
      </ReactRouterDom.BrowserRouter>
    );

    const button = screen.getByRole("button", { name: /Crear/i });

    fireEvent.change(screen.getByLabelText(/Nombre de la Partida/i), {
      target: { value: "game123" },
    });
    //despliega el menu
    fireEvent.mouseDown(screen.getByLabelText(/Cantidad máxima de Jugadores/i));
    //elige la cantidad de jugadores
    fireEvent.click(screen.getByText("2 jugadores"));

    await act(async () => {
      fireEvent.click(button);
    });

    await new Promise((resolve) => setTimeout(resolve, 0));

    expect(mockNavigate).toHaveBeenCalledWith("/game");
  });
});
