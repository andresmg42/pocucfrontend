import { render, screen, waitFor } from "@testing-library/react";
import { describe, expect, it, vi, beforeEach } from "vitest";
import SubcategoryPage from "./SubcategoryPage";
import api from "../../services/apiAdmin";

vi.mock("../../services/apiAdmin", () => ({
  default: {
    subcategory: {
      list: vi.fn(),
      create: vi.fn(),
      update: vi.fn(),
      delete: vi.fn(),
    },
    category: {
      list: vi.fn(),
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

describe("SubcategoryPage", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    api.subcategory.list.mockResolvedValue({ data: [] });
    api.category.list.mockResolvedValue({ data: [] });
  });

  it("loads subcategories and categories on mount", async () => {
    render(<SubcategoryPage />);

    await waitFor(() => {
      expect(api.subcategory.list).toHaveBeenCalled();
      expect(api.category.list).toHaveBeenCalled();
    });

    expect(
      screen.getByRole("heading", { name: "subcategoryPage.title" }),
    ).toBeInTheDocument();
  });
});
