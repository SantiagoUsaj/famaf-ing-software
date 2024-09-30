import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import TablePlayers from "../components/TablePlayers"; // Ajusta la ruta según corresponda

describe("TablePlayers", () => {
  it("debe renderizar el componente correctamente", () => {
    render(<TablePlayers />);

    // Verificar que el componente existe
    expect(screen.getByTestId("table-players")).toBeInTheDocument();
  });

  it("debe renderizar la tabla con los datos correctos", () => {
    render(<TablePlayers />);

    // Verificar que los nombres de los jugadores aparecen en la tabla
    expect(screen.getByText("Santi Usaj")).toBeInTheDocument();
    expect(screen.getByText("Ferrari")).toBeInTheDocument();
    expect(screen.getByText("Mateo Angeli")).toBeInTheDocument();
    expect(screen.getByText("Fede Di Forte")).toBeInTheDocument();
  });

  it("debe mostrar las etiquetas con las clases correctas", () => {
    render(<TablePlayers />);

    // Verificar que la etiqueta 'Creador' está presente con la clase de color correcto (volcano)
    const creatorTag = screen.getByText("CREADOR");
    expect(creatorTag).toBeInTheDocument();
    expect(creatorTag).toHaveClass("ant-tag-volcano");

    // Verificar que las etiquetas 'Jugador' están presentes
    const playerTags = screen.getAllByText("JUGADOR");
    playerTags.forEach((tag) => {
      expect(tag).toBeInTheDocument();
      expect(tag).toHaveClass("ant-tag-blue"); // Ajusta según el color de Ant Design
    });
  });
});
