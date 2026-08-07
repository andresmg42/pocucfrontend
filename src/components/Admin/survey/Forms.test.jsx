import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import { describe, expect, it, vi, beforeEach } from "vitest";
import Forms from "./Forms";
import api from "../../../api/user.api";
import toast from "react-hot-toast";

vi.mock("../../../api/user.api", () => ({
  default: {
    post: vi.fn(),
    put: vi.fn(),
  },
}));

vi.mock("react-hot-toast", () => ({
  default: {
    success: vi.fn(),
    error: vi.fn(),
  },
}));

describe("Forms", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("renders the empty form and submits a trimmed payload", async () => {
    api.post.mockResolvedValue({ status: 201, data: { id: 42 } });
    const onBack = vi.fn();
    const setCreated = vi.fn();
    const setEdit = vi.fn();

    render(
      <Forms
        onBack={onBack}
        setCreated={setCreated}
        edit={false}
        setEdit={setEdit}
      />,
    );

    fireEvent.change(screen.getByLabelText(/Nombre/i), {
      target: { value: "  Encuesta nueva  " },
    });
    fireEvent.change(screen.getByLabelText(/Tema/i), {
      target: { value: "  Seguridad  " },
    });
    fireEvent.change(screen.getByLabelText(/Version/i), {
      target: { value: "  v1.0  " },
    });
    fireEvent.change(screen.getByLabelText(/Descripcion/i), {
      target: { value: "  Descripcion base  " },
    });
    fireEvent.click(screen.getByRole("button", { name: "Crear" }));

    await waitFor(() => {
      expect(api.post).toHaveBeenCalledWith("survey/surveys/", {
        name: "Encuesta nueva",
        topic: "Seguridad",
        version: "v1.0",
        description: "Descripcion base",
        image_url: null,
      });
    });
    expect(onBack).toHaveBeenCalledTimes(1);
    expect(setCreated).toHaveBeenCalledTimes(1);
    expect(setEdit).toHaveBeenCalledWith(false);
    expect(toast.success).toHaveBeenCalledWith("Encuesta creada correctamente");
    expect(
      screen.getByText(
        /El ID de la encuesta se mostrara cuando se cree correctamente/i,
      ),
    ).toBeInTheDocument();
  });

  it("loads edit data and submits an update", async () => {
    api.put.mockResolvedValue({ status: 200, data: { id: 7 } });
    const onBack = vi.fn();
    const setCreated = vi.fn();
    const setEdit = vi.fn();

    render(
      <Forms
        onBack={onBack}
        setCreated={setCreated}
        edit
        editPayload={{
          id: 7,
          name: "Encuesta existente",
          topic: "Salud",
          version: "v2",
          description: "Detalle",
          image_url: "https://example.com/img.png",
        }}
        setEdit={setEdit}
      />,
    );

    expect(screen.getByDisplayValue("Encuesta existente")).toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: "Actualizar" }),
    ).toBeInTheDocument();

    fireEvent.click(screen.getByRole("button", { name: "Actualizar" }));

    await waitFor(() => {
      expect(api.put).toHaveBeenCalledWith("survey/surveys/7/", {
        name: "Encuesta existente",
        topic: "Salud",
        version: "v2",
        description: "Detalle",
        image_url: "https://example.com/img.png",
      });
    });
    expect(onBack).toHaveBeenCalledTimes(1);
    expect(setCreated).toHaveBeenCalledTimes(1);
    expect(setEdit).toHaveBeenCalledWith(false);
  });
});
