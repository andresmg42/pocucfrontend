import { render, screen, waitFor } from "@testing-library/react";
import { describe, expect, it, vi, beforeEach } from "vitest";
import SurveysessionPage from "./SurveysessionPage";
import api from "../../services/apiAdmin";

vi.mock("../../services/apiAdmin", () => ({
  default: {
    surveysession: {
      list: vi.fn(),
      create: vi.fn(),
      update: vi.fn(),
      delete: vi.fn(),
    },
    campus: { list: vi.fn() },
    survey: { list: vi.fn() },
    observer: { list: vi.fn() },
    zone: { getZoneByCampus: vi.fn() },
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

describe("SurveysessionPage", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    api.surveysession.list.mockResolvedValue({ data: [] });
    api.campus.list.mockResolvedValue({ data: [] });
    api.survey.list.mockResolvedValue({ data: [] });
    api.observer.list.mockResolvedValue({ data: [] });
  });

  it("loads initial datasets and renders heading", async () => {
    render(<SurveysessionPage />);

    await waitFor(() => {
      expect(api.surveysession.list).toHaveBeenCalled();
      expect(api.campus.list).toHaveBeenCalled();
      expect(api.survey.list).toHaveBeenCalled();
      expect(api.observer.list).toHaveBeenCalled();
    });

    expect(
      screen.getByRole("heading", { name: "surveysessionPage.title" }),
    ).toBeInTheDocument();
  });
});
