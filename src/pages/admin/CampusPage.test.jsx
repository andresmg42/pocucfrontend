import { render, screen, waitFor } from "@testing-library/react";
import { describe, expect, it, vi, beforeEach } from "vitest";
import CampusPage from "./CampusPage";
import api from "../../services/apiAdmin";

vi.mock("../../services/apiAdmin", () => ({
  default: {
    campus: {
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
  default: ({ data = [] }) => (
    <div data-testid="datatable">rows:{data.length}</div>
  ),
}));

vi.mock("../../components/Admin/Filters", () => ({
  default: () => <div data-testid="filters" />,
}));

vi.mock("../../components/Admin/Modal", () => ({
  default: ({ isOpen, children }) =>
    isOpen ? <div data-testid="modal">{children}</div> : null,
}));

describe("CampusPage", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    api.campus.list.mockResolvedValue({ data: [{ id: 1, name: "North" }] });
  });

  it("loads campuses and renders page", async () => {
    render(<CampusPage />);

    await waitFor(() => expect(api.campus.list).toHaveBeenCalled());
    expect(screen.getByRole("heading", { name: "Campus" })).toBeInTheDocument();
    expect(screen.getByTestId("datatable")).toBeInTheDocument();
  });
});
