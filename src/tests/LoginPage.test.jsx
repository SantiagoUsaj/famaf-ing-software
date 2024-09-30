import React from "react";
import {
  render,
  screen,
  fireEvent,
  act,
  waitFor,
} from "@testing-library/react";
import { BrowserRouter } from "react-router-dom";
import { describe, it, expect, vi, beforeEach } from "vitest";
import LoginPage from "../pages/LoginPage";
import { JoinLobby } from "../services/LobbyServices";

// Mock del servicio JoinLobby
vi.mock("../services/LobbyServices", () => ({
  JoinLobby: vi.fn(),
}));

// Mock de useNavigate de react-router-dom
const mockNavigate = vi.fn();
vi.mock("react-router-dom", async (importOriginal) => {
  const actual = await importOriginal();
  return {
    ...actual,
    useNavigate: () => mockNavigate,
  };
});

describe("LoginPage", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    render(
      <BrowserRouter>
        <LoginPage />
      </BrowserRouter>
    );
  });

  it("should render the title 'El Switcher'", () => {
    // Verificar si el título "Bienvenido a El Switcher" está presente
    const title = screen.getByText(/El Switcher/i);
    expect(title).toBeInTheDocument();
  });

  it("should render the form with username field and submit button", () => {
    // Verificar si el campo "Nombre de Jugador" está presente
    const input = screen.getByLabelText(/Nombre de Jugador/i);
    expect(input).toBeInTheDocument();

    // Verificar si el botón "Jugar" está presente
    const button = screen.getByRole("button", { name: /Jugar/i });
    expect(button).toBeInTheDocument();
  });

  it("should display error when username is missing", async () => {
    const button = screen.getByRole("button", { name: /Jugar/i });

    // Hacer clic en el botón sin ingresar el nombre de usuario
    fireEvent.click(button);

    // Esperar a que aparezca el mensaje de error
    const errorMessage = await screen.findByText(/El nombre es obligatorio!/i);
    expect(errorMessage).toBeInTheDocument();
  });

  it("should display error for invalid (non-alphanumeric) username", async () => {
    const input = screen.getByLabelText(/Nombre de Jugador/i);
    const button = screen.getByRole("button", { name: /Jugar/i });

    // Ingresar un nombre de usuario no alfanumérico
    fireEvent.change(input, { target: { value: "Player#123" } });
    fireEvent.click(button);

    // Esperar a que aparezca el mensaje de error
    const errorMessage = await screen.findByText(
      /Solo caracteres alfanuméricos!/i
    );
    expect(errorMessage).toBeInTheDocument();
  });

  it("should display error for username longer than 8 characters", async () => {
    const input = screen.getByLabelText(/Nombre de Jugador/i);
    const button = screen.getByRole("button", { name: /Jugar/i });

    // Ingresar un nombre de usuario con más de 8 caracteres
    fireEvent.change(input, { target: { value: "Player1234" } });
    fireEvent.click(button);

    // Esperar a que aparezca el mensaje de error
    const errorMessage = await screen.findByText(/Menos de 8 caracteres!/i);
    expect(errorMessage).toBeInTheDocument();
  });

  it("renderiza LoginPage y envía el formulario correctamente", async () => {
    JoinLobby.mockResolvedValue({ player_id: "12345" });

    // Simular entrada del usuario
    fireEvent.change(screen.getByPlaceholderText(/Ingresar nombre jugador/i), {
      target: { value: "testuser" },
    });
    fireEvent.click(screen.getByRole("button", { name: /jugar/i }));

    // Esperar a que la función asíncrona se resuelva
    await waitFor(() => expect(JoinLobby).toHaveBeenCalledWith("testuser"));

    // Verificar si navigate fue llamado con la ruta correcta
    await waitFor(() =>
      expect(mockNavigate).toHaveBeenCalledWith("/lobby/12345")
    );
  });

  describe("LoginPage", () => {
    it("maneja el fallo en el envío del formulario", async () => {
      JoinLobby.mockRejectedValue(new Error("Failed to join lobby"));

      // Simular entrada del usuario
      fireEvent.change(
        screen.getByPlaceholderText(/Ingresar nombre jugador/i),
        {
          target: { value: "testuser" },
        }
      );
      fireEvent.click(screen.getByRole("button", { name: /jugar/i }));

      // Esperar a que la función asíncrona se resuelva
      await waitFor(() => expect(JoinLobby).toHaveBeenCalledWith("testuser"));

      // Verificar si navigate no fue llamado
      await waitFor(() => expect(mockNavigate).not.toHaveBeenCalled());
    });
  });
});
