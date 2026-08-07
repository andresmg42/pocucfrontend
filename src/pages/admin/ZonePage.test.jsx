import { render, screen, waitFor } from "@testing-library/react";
import { describe, expect, it, vi, beforeEach } from "vitest";
import ZonePage from "./ZonePage";
import api from "../../services/apiAdmin";

vi.mock("../../services/apiAdmin", () => ({
  default: {
    zone: {
      list: vi.fn(),
      create: vi.fn(),
      update: vi.fn(),
      delete: vi.fn(),
    },
    campus: {
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

describe("ZonePage", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    api.zone.list.mockResolvedValue({ data: [] });
    api.campus.list.mockResolvedValue({ data: [] });
  });

  it("loads zones and campuses then renders title", async () => {
    render(<ZonePage />);

    await waitFor(() => {
      expect(api.zone.list).toHaveBeenCalled();
      expect(api.campus.list).toHaveBeenCalled();
    });

    expect(
      screen.getByRole("heading", { name: "zonePage.title" }),
    ).toBeInTheDocument();
  });
});
