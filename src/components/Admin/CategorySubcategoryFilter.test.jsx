import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi, beforeEach } from "vitest";
import CategorySubcategoryFilter from "./CategorySubcategoryFilter";
import api from "../../services/apiAdmin";

vi.mock("react-i18next", () => ({
  useTranslation: () => ({
    t: (key, options) =>
      options?.category && options?.subcategory
        ? `${key}:${options.category}/${options.subcategory}`
        : key,
  }),
}));

vi.mock("../../services/apiAdmin", () => ({
  default: {
    category: { list: vi.fn() },
    subcategory: { list: vi.fn() },
  },
}));

describe("CategorySubcategoryFilter", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("loads data and allows selecting category and subcategory", async () => {
    const user = userEvent.setup();
    api.category.list.mockResolvedValue({
      data: [{ id: 1, name: "Category A" }],
    });
    api.subcategory.list.mockResolvedValue({
      data: [
        { id: 11, name: "Sub A", category: 1 },
        { id: 12, name: "Sub B", category: 2 },
      ],
    });
    const onCategoryChange = vi.fn();
    const onSubcategoryChange = vi.fn();

    const { rerender } = render(
      <CategorySubcategoryFilter
        selectedCategory={null}
        selectedSubcategory={null}
        onCategoryChange={onCategoryChange}
        onSubcategoryChange={onSubcategoryChange}
      />,
    );

    await waitFor(() => {
      expect(
        screen.getByText("categorySubcategoryFilter.helperText"),
      ).toBeInTheDocument();
    });

    await user.selectOptions(screen.getAllByRole("combobox")[0], "1");
    expect(onCategoryChange).toHaveBeenCalledWith({
      id: 1,
      name: "Category A",
    });

    rerender(
      <CategorySubcategoryFilter
        selectedCategory={{ id: 1, name: "Category A" }}
        selectedSubcategory={null}
        onCategoryChange={onCategoryChange}
        onSubcategoryChange={onSubcategoryChange}
      />,
    );

    await user.selectOptions(screen.getAllByRole("combobox")[1], "11");
    expect(onSubcategoryChange).toHaveBeenCalledWith({
      id: 11,
      name: "Sub A",
      category: 1,
    });
  });
});
