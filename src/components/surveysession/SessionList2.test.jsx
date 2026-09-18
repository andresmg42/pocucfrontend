import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi, beforeEach } from "vitest";
import SessionList2 from "./SessionList2";
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

vi.mock("./SurveySessionPlaceholderCard", () => ({
  default: () => <div>placeholder-card</div>,
}));

vi.mock("react-hot-toast", () => ({
  default: { success: vi.fn(), error: vi.fn() },
}));

describe("SessionList2", () => {
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
      setVisitAddTriggerDisabled: vi.fn(),
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
          visit_number: 1,
        },
      ],
    });
    api.delete.mockResolvedValue({});
    api.post.mockResolvedValue({ status: 200 });
    window.confirm = vi.fn(() => true);
  });

  it("renders sessions and wires the action buttons", async () => {
    const user = userEvent.setup();

    render(<SessionList2 survey_id={99} />);

    await waitFor(() => {
      expect(screen.getByText(/Sesión: 2/i)).toBeInTheDocument();
    });

    await user.click(screen.getByRole("button", { name: "Start session" }));
    await user.click(screen.getByRole("button", { name: "Edit session" }));
    await user.click(screen.getByRole("button", { name: "Delete session" }));

    expect(navigateMock).toHaveBeenCalledWith("visits/1/1");
    expect(api.delete).toHaveBeenCalledWith("surveysession/1/");
  });
});
