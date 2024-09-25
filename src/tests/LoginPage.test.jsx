import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { describe, it, expect, vi } from "vitest";
import LoginPage from "../pages/LoginPage"; // Ajusta la ruta según corresponda
import { BrowserRouter } from "react-router-dom";
import { JoinLobby } from "../services/LobbyServices";

// Mockeamos el servicio JoinLobby
vi.mock("../services/LobbyServices", () => ({
  JoinLobby: vi.fn(),
}));

// Mockeamos la navegación de react-router-dom
const mockNavigate = vi.fn();

vi.mock("react-router-dom", async () => {
  const actual = await vi.importActual("react-router-dom"); // Importamos lo que no queremos mockear
  return {
    ...actual, // Retornamos el resto de las exportaciones reales
    useNavigate: () => mockNavigate, // Mock para useNavigate
  };
});

describe("LoginPage", () => {
  it("should render the form and display the username input", () => {
    render(
      <BrowserRouter>
        <LoginPage />
      </BrowserRouter>
    );

    // Verifica que el input del nombre de jugador esté presente
    expect(
      screen.getByPlaceholderText("Ingresar nombre jugador")
    ).toBeInTheDocument();
    // Verifica que el botón 'Jugar' esté presente
    expect(screen.getByRole("button", { name: /jugar/i })).toBeInTheDocument();
  });

  it("should display error when username is missing", async () => {
    render(
      <BrowserRouter>
        <LoginPage />
      </BrowserRouter>
    );

    // Intenta enviar el formulario con un valor inválido
    fireEvent.change(screen.getByPlaceholderText("Ingresar nombre jugador"), {
      target: { value: "" },
    });
    fireEvent.click(screen.getByRole("button", { name: /jugar/i }));

    // Espera que aparezca el mensaje de error
    await waitFor(() =>
      expect(screen.getByText("El nombre es obligatorio!")).toBeInTheDocument()
    );
  });

  it("should display error when username contains non-alphanumeric characters", async () => {
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

  it("should display error when username is longer than 8 characters", async () => {
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

  it("should navigate to lobby on successful form submission", async () => {
    const mockResponse = "12345"; // Id del lobby simulado
    JoinLobby.mockResolvedValueOnce(mockResponse); // Simulamos una respuesta exitosa de JoinLobby

    render(
      <BrowserRouter>
        <LoginPage />
      </BrowserRouter>
    );

    // Cambia el valor del input a un nombre de usuario válido
    fireEvent.change(screen.getByPlaceholderText("Ingresar nombre jugador"), {
      target: { value: "jugador1" },
    });

    // Envía el formulario
    fireEvent.click(screen.getByRole("button", { name: /jugar/i }));

    // Esperamos que la función JoinLobby sea llamada correctamente
    await waitFor(() => expect(JoinLobby).toHaveBeenCalledWith("jugador1"));

    // Esperamos que la navegación sea llamada con la ruta correcta
    await waitFor(() =>
      expect(mockNavigate).toHaveBeenCalledWith(`/lobby/${mockResponse}`)
    );
  });
});
