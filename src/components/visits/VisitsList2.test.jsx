import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi, beforeEach } from "vitest";
import VisitsList2 from "./VisitsList2";
import api from "../../api/user.api";
import usePageStore from "../../stores/use-page-store";
import useAuthStore from "../../stores/use-auth-store";

const navigateMock = vi.fn();

vi.mock("react-router", () => ({
  useNavigate: () => navigateMock,
}));

vi.mock("../../api/user.api", () => ({
  default: { get: vi.fn(), delete: vi.fn(), post: vi.fn() },
}));

vi.mock("../../stores/use-page-store", () => ({
  default: vi.fn(),
}));

vi.mock("../../stores/use-auth-store", () => ({
  default: vi.fn(),
}));

vi.mock("../placeholders/Placeholder1", () => ({
  default: ({ page_name }) => <div>{page_name} placeholder</div>,
}));

vi.mock("./VisitsPlaceholderCard", () => ({
  default: () => <div>placeholder-card</div>,
}));

vi.mock("../../utils/storage_functions", () => ({
  deleteVisitDataFromSession: vi.fn(),
}));

vi.mock("react-hot-toast", () => ({
  default: { success: vi.fn(), error: vi.fn() },
}));

describe("VisitsList2", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    useAuthStore.mockReturnValue({
      userLogged: { email: "observer@example.com" },
    });
    usePageStore.mockReturnValue({
      setVisitAddTriggerDisabled: vi.fn(),
      visitAddTriggerDisabled: {},
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
          visit_number: 1,
          visit_start_date_time: "2026-08-05T08:00:00Z",
          visit_end_date_time: null,
          state: 1,
        },
      ],
    });
    api.delete.mockResolvedValue({});
    api.post.mockResolvedValue({ status: 200 });
    window.confirm = vi.fn(() => true);
  });

  it("renders visits and wires the action buttons", async () => {
    const user = userEvent.setup();

    render(
      <VisitsList2 survey_id={99} surveysession_id={99} visit_number={1} />,
    );

    await waitFor(() => {
      expect(screen.getByText(/Visita: 1/i)).toBeInTheDocument();
    });

    await user.click(screen.getByRole("button", { name: "Start visit" }));
    await user.click(screen.getByRole("button", { name: "Delete visit" }));

    expect(navigateMock).toHaveBeenCalledWith("categories/1");
    expect(api.delete).toHaveBeenCalledWith("visit/1/");
  });
});
