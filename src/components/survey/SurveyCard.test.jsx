import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";
import SurveyCard from "./SurveyCard";

const navigateMock = vi.fn();

vi.mock("react-router", () => ({
  useNavigate: () => navigateMock,
}));

describe("SurveyCard", () => {
  it("navigates on click and keyboard activation", async () => {
    const user = userEvent.setup();

    render(
      <SurveyCard
        survey={{
          id: 7,
          name: "Survey A",
          topic: "Topic",
          description: "Description",
          image_url: "",
        }}
      />,
    );

    await user.click(screen.getByRole("button", { name: /Survey A/i }));
    await user.keyboard("{Enter}");

    expect(navigateMock).toHaveBeenCalledWith("surveysession/7");
  });
});
