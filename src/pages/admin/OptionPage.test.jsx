import { render, screen, waitFor } from "@testing-library/react";
import { describe, expect, it, vi, beforeEach } from "vitest";
import OptionPage from "./OptionPage";
import api from "../../services/apiAdmin";

vi.mock("../../services/apiAdmin", () => ({
  default: {
    option: {
      list: vi.fn(),
      create: vi.fn(),
      update: vi.fn(),
      delete: vi.fn(),
    },
  },
}));

vi.mock("react-i18next", () => ({
  useTranslation: () => ({ t: (key) => key }),
}));

vi.mock("sonner", () => ({
  toast: { success: vi.fn(), error: vi.fn() },
}));

vi.mock("../../components/Admin/DataTable", () => ({
  default: () => <div data-testid="datatable" />,
}));

vi.mock("../../components/Admin/Filters", () => ({
  default: () => <div data-testid="filters" />,
}));

vi.mock("../../components/Admin/Modal", () => ({
  default: () => null,
}));

describe("OptionPage", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    api.option.list.mockResolvedValue({ data: [] });
  });

  it("loads options and renders heading", async () => {
    render(<OptionPage />);

    await waitFor(() => expect(api.option.list).toHaveBeenCalled());
    expect(
      screen.getByRole("heading", { name: "optionPage.title" }),
    ).toBeInTheDocument();
  });
});
