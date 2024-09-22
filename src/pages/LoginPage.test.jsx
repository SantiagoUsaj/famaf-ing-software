import { render, screen, fireEvent, act } from "@testing-library/react";
import { describe, it, expect, vi } from "vitest";
import LoginPage from "./LoginPage";
import * as ReactRouterDom from "react-router-dom"; // Importamos todo el módulo de react-router-dom

// Mockeamos parcialmente react-router-dom
vi.mock("react-router-dom", async () => {
  const actual = await vi.importActual("react-router-dom"); // Importamos lo que no queremos mockear
  return {
    ...actual, // Retornamos el resto de las exportaciones reales
    useNavigate: vi.fn(), // Mock para useNavigate
  };
});

describe("LoginPage", () => {
  it("should render the title 'Bienvenido a El Switcher'", () => {
    render(
      <ReactRouterDom.BrowserRouter>
        <LoginPage />
      </ReactRouterDom.BrowserRouter>
    );
    // Verificar si el título "Bienvenido a El Switcher" está presente
    const title = screen.getByText(/Bienvenido a El Switcher/i);
    expect(title).toBeInTheDocument();
  });

  it("should render the form with username field and submit button", () => {
    render(
      <ReactRouterDom.BrowserRouter>
        <LoginPage />
      </ReactRouterDom.BrowserRouter>
    );

    // Verificar si el campo "Nombre de Jugador" está presente
    const input = screen.getByLabelText(/Nombre de Jugador/i);
    expect(input).toBeInTheDocument();

    // Verificar si el botón "Jugar" está presente
    const button = screen.getByRole("button", { name: /Jugar/i });
    expect(button).toBeInTheDocument();
  });

  it("should display error when username is missing", async () => {
    render(
      <ReactRouterDom.BrowserRouter>
        <LoginPage />
      </ReactRouterDom.BrowserRouter>
    );

    const button = screen.getByRole("button", { name: /Jugar/i });

    // Hacer clic en el botón sin ingresar el nombre de usuario
    fireEvent.click(button);

    // Esperar a que aparezca el mensaje de error
    const errorMessage = await screen.findByText(
      /El nombre de jugador es obligatorio!/i
    );
    expect(errorMessage).toBeInTheDocument();
  });

  it("should display error for invalid (non-alphanumeric) username", async () => {
    render(
      <ReactRouterDom.BrowserRouter>
        <LoginPage />
      </ReactRouterDom.BrowserRouter>
    );

    const input = screen.getByLabelText(/Nombre de Jugador/i);
    const button = screen.getByRole("button", { name: /Jugar/i });

    // Ingresar un nombre de usuario no alfanumérico
    fireEvent.change(input, { target: { value: "Player#123" } });
    fireEvent.click(button);

    // Esperar a que aparezca el mensaje de error
    const errorMessage = await screen.findByText(
      /Solo se permiten caracteres alfanuméricos!/i
    );
    expect(errorMessage).toBeInTheDocument();
  });

  it("should navigate to /lobby on successful form submission", async () => {
    const mockNavigate = vi.fn(); // Simulamos la función de navegación

    // Mock correcto de useNavigate
    ReactRouterDom.useNavigate.mockReturnValue(mockNavigate);

    render(
      <ReactRouterDom.BrowserRouter>
        <LoginPage />
      </ReactRouterDom.BrowserRouter>
    );

    const input = screen.getByLabelText(/Nombre de Jugador/i);
    const button = screen.getByRole("button", { name: /Jugar/i });

    // Ingresar un nombre de usuario válido
    fireEvent.change(input, { target: { value: "Player123" } });

    // Simular clic en el botón "Jugar"
    // Envuelve el clic del botón en un bloque act
    await act(async () => {
      fireEvent.click(button);
    });

    // Asegurarse de que el formulario fue enviado correctamente
    await new Promise((resolve) => setTimeout(resolve, 0)); // Esperar un ciclo para el envío

    // Verificar que la función de navegación fue llamada
    expect(mockNavigate).toHaveBeenCalledWith("/lobby");
  });
});
