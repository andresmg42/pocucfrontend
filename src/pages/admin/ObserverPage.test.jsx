import { render, screen, waitFor } from "@testing-library/react";
import { describe, expect, it, vi, beforeEach } from "vitest";
import ObserverPage from "./ObserverPage";
import api from "../../services/apiAdmin";

vi.mock("../../services/apiAdmin", () => ({
  default: {
    observer: {
      list: vi.fn(),
      createValidUser: vi.fn(),
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

describe("ObserverPage", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    api.observer.list.mockResolvedValue({ data: [] });
  });

  it("loads observers and renders heading", async () => {
    render(<ObserverPage />);

    await waitFor(() => expect(api.observer.list).toHaveBeenCalled());
    expect(
      screen.getByRole("heading", { name: "observerPage.title" }),
    ).toBeInTheDocument();
  });
});
