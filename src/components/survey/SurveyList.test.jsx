import { render, screen, waitFor } from "@testing-library/react";
import { describe, expect, it, vi, beforeEach } from "vitest";
import SurveyList from "./SurveyList";
import api from "../../api/user.api";
import useAuthStore from "../../stores/use-auth-store";

vi.mock("../../api/user.api", () => ({
  default: { get: vi.fn() },
}));

vi.mock("../../stores/use-auth-store", () => ({
  default: vi.fn(),
}));

vi.mock("./SurveyCard", () => ({
  default: ({ survey }) => <div>card:{survey.name}</div>,
}));

vi.mock("./SurveyCardPlaceholder", () => ({
  default: () => <div>placeholder</div>,
}));

describe("SurveyList", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    useAuthStore.mockReturnValue({ token: "token", isLoading: false });
  });

  it("shows placeholders and then renders fetched surveys", async () => {
    api.get.mockResolvedValue({
      data: [{ id: 1, name: "Survey 1" }],
    });

    render(<SurveyList />);

    expect(screen.getAllByText("placeholder")).toHaveLength(4);

    await waitFor(() => {
      expect(screen.getByText("card:Survey 1")).toBeInTheDocument();
    });
  });
});
