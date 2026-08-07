import { render, screen, waitFor } from "@testing-library/react";
import { describe, expect, it, vi, beforeEach } from "vitest";
import SurveyPage from "./SurveyPage";
import api from "../../services/apiAdmin";

vi.mock("../../services/apiAdmin", () => ({
  default: {
    survey: {
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
  default: () => <div data-testid="datatable" />,
}));

vi.mock("../../components/Admin/Filters", () => ({
  default: () => <div data-testid="filters" />,
}));

vi.mock("../../components/Admin/Modal", () => ({
  default: () => null,
}));

vi.mock("../../components/Admin/FormBuilder", () => ({
  default: () => <div data-testid="formbuilder" />,
}));

describe("SurveyPage", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    api.survey.list.mockResolvedValue({ data: [] });
  });

  it("loads surveys and renders title", async () => {
    render(<SurveyPage />);

    await waitFor(() => expect(api.survey.list).toHaveBeenCalled());
    expect(
      screen.getByRole("heading", { name: "surveyPage.title" }),
    ).toBeInTheDocument();
  });
});
