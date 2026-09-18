import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import SurveySessionPlaceholderCard from "./SurveySessionPlaceholderCard";

describe("SurveySessionPlaceholderCard", () => {
  it("renders a loading placeholder", () => {
    render(<SurveySessionPlaceholderCard />);

    expect(screen.getByRole("status")).toBeInTheDocument();
  });
});
