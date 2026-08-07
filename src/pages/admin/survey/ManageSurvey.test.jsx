import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";
import ManageSurvey from "./ManageSurvey";

vi.mock("../../../components/admin/survey/FormsTable", () => ({
  default: () => <div data-testid="forms-table" />,
}));

describe("ManageSurvey", () => {
  it("renders management panel and updates active section", async () => {
    const user = userEvent.setup();
    render(<ManageSurvey />);

    expect(
      screen.getByRole("heading", { name: "Panel de control" }),
    ).toBeInTheDocument();
    expect(
      screen.getByRole("heading", { name: "Usuarios" }),
    ).toBeInTheDocument();

    await user.click(screen.getByRole("button", { name: "Campus Ver" }));
    expect(screen.getByRole("heading", { name: "Campus" })).toBeInTheDocument();
    expect(screen.getByTestId("forms-table")).toBeInTheDocument();
  });
});
