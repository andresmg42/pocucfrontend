import { render, screen, waitFor } from "@testing-library/react";
import { describe, expect, it, vi, beforeEach } from "vitest";
import ResponsePage from "./ResponsePage";
import api from "../../services/apiAdmin";

vi.mock("../../services/apiAdmin", () => ({
  default: {
    response: {
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

describe("ResponsePage", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    api.response.list.mockResolvedValue({ data: [] });
  });

  it("loads responses and renders title", async () => {
    render(<ResponsePage />);

    await waitFor(() => expect(api.response.list).toHaveBeenCalled());
    expect(
      screen.getByRole("heading", { name: "responsePage.title" }),
    ).toBeInTheDocument();
  });
});
