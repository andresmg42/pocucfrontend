import { render, screen, waitFor } from "@testing-library/react";
import { describe, expect, it, vi, beforeEach } from "vitest";
import QuestionsSurvey from "./QuestionsSurvey";
import api from "../../../api/user.api";

vi.mock("react-router", () => ({
  useParams: () => ({ survey_id: "12" }),
}));

vi.mock("react-hot-toast", () => ({
  default: {
    success: vi.fn(),
    error: vi.fn(),
  },
}));

vi.mock("../../../components/admin/survey/Question", () => ({
  default: ({ question }) => <div>{question.description}</div>,
}));

vi.mock("../../../api/user.api", () => ({
  default: {
    get: vi.fn(),
    post: vi.fn(),
    put: vi.fn(),
  },
}));

describe("QuestionsSurvey", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    api.get.mockResolvedValue({
      data: {
        "Category A": {
          "Subcategory A": [
            {
              id: 1,
              code: "Q1",
              question_type: "unique_response",
              description: "Question one",
              parent_question: null,
              survey: [12],
              options: [],
              sub_questions: [],
              is_required: true,
              input_type: "NUM",
              position: 1,
              category: "Category A",
              subcategory: "Subcategory A",
            },
          ],
        },
      },
    });
  });

  it("loads survey questions and renders the panel", async () => {
    render(<QuestionsSurvey />);

    await waitFor(() => {
      expect(api.get).toHaveBeenCalledWith(
        "question/get_questions_by_survey_cpanel?survey_id=12",
      );
    });

    expect(
      screen.getByRole("heading", { name: "Preguntas del formulario" }),
    ).toBeInTheDocument();
    expect(screen.getByText("Question one")).toBeInTheDocument();
  });
});
