import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import SurveyCardPlaceholder from "./SurveyCardPlaceholder";

describe("SurveyCardPlaceholder", () => {
  it("renders a loading placeholder", () => {
    render(<SurveyCardPlaceholder />);

    expect(screen.getByRole("status")).toBeInTheDocument();
  });
});
