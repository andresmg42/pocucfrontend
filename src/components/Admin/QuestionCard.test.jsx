import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi, beforeEach } from "vitest";
import QuestionCard from "./QuestionCard";

vi.mock("react-i18next", () => ({
  useTranslation: () => ({ t: (key) => key }),
}));

vi.mock("react-dnd", () => ({
  useDrag: () => [{ isDragging: false }, vi.fn()],
  useDrop: () => [null, vi.fn()],
}));

vi.mock("../../services/apiAdmin", () => ({
  default: {
    option: { create: vi.fn() },
  },
}));

vi.mock("./SubQuestionModal", () => ({
  default: () => null,
}));

vi.mock("./QuestionBankModal", () => ({
  default: () => null,
}));

describe("QuestionCard", () => {
  const baseProps = {
    onDeleteSubQuestions: vi.fn(),
    question: {
      id: 1,
      code: "Q1",
      description: "Question 1",
      question_type: "matrix_parent",
      input_type: "NUM",
      options: [{ id: 10, description: "Opt 1" }],
      sub_questions: [{ id: 20, description: "Sub 1" }],
      subcategory: { id: 3, category: 4 },
      survey: [99],
      isNew: false,
      is_required: true,
    },
    globalOptions: [{ id: 10, description: "Opt 1", type: "NUM" }],
    questions: [{ id: 1, code: "Q1", subcategory: { category: 4 } }],
    index: 0,
    totalQuestions: 1,
    onSave: vi.fn(),
    onDelete: vi.fn(),
    onMoveUp: vi.fn(),
    onMoveDown: vi.fn(),
    setRef: vi.fn(),
    refresh: false,
  };

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("renders the question and calls delete/save actions", async () => {
    const user = userEvent.setup();

    render(<QuestionCard {...baseProps} />);

    expect(screen.getByText("Question 1")).toBeInTheDocument();
    await user.click(screen.getByTitle("Edit"));
    await user.click(screen.getByTitle("Delete"));

    expect(baseProps.onDelete).toHaveBeenCalledWith(1);
  });
});
