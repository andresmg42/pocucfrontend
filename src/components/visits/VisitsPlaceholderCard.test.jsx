import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import VisitsPlaceholderCard from "./VisitsPlaceholderCard";

describe("VisitsPlaceholderCard", () => {
  it("renders a loading placeholder", () => {
    render(<VisitsPlaceholderCard />);

    expect(screen.getByRole("status")).toBeInTheDocument();
  });
});
