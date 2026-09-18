import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi, beforeEach } from "vitest";
import VisitsList from "./VisitsList";
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

describe("VisitsList", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    useAuthStore.mockReturnValue({
      userLogged: { email: "observer@example.com" },
    });
    usePageStore.mockReturnValue({
      setVisit: vi.fn(),
      addTriggerVisit: true,
      setAddTriggerVisit: vi.fn(),
      setUpdateVisit: vi.fn(),
    });
    api.get.mockResolvedValue({
      data: [
        {
          id: 1,
          surveysession: 99,
          visit_number: 2,
          visit_date: "2026-08-05",
          start_time: "08:00",
          end_time: null,
          state: 1,
        },
      ],
    });
    api.delete.mockResolvedValue({});
  });

  it("renders visits and wires the action buttons", async () => {
    const user = userEvent.setup();

    render(<VisitsList surveysession_id={99} />);

    await waitFor(() => {
      expect(screen.getByText("2")).toBeInTheDocument();
    });

    await user.click(screen.getByRole("button", { name: "Gestionar" }));
    await user.click(screen.getByRole("button", { name: "Editar" }));
    await user.click(screen.getByRole("button", { name: "Eliminar" }));

    expect(navigateMock).toHaveBeenCalledWith("categories/1");
    expect(api.delete).toHaveBeenCalledWith("visit/1/");
  });
});
