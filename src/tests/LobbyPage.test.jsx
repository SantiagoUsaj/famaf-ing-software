import React from "react";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { BrowserRouter } from "react-router-dom";
import { describe, it, expect, vi, beforeEach } from "vitest";
import LobbyPage from "../pages/LobbyPage";

// Mock useNavigate from react-router-dom
const mockNavigate = vi.fn();
vi.mock("react-router-dom", async (importOriginal) => {
  const actual = await importOriginal();
  return {
    ...actual,
    useNavigate: () => mockNavigate,
  };
});

// Mock WebSocket
global.WebSocket = vi.fn(() => ({
  onopen: vi.fn(),
  onmessage: vi.fn(),
  onclose: vi.fn(),
  close: vi.fn(),
}));

describe("LobbyPage", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    render(
      <BrowserRouter>
        <LobbyPage playerID="testPlayer" />
      </BrowserRouter>
    );
  });

  it("should render the title 'LobbyPage'", () => {
    const title = screen.getByText(/LobbyPage/i);
    expect(title).toBeInTheDocument();
  });

  it("should render the 'Crear Partida' button", () => {
    const button = screen.getByRole("button", { name: /Crear Partida/i });
    expect(button).toBeInTheDocument();
  });

  it("should navigate to create game page on button click", () => {
    const button = screen.getByRole("button", { name: /Crear Partida/i });
    fireEvent.click(button);
    expect(mockNavigate).toHaveBeenCalledWith("/testPlayer/creategame");
  });

  it("should establish WebSocket connection on mount", () => {
    expect(global.WebSocket).toHaveBeenCalledWith(
      "http://127.0.0.1:8000/ws/testPlayer"
    );
  });
});
