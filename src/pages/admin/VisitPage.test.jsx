import { render, screen, waitFor } from "@testing-library/react";
import { describe, expect, it, vi, beforeEach } from "vitest";
import VisitPage from "./VisitPage";
import api from "../../services/apiAdmin";

vi.mock("../../services/apiAdmin", () => ({
  default: {
    visit: {
      list: vi.fn(),
      create: vi.fn(),
      update: vi.fn(),
      delete: vi.fn(),
    },
    surveysession: {
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

describe("VisitPage", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    api.visit.list.mockResolvedValue({ data: [] });
    api.surveysession.list.mockResolvedValue({ data: [] });
  });

  it("loads visits and sessions then renders heading", async () => {
    render(<VisitPage />);

    await waitFor(() => {
      expect(api.visit.list).toHaveBeenCalled();
      expect(api.surveysession.list).toHaveBeenCalled();
    });

    expect(
      screen.getByRole("heading", { name: "visitPage.title" }),
    ).toBeInTheDocument();
  });
});
