import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";
import Sidebar from "./Sidebar";

vi.mock("react-i18next", () => ({
  useTranslation: () => ({ t: (key) => key }),
}));

describe("Sidebar", () => {
  it("renders the menu and navigates when a page is selected", async () => {
    const user = userEvent.setup();
    const onNavigate = vi.fn();

    render(<Sidebar currentPage="survey" onNavigate={onNavigate} />);

    expect(screen.getByText("menu.AdminPanel")).toBeInTheDocument();
    await user.click(screen.getByRole("button", { name: "menu.category" }));

    expect(onNavigate).toHaveBeenCalledWith("category");
  });
});
