import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi, beforeEach } from "vitest";
import Question from "./Question";

const optionQuestionsState = vi.hoisted(() => ({
  props: null,
}));

const subQuestionModalState = vi.hoisted(() => ({
  props: null,
}));

vi.mock("./OptionQuestions", () => ({
  default: (props) => {
    optionQuestionsState.props = props;
    return props.isOpen ? <div>OptionQuestionsMock</div> : null;
  },
}));

vi.mock("./SubQuestionModal", () => ({
  default: (props) => {
    subQuestionModalState.props = props;
    return props.isOpen ? <div>SubQuestionModalMock</div> : null;
  },
}));

vi.mock("../../auxiliarcomponents/ConfirmationModal", () => ({
  default: (props) =>
    props.isOpen ? (
      <div>
        <p>{props.title}</p>
        <button type="button" onClick={props.onConfirm}>
          Confirm
        </button>
        <button type="button" onClick={props.onClose}>
          Close
        </button>
      </div>
    ) : null,
}));

describe("Question", () => {
  beforeEach(() => {
    optionQuestionsState.props = null;
    subQuestionModalState.props = null;
  });

  const baseProps = {
    question: {
      id: 10,
      position: 1,
      code: "Q1",
      description: "Main question",
      question_type: "multiple_response",
      input_type: "text",
      is_required: true,
      options: [{ id: 100, description: "Option one" }],
      sub_questions: [{ id: 200, description: "Sub question one" }],
    },
    category: "category-a",
    subcategory: "subcategory-a",
    index: 0,
    inputTypeLabels: { text: "Text input" },
    editingField: null,
    isMoved: false,
    shouldScroll: false,
    startInlineEdit: vi.fn(),
    applyInlineEdit: vi.fn(),
    updateQuestion: vi.fn(),
    handleAddSubQuestion: vi.fn(),
    handleAddOption: vi.fn(),
    handleRemoveOption: vi.fn(),
    handleRemoveSubQuestion: vi.fn(),
    handleUpdateQuestion: vi.fn(),
    handleDeleteQuestion: vi.fn(),
    onMove: vi.fn(),
    isFirst: false,
    isLast: false,
  };

  it("renders question details and wires the main actions", async () => {
    const user = userEvent.setup();

    render(<Question {...baseProps} />);

    expect(screen.getByText("Main question")).toBeInTheDocument();
    expect(screen.getByText("Option one")).toBeInTheDocument();
    expect(screen.getByText("Sub question one")).toBeInTheDocument();

    await user.click(
      screen.getByRole("button", { name: "Actualizar pregunta" }),
    );
    await user.click(screen.getByRole("button", { name: "Eliminar pregunta" }));
    await user.click(screen.getAllByRole("button", { name: "+" })[0]);

    expect(baseProps.handleUpdateQuestion).toHaveBeenCalledWith(
      "category-a",
      "subcategory-a",
      baseProps.question,
    );
    expect(optionQuestionsState.props.isOpen).toBe(true);

    await user.click(screen.getByRole("button", { name: "Confirm" }));
    expect(baseProps.handleDeleteQuestion).toHaveBeenCalledWith(
      "category-a",
      "subcategory-a",
      10,
    );
  });

  it("moves questions, toggles required state, and opens subquestion flow", async () => {
    const user = userEvent.setup();

    render(<Question {...baseProps} />);

    await user.click(screen.getByRole("button", { name: "▲" }));
    await user.click(screen.getByRole("button", { name: "▼" }));
    await user.click(screen.getByRole("button", { name: "Cambiar requerido" }));
    await user.click(screen.getAllByRole("button", { name: "+" })[1]);

    expect(baseProps.onMove).toHaveBeenNthCalledWith(
      1,
      "category-a",
      "subcategory-a",
      0,
      "up",
    );
    expect(baseProps.onMove).toHaveBeenNthCalledWith(
      2,
      "category-a",
      "subcategory-a",
      0,
      "down",
    );
    expect(baseProps.updateQuestion).toHaveBeenCalledWith(
      "category-a",
      "subcategory-a",
      10,
      expect.any(Function),
    );
    expect(subQuestionModalState.props.isOpen).toBe(true);
  });
});
