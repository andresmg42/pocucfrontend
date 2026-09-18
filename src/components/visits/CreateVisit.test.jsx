import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi, beforeEach } from "vitest";
import CreateVisit from "./CreateVisit";
import api from "../../api/user.api";
import usePageStore from "../../stores/use-page-store";

vi.mock("../../api/user.api", () => ({
  default: { get: vi.fn(), post: vi.fn(), put: vi.fn() },
}));

vi.mock("../../stores/use-page-store", () => ({
  default: vi.fn(),
}));

vi.mock("../../stores/use-auth-store", () => ({
  default: vi.fn(() => ({ userLogged: { email: "observer@example.com" } })),
}));

vi.mock("react-hot-toast", () => ({
  default: { success: vi.fn(), error: vi.fn() },
}));

describe("CreateVisit", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    usePageStore.mockReturnValue({
      addTriggerVisit: false,
      setAddTriggerVisit: vi.fn(),
      updateVisit: false,
      visit: null,
      setUpdateVisit: vi.fn(),
    });
    api.post.mockResolvedValue({ status: 200 });
  });

  it("submits a visit and toggles the create view", async () => {
    const user = userEvent.setup();
    const setAddTriggerVisit = vi.fn();
    const setUpdateVisit = vi.fn();
    usePageStore.mockReturnValue({
      addTriggerVisit: false,
      setAddTriggerVisit,
      updateVisit: false,
      visit: null,
      setUpdateVisit,
    });

    render(<CreateVisit surveysession_id={44} />);

    await user.type(screen.getByLabelText(/Número de Visita/i), "3");
    await user.click(screen.getByRole("button", { name: "Registrar" }));

    await waitFor(() => {
      expect(api.post).toHaveBeenCalledWith("visit/", {
        surveysession: 44,
        visit_number: "3",
      });
    });
    expect(setUpdateVisit).toHaveBeenCalledWith(false);
    expect(setAddTriggerVisit).toHaveBeenCalledWith(true);
  });
});
