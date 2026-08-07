import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi, beforeEach } from "vitest";
import CategoryCard from "./CategoryCard";
import api from "../../api/user.api";

const navigateMock = vi.fn();

vi.mock("react-router", () => ({
  useNavigate: () => navigateMock,
}));

vi.mock("../../api/user.api", () => ({
  default: {
    get: vi.fn(),
    delete: vi.fn(),
  },
}));

vi.mock("react-hot-toast", () => ({
  default: {
    success: vi.fn(),
    error: vi.fn(),
  },
}));

vi.mock("../../stores/use-auth-store", () => ({
  default: () => ({ token: "token", isLoading: false }),
}));

describe("CategoryCard", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    api.get.mockResolvedValue({ data: { is_completed: false } });
  });

  it("navigates to the form when the category is not completed", async () => {
    const user = userEvent.setup();

    render(
      <CategoryCard
        category={{ id: 5, name: "Category 5", image: "" }}
        visit_id={33}
      />,
    );

    await waitFor(() => {
      expect(
        screen.getByRole("button", { name: "Iniciar" }),
      ).toBeInTheDocument();
    });

    await user.click(screen.getByRole("button", { name: "Iniciar" }));
    expect(navigateMock).toHaveBeenCalledWith("form/5/Category 5/");
  });

  it("deletes the responses when completed and confirmed", async () => {
    const user = userEvent.setup();
    api.get.mockResolvedValue({ data: { is_completed: true } });
    api.delete.mockResolvedValue({ data: {} });
    window.confirm = vi.fn(() => true);

    render(
      <CategoryCard
        category={{ id: 7, name: "Category 7", image: "" }}
        visit_id={44}
      />,
    );

    await waitFor(() => {
      expect(
        screen.getByRole("button", { name: "Eliminar Envio" }),
      ).toBeInTheDocument();
    });

    await user.click(screen.getByRole("button", { name: "Eliminar Envio" }));
    expect(api.delete).toHaveBeenCalledWith(
      "response/delete_responses_by_category/?category_id=7&visit_id=44",
    );
  });
});
