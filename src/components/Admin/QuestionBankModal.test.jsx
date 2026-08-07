import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi, beforeEach } from "vitest";
import QuestionBankModal from "./QuestionBankModal";
import api from "../../services/apiAdmin";

vi.mock("react-i18next", () => ({
  useTranslation: () => ({ t: (key) => key }),
}));

vi.mock("../../services/apiAdmin", () => ({
  default: {
    question: { getBank: vi.fn() },
    category: { list: vi.fn() },
    subcategory: { list: vi.fn() },
  },
}));

describe("QuestionBankModal", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    api.question.getBank.mockResolvedValue({
      data: [
        {
          id: 1,
          code: "Q1",
          description: "Question one",
          subcategory: { id: 10, name: "Sub A" },
          question_type: "unique_response",
          survey: [],
        },
      ],
    });
    api.category.list.mockResolvedValue({ data: [{ id: 1, name: "Cat A" }] });
    api.subcategory.list.mockResolvedValue({
      data: [{ id: 10, name: "Sub A", category: 1 }],
    });
  });

  it("renders, filters, and adds selected questions", async () => {
    const user = userEvent.setup();
    const onAddQuestions = vi.fn();

    render(
      <QuestionBankModal
        onClose={vi.fn()}
        onAddQuestions={onAddQuestions}
        surveyId={99}
      />,
    );

    await waitFor(() => {
      expect(screen.getByText("Question one")).toBeInTheDocument();
    });

    await user.click(screen.getByText("Question one"));
    await user.click(
      screen.getByRole("button", { name: "questionBankModal.addSelected" }),
    );

    expect(onAddQuestions).toHaveBeenCalledWith([
      expect.objectContaining({ id: 1, description: "Question one" }),
    ]);
  });
});
