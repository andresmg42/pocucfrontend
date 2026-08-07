import { render, screen, waitFor } from "@testing-library/react";
import { describe, expect, it, vi, beforeEach } from "vitest";
import Category from "./Category";
import api from "../../api/user.api";

vi.mock("react-router", () => ({
  useParams: () => ({ surveysession_id: "10", visit_id: "3" }),
}));

vi.mock("../../api/user.api", () => ({
  default: { get: vi.fn() },
}));

vi.mock("../../components/categories/CategoryCard", () => ({
  default: ({ category, visit_id, surveysession_id }) => (
    <div
      data-testid="category-card"
      data-name={category.name}
      data-visit={visit_id}
      data-session={surveysession_id}
    />
  ),
}));

vi.mock("../../components/categories/CategoryCardPlaceHolder", () => ({
  default: () => <div data-testid="placeholder" />,
}));

describe("Category", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("renders placeholders while loading categories", () => {
    api.get.mockReturnValue(new Promise(() => {}));

    render(<Category />);

    expect(screen.getAllByTestId("placeholder")).toHaveLength(2);
  });

  it("renders one category card per fetched category with its props", async () => {
    api.get.mockResolvedValue({
      data: [
        { id: 1, name: "Infraestructura" },
        { id: 2, name: "Servicios" },
      ],
    });

    render(<Category />);

    await waitFor(() => {
      expect(screen.getAllByTestId("category-card")).toHaveLength(2);
    });

    expect(api.get).toHaveBeenCalledWith(
      "category/list?surveysession_id=10",
    );

    const cards = screen.getAllByTestId("category-card");
    expect(cards[0]).toHaveAttribute("data-name", "Infraestructura");
    expect(cards[0]).toHaveAttribute("data-visit", "3");
    expect(cards[0]).toHaveAttribute("data-session", "10");
  });

  it("stops loading without crashing when the fetch fails", async () => {
    api.get.mockRejectedValue(new Error("network"));

    render(<Category />);

    await waitFor(() => {
      expect(screen.queryAllByTestId("placeholder")).toHaveLength(0);
    });

    expect(screen.queryAllByTestId("category-card")).toHaveLength(0);
  });
});