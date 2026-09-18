import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi, beforeEach } from "vitest";
import Visits from "./Visits";
import api from "../../api/user.api";
import usePageStore from "../../stores/use-page-store";
import toast from "react-hot-toast";

vi.mock("react-router", () => ({
  useParams: () => ({
    survey_id: "5",
    surveysession_id: "44",
    visit_number: "2",
  }),
}));

vi.mock("../../stores/use-page-store", () => ({
  default: vi.fn(),
}));

vi.mock("../../api/user.api", () => ({
  default: { post: vi.fn() },
}));

vi.mock("react-hot-toast", () => ({
  default: { success: vi.fn(), error: vi.fn() },
}));

vi.mock("../../components/visits/VisitsList2", () => ({
  default: ({ surveysession_id, visit_number, survey_id }) => (
    <div
      data-testid="visits-list"
      data-session={surveysession_id}
      data-visit={visit_number}
      data-survey={survey_id}
    />
  ),
}));

describe("Visits", () => {
  const baseStore = (overrides = {}) => ({
    addTriggerVisit: false,
    setAddTriggerVisit: vi.fn(),
    updateVisit: false,
    setUpdateVisit: vi.fn(),
    visitAddTriggerDisabled: {},
    ...overrides,
  });

  beforeEach(() => {
    vi.clearAllMocks();
    usePageStore.mockReturnValue(baseStore());
    api.post.mockResolvedValue({ status: 201 });
  });

  it("renders the visits list with the route params", () => {
    render(<Visits />);

    expect(screen.getByTestId("visits-list")).toHaveAttribute(
      "data-session",
      "44",
    );
    expect(screen.getByTestId("visits-list")).toHaveAttribute(
      "data-visit",
      "2",
    );
    expect(screen.getByTestId("visits-list")).toHaveAttribute(
      "data-survey",
      "5",
    );
  });

  it("creates a visit and toggles the create view", async () => {
    const user = userEvent.setup();
    const setAddTriggerVisit = vi.fn();
    usePageStore.mockReturnValue(
      baseStore({ addTriggerVisit: false, setAddTriggerVisit }),
    );

    render(<Visits />);

    await user.click(screen.getByRole("button", { name: "add" }));

    await waitFor(() => {
      expect(api.post).toHaveBeenCalledWith("visit/", { surveysession: "44" });
    });
    expect(setAddTriggerVisit).toHaveBeenCalledWith(true);
    expect(toast.success).toHaveBeenCalledWith(
      "Visita creada exitosamente!",
    );
  });

  it("blocks visit creation when it is disabled for the session", async () => {
    const user = userEvent.setup();
    usePageStore.mockReturnValue(
      baseStore({ visitAddTriggerDisabled: { 44: true } }),
    );

    render(<Visits />);

    await user.click(screen.getByRole("button", { name: "add" }));

    expect(toast.error).toHaveBeenCalledWith(
      "Ya no puedes crear mas visitas!",
    );
    expect(api.post).not.toHaveBeenCalled();
  });
});