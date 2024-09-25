import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { expect, vi } from "vitest";
import LoginPage from "./../pages/LoginPage";
import { BrowserRouter } from "react-router-dom";
import { JoinLobby } from "../services/LobbyServices";
import * as ReactRouterDom from "react-router-dom";

// Mock solo para JoinLobby y useNavigate
vi.mock("../services/LobbyServices", () => ({
  JoinLobby: vi.fn(),
}));

// Usamos `importOriginal` para mantener BrowserRouter y solo mockear useNavigate
const mockNavigate = vi.fn();

vi.mock("react-router-dom", async () => {
  const actual = await vi.importActual("react-router-dom"); // Importamos lo que no queremos mockear
  return {
    ...actual, // Retornamos el resto de las exportaciones reales
    useNavigate: vi.fn(), // Mock para useNavigate
  };
});

describe("LoginPage", () => {
  beforeEach(() => {
    vi.clearAllMocks(); // Limpia todos los mocks entre tests
  });

  test("should render the form and display the username input", () => {
    render(
      <BrowserRouter>
        <LoginPage />
      </BrowserRouter>
    );

    // Verificar que el input para el nombre de jugador está presente
    const inputElement = screen.getByPlaceholderText("Ingresar nombre jugador");
    expect(inputElement).toBeInTheDocument();

    // Verificar que el botón "Jugar" está presente
    const buttonElement = screen.getByText("Jugar");
    expect(buttonElement).toBeInTheDocument();
  });

  test("should display error when username is missing", async () => {
    render(
      <BrowserRouter>
        <LoginPage />
      </BrowserRouter>
    );

    // Simular la acción de hacer click en "Jugar" sin ingresar un nombre
    const buttonElement = screen.getByText("Jugar");
    fireEvent.click(buttonElement);

    // Esperar que aparezca el mensaje de error
    const errorMessage = await screen.findByText("El nombre es obligatorio!");
    expect(errorMessage).toBeInTheDocument();
  });

  test("should display error when username contains non-alphanumeric characters", async () => {
    render(
      <BrowserRouter>
        <LoginPage />
      </BrowserRouter>
    );

    // Simular ingreso de un nombre con caracteres no alfanuméricos
    const inputElement = screen.getByPlaceholderText("Ingresar nombre jugador");
    fireEvent.change(inputElement, { target: { value: "Player@123" } });

    // Simular envío del formulario
    const buttonElement = screen.getByText("Jugar");
    fireEvent.click(buttonElement);

    // Esperar que aparezca el mensaje de error
    const errorMessage = await screen.findByText(
      "Solo caracteres alfanuméricos!"
    );
    expect(errorMessage).toBeInTheDocument();
  });

  test("should display error when username is longer than 8 characters", async () => {
    render(
      <BrowserRouter>
        <LoginPage />
      </BrowserRouter>
    );

    // Simular ingreso de un nombre con más de 8 caracteres
    const inputElement = screen.getByPlaceholderText("Ingresar nombre jugador");
    fireEvent.change(inputElement, { target: { value: "Player12345" } });

    // Simular envío del formulario
    const buttonElement = screen.getByText("Jugar");
    fireEvent.click(buttonElement);

    // Esperar que aparezca el mensaje de error
    const errorMessage = await screen.findByText("Menos de 8 caracteres!");
    expect(errorMessage).toBeInTheDocument();
  });

  test("should navigate to lobby on successful form submission", async () => {
    // Mock de JoinLobby con una respuesta simulada
    JoinLobby.mockResolvedValueOnce("1");

    render(
      <ReactRouterDom.BrowserRouter>
        <LoginPage />
      </ReactRouterDom.BrowserRouter>
    );

    // Simular ingreso de un nombre válido
    const inputElement = screen.getByPlaceholderText("Ingresar nombre jugador");
    fireEvent.change(inputElement, { target: { value: "Player123" } });

    // Simular envío del formulario
    const buttonElement = screen.getByText("Jugar");
    fireEvent.click(buttonElement);

    expect(JoinLobby).toHaveBeenCalledWith("Player123");

    // Esperar que la navegación ocurra con el ID del lobby
    await waitFor(() => {
      expect(mockNavigate).toHaveBeenCalledWith(`/lobby/1`);
    });
  });

  test("should display error when JoinLobby fails", async () => {
    // Mock de JoinLobby para que falle
    JoinLobby.mockRejectedValueOnce(new Error("Failed to join lobby"));

    render(
      <BrowserRouter>
        <LoginPage />
      </BrowserRouter>
    );

    // Simular ingreso de un nombre válido
    const inputElement = screen.getByPlaceholderText("Ingresar nombre jugador");
    fireEvent.change(inputElement, { target: { value: "Player123" } });

    // Simular envío del formulario
    const buttonElement = screen.getByText("Jugar");
    fireEvent.click(buttonElement);

    // Esperar que el error sea registrado en la consola
    await waitFor(() => {
      expect(console.error).toHaveBeenCalledWith(
        "Error joining lobby:",
        expect.any(Error)
      );
    });
  });

  test("should not navigate if JoinLobby response is null", async () => {
    // Mock de JoinLobby con una respuesta nula
    JoinLobby.mockResolvedValueOnce(null);

    render(
      <BrowserRouter>
        <LoginPage />
      </BrowserRouter>
    );

    // Simular ingreso de un nombre válido
    const inputElement = screen.getByPlaceholderText("Ingresar nombre jugador");
    fireEvent.change(inputElement, { target: { value: "Player123" } });

    // Simular envío del formulario
    const buttonElement = screen.getByText("Jugar");
    fireEvent.click(buttonElement);

    // Esperar que la navegación no ocurra
    await waitFor(() => {
      expect(mockNavigate).not.toHaveBeenCalled();
    });
  });
});
