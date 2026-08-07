import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi, beforeEach } from "vitest";
import CreateSession from "./CreateSession";
import api from "../../api/user.api";
import usePageStore from "../../stores/use-page-store";
import useAuthStore from "../../stores/use-auth-store";

vi.mock("../../api/user.api", () => ({
  default: {
    get: vi.fn(),
    post: vi.fn(),
    put: vi.fn(),
  },
}));

vi.mock("../../stores/use-page-store", () => ({
  default: vi.fn(),
}));

vi.mock("../../stores/use-auth-store", () => ({
  default: vi.fn(),
}));

vi.mock("react-hot-toast", () => ({
  default: {
    success: vi.fn(),
    error: vi.fn(),
  },
}));

describe("CreateSession", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    useAuthStore.mockReturnValue({
      userLogged: { email: "observer@example.com" },
    });
    usePageStore.mockReturnValue({
      setAddTrigger: vi.fn(),
      addTrigger: false,
      session: null,
      setSession: vi.fn(),
      update: false,
      setUpdate: vi.fn(),
    });
    api.get.mockImplementation((url) => {
      if (url === "/campus") {
        return Promise.resolve({ data: [{ id: 1, name: "Campus A" }] });
      }
      if (url === "/zone/get_zones_by_campus/?campus_id=1") {
        return Promise.resolve({ data: [{ id: 10, name: "Zone A" }] });
      }
      return Promise.resolve({ data: [] });
    });
    api.post.mockResolvedValue({ status: 201 });
  });

  it("submits a new session after selecting campus and zone", async () => {
    const user = userEvent.setup();
    const setAddTrigger = vi.fn();
    const setUpdate = vi.fn();
    usePageStore.mockReturnValue({
      setAddTrigger,
      addTrigger: false,
      session: null,
      setSession: vi.fn(),
      update: false,
      setUpdate,
    });

    render(<CreateSession survey_id={99} />);

    const dropdownButtons = screen.getAllByRole("button", {
      name: /Selecciona una/i,
    });

    await user.click(dropdownButtons[0]);
    await user.click(screen.getByText("Campus A"));

    await waitFor(() => {
      expect(api.get).toHaveBeenCalledWith(
        "/zone/get_zones_by_campus/?campus_id=1",
      );
    });

    await user.click(screen.getByRole("button", { name: /Selecciona una/i }));
    await user.click(await screen.findByText("Zone A"));

    await user.type(screen.getByLabelText(/Numero de Visitas/i), "3");
    await user.type(screen.getByLabelText(/Distancia Observacional/i), "100");
    await user.type(
      screen.getByLabelText(/URL de Carpeta Drive/i),
      "https://drive.google.com/test",
    );
    await user.click(screen.getByRole("button", { name: "Registrar" }));

    await waitFor(() => {
      expect(api.post).toHaveBeenCalledWith("surveysession/", {
        zone: 10,
        visit_number: "3",
        observational_distance: "100",
        url: "https://drive.google.com/test",
        survey: 99,
      });
    });
    expect(setAddTrigger).toHaveBeenCalledWith(true);
    expect(setUpdate).toHaveBeenCalledWith(false);
  });
});
