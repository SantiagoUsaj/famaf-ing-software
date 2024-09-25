import { render, screen, fireEvent } from "@testing-library/react";
import { vi } from "vitest";
import LoginPage from "./../pages/LoginPage";
import { BrowserRouter } from "react-router-dom";
import { JoinLobby } from "../services/LobbyServices";

// Mock solo para JoinLobby y useNavigate
vi.mock("../services/LobbyServices", () => ({
  JoinLobby: vi.fn(),
}));

// Usamos `importOriginal` para mantener BrowserRouter y solo mockear useNavigate
vi.mock("react-router-dom", async () => {
  const original = await vi.importActual("react-router-dom"); // Importamos el original
  return {
    ...original,
    useNavigate: () => vi.fn(), // Hacemos mock solo de useNavigate
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

  test("should navigate to lobby on successful form submission", async () => {
    const mockNavigate = vi.fn();
    const mockResponse = "12345";

    // Mock de JoinLobby con una respuesta simulada
    vi.mocked(JoinLobby).mockResolvedValue(mockResponse);

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

    // Esperar que la navegación ocurra con el ID del lobby
    await screen.findByText("Jugar");
    expect(mockNavigate).toHaveBeenCalledWith(`/lobby/${mockResponse}`);
  });
});
