import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import CategoryCardPlaceHolder from "./CategoryCardPlaceHolder";

describe("CategoryCardPlaceHolder", () => {
  it("renders a loading placeholder", () => {
    render(<CategoryCardPlaceHolder />);

    expect(screen.getByRole("status")).toBeInTheDocument();
  });
});
