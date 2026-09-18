import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi, beforeEach } from "vitest";
import SurveySession from "./SurveySession";
import usePageStore from "../../stores/use-page-store";

vi.mock("react-router", () => ({
  useParams: () => ({ survey_id: "77" }),
}));

vi.mock("../../stores/use-page-store", () => ({
  default: vi.fn(),
}));

vi.mock("../../components/surveysession/SessionList", () => ({
  default: () => null,
}));

vi.mock("../../components/surveysession/SessionList2", () => ({
  default: ({ survey_id }) => (
    <div data-testid="session-list" data-survey={survey_id} />
  ),
}));

vi.mock("../../components/surveysession/CreateSession", () => ({
  default: ({ survey_id }) => (
    <div data-testid="create-session" data-survey={survey_id} />
  ),
}));

describe("SurveySession", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("renders SessionList2 when addTrigger is true", () => {
    usePageStore.mockReturnValue({
      addTrigger: true,
      setAddTrigger: vi.fn(),
      setUpdate: vi.fn(),
      update: false,
    });

    render(<SurveySession />);

    expect(screen.getByTestId("session-list")).toBeInTheDocument();
    expect(screen.getByTestId("session-list")).toHaveAttribute(
      "data-survey",
      "77",
    );
    expect(screen.queryByTestId("create-session")).not.toBeInTheDocument();
  });

  it("renders CreateSession when addTrigger is false", () => {
    usePageStore.mockReturnValue({
      addTrigger: false,
      setAddTrigger: vi.fn(),
      setUpdate: vi.fn(),
      update: false,
    });

    render(<SurveySession />);

    expect(screen.getByTestId("create-session")).toBeInTheDocument();
    expect(screen.queryByTestId("session-list")).not.toBeInTheDocument();
  });

  it("toggles the add trigger and resets update when the add button is clicked", async () => {
    const user = userEvent.setup();
    const setAddTrigger = vi.fn();
    const setUpdate = vi.fn();
    usePageStore.mockReturnValue({
      addTrigger: true,
      setAddTrigger,
      setUpdate,
      update: false,
    });

    render(<SurveySession />);

    await user.click(screen.getByRole("button"));

    expect(setAddTrigger).toHaveBeenCalledWith(false);
    expect(setUpdate).toHaveBeenCalledWith(false);
  });
});