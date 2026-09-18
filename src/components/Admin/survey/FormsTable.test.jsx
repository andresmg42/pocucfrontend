import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi, beforeEach } from "vitest";
import FormsTable from "./FormsTable";
import api from "../../../api/user.api";

const navigateMock = vi.fn();

vi.mock("../../../api/user.api", () => ({
  default: {
    get: vi.fn(),
    delete: vi.fn(),
  },
}));

vi.mock("react-router", () => ({
  useNavigate: () => navigateMock,
}));

vi.mock("./Forms", () => ({
  default: ({ onBack }) => (
    <div>
      <p>Mocked Forms</p>
      <button type="button" onClick={onBack}>
        Back
      </button>
    </div>
  ),
}));

vi.mock("react-hot-toast", () => ({
  default: {
    success: vi.fn(),
    error: vi.fn(),
  },
}));

describe("FormsTable", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    window.confirm = vi.fn();
  });

  it("loads surveys and navigates when a row is clicked", async () => {
    const user = userEvent.setup();
    api.get.mockResolvedValue({
      data: [
        {
          id: 1,
          name: "Survey 1",
          topic: "Topic 1",
          version: "v1",
          description: "First survey",
          image_url: "https://example.com/image.png",
          uploaded_at: "2026-01-01",
        },
      ],
    });

    render(<FormsTable />);

    expect(screen.getByText(/Cargando encuestas/i)).toBeInTheDocument();

    await waitFor(() => {
      expect(screen.getByText("Survey 1")).toBeInTheDocument();
    });

    await user.click(screen.getByText("Survey 1"));

    expect(navigateMock).toHaveBeenCalledWith("create-questions/1");
  });

  it("opens the create form when the add button is clicked", async () => {
    const user = userEvent.setup();
    api.get.mockResolvedValue({ data: [] });

    render(<FormsTable />);

    await waitFor(() => {
      expect(
        screen.getByText(/No hay encuestas registradas/i),
      ).toBeInTheDocument();
    });

    await user.click(
      screen.getByRole("button", { name: /Crear nueva encuesta/i }),
    );

    expect(screen.getByText("Mocked Forms")).toBeInTheDocument();
  });
});
