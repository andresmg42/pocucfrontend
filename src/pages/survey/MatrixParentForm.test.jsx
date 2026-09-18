import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { fireEvent } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import MatrixParentForm from "./MatrixParentForm";

const baseProps = (overrides = {}) => ({
  q: {
    id: 9,
    code: "B2",
    description: "Matriz de calidad",
    is_required: true,
    input_type: "NUM",
    options: [
      { id: 1, description: "1" },
      { id: 2, description: "2" },
    ],
    sub_questions: [
      { id: 11, description: "Sub pregunta uno", is_required: true },
      { id: 12, description: "Sub pregunta dos", is_required: false },
    ],
  },
  comments: {},
  commentTrigger: {},
  answers: {},
  handleRadioChange: vi.fn(),
  handleOtherTextChange: vi.fn(),
  handleOtherNumericChange: vi.fn(),
  setCommentTrigger: vi.fn(),
  handleCommentChange: vi.fn(),
  openTextFields: {},
  ...overrides,
});

describe("MatrixParentForm", () => {
  it("renders the parent question and each sub question description", () => {
    render(<MatrixParentForm {...baseProps()} />);

    expect(screen.getByText("B2. Matriz de calidad")).toBeInTheDocument();
    expect(screen.getByText("Sub pregunta uno")).toBeInTheDocument();
    expect(screen.getByText("Sub pregunta dos")).toBeInTheDocument();
  });

  it("calls handleRadioChange with the sub question id when an option is selected", async () => {
    const user = userEvent.setup();
    const handleRadioChange = vi.fn();
    render(<MatrixParentForm {...baseProps({ handleRadioChange })} />);

    await user.click(screen.getAllByRole("radio", { name: "2" })[0]);

    expect(handleRadioChange).toHaveBeenCalledWith(11, "2", 2);
  });

  it("marks the sub-question option as checked from the stored answer", () => {
    const answers = { 11: { numeric_value: "1" } };
    render(<MatrixParentForm {...baseProps({ answers })} />);

    expect(screen.getAllByRole("radio", { name: "1" })[0]).toBeChecked();
  });

  it("shows a text input for STR other answers and forwards changes", () => {
    const handleOtherTextChange = vi.fn();
    const props = baseProps({
      q: { ...baseProps().q, input_type: "STR" },
      handleOtherTextChange,
      openTextFields: { 11: true },
    });

    render(<MatrixParentForm {...props} />);

    const textInput = screen.getByPlaceholderText("Especifique su respuesta");
    fireEvent.change(textInput, { target: { value: "Bueno" } });

    expect(handleOtherTextChange).toHaveBeenCalledWith(11, "Bueno");
  });

  it("calls handleRadioChange with other when the Mas option is selected", async () => {
    const user = userEvent.setup();
    const handleRadioChange = vi.fn();
    render(<MatrixParentForm {...baseProps({ handleRadioChange })} />);

    await user.click(screen.getAllByRole("radio", { name: "Más" })[0]);

    expect(handleRadioChange).toHaveBeenCalledWith(11, "other", "");
  });

  it("increments the numeric other value with the plus button", async () => {
    const user = userEvent.setup();
    const handleOtherNumericChange = vi.fn();
    const props = baseProps({
      answers: { 11: { numeric_value: "3" } },
      handleOtherNumericChange,
    });

    render(<MatrixParentForm {...props} />);

    await user.click(screen.getAllByRole("radio", { name: "Más" })[0]);
    await user.click(screen.getAllByRole("button", { name: "+" })[0]);

    expect(handleOtherNumericChange).toHaveBeenCalledWith(11, "4");
  });

  it("renders the comment textarea and forwards comment changes", async () => {
    const user = userEvent.setup();
    const handleCommentChange = vi.fn();
    const props = baseProps({
      commentTrigger: { 9: true },
      handleCommentChange,
    });

    render(<MatrixParentForm {...props} />);

    const textarea = screen.getByPlaceholderText("Escriba otra observación");
    await user.type(textarea, "mi comentario");

    expect(handleCommentChange).toHaveBeenCalledWith(9, "mi comentario");
  });
});