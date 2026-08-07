import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";
import NoDataPlaceholder from "./NoDataPlaceholder";

const navigateMock = vi.fn();

vi.mock("react-router", () => ({
  useNavigate: () => navigateMock,
}));

describe("NoDataPlaceholder", () => {
  it("renders the empty state heading", () => {
    render(<NoDataPlaceholder />);

    expect(
      screen.getByRole("heading", { name: "No Hay Datos Para Mostrar" }),
    ).toBeInTheDocument();
  });

  it("navigates back when the button is clicked", async () => {
    const user = userEvent.setup();
    render(<NoDataPlaceholder />);

    await user.click(screen.getByRole("button", { name: "Ir Atras" }));

    expect(navigateMock).toHaveBeenCalledWith(-1);
  });
});