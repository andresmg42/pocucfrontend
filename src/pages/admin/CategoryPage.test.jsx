import { render, screen, waitFor } from "@testing-library/react";
import { describe, expect, it, vi, beforeEach } from "vitest";
import CategoryPage from "./CategoryPage";
import api from "../../services/apiAdmin";

vi.mock("../../services/apiAdmin", () => ({
  default: {
    category: {
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

describe("CategoryPage", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    api.category.list.mockResolvedValue({ data: [] });
  });

  it("loads categories and renders translated heading", async () => {
    render(<CategoryPage />);

    await waitFor(() => expect(api.category.list).toHaveBeenCalled());
    expect(
      screen.getByRole("heading", { name: "categoryPage.title" }),
    ).toBeInTheDocument();
  });
});
