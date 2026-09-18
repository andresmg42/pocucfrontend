import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi, beforeEach } from "vitest";
import SessionList from "./SessionList";
import api from "../../api/user.api";
import usePageStore from "../../stores/use-page-store";
import useAuthStore from "../../stores/use-auth-store";

const navigateMock = vi.fn();

vi.mock("react-router", () => ({
  useNavigate: () => navigateMock,
}));

vi.mock("../../api/user.api", () => ({
  default: { get: vi.fn(), delete: vi.fn() },
}));

vi.mock("../../stores/use-page-store", () => ({
  default: vi.fn(),
}));

vi.mock("../../stores/use-auth-store", () => ({
  default: vi.fn(),
}));

vi.mock("react-hot-toast", () => ({
  default: { success: vi.fn(), error: vi.fn() },
}));

describe("SessionList", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    useAuthStore.mockReturnValue({
      userLogged: { email: "observer@example.com" },
    });
    usePageStore.mockReturnValue({
      addTrigger: true,
      setAddTrigger: vi.fn(),
      session: null,
      setSession: vi.fn(),
      update: false,
      setUpdate: vi.fn(),
    });
    api.get.mockResolvedValue({
      data: [
        {
          id: 1,
          number_session: 2,
          zone: 10,
          start_date: "2026-08-05",
          end_date: null,
          observational_distance: 100,
          uploaded_at: "2026-08-05",
          url: "https://example.com",
          state: 1,
        },
      ],
    });
    api.delete.mockResolvedValue({});
    window.confirm = vi.fn(() => true);
  });

  it("renders sessions and wires the action buttons", async () => {
    const user = userEvent.setup();

    render(<SessionList survey_id={99} />);

    await waitFor(() => {
      expect(screen.getByText("2")).toBeInTheDocument();
    });

    await user.click(screen.getByRole("button", { name: "Iniciar" }));
    await user.click(screen.getByRole("button", { name: "Editar" }));
    await user.click(screen.getByRole("button", { name: "Eliminar" }));

    expect(navigateMock).toHaveBeenCalledWith("visits/1");
    expect(usePageStore().setSession).toHaveBeenCalledWith(
      expect.objectContaining({ id: 1 }),
    );
    expect(api.delete).toHaveBeenCalledWith("surveysession/1/");
  });
});
