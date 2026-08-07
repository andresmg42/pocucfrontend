import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { fireEvent } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import UniqueResponseForm from "./UniqueResponseForm";

const baseProps = (overrides = {}) => ({
  q: {
    id: 5,
    code: "A1",
    description: "Como te sientes?",
    is_required: true,
    input_type: "NUM",
    options: [
      { id: 1, description: "1" },
      { id: 2, description: "2" },
    ],
  },
  comments: {},
  answers: {},
  handleRadioChange: vi.fn(),
  handleOtherTextChange: vi.fn(),
  handleOtherNumericChange: vi.fn(),
  setCommentTrigger: vi.fn(),
  handleCommentChange: vi.fn(),
  commentTrigger: {},
  openTextFields: {},
  ...overrides,
});

describe("UniqueResponseForm", () => {
  it("renders the question code, description and its options", () => {
    render(<UniqueResponseForm {...baseProps()} />);

    expect(screen.getByText("A1. Como te sientes?")).toBeInTheDocument();
    expect(screen.getByRole("radio", { name: "1" })).toBeInTheDocument();
    expect(screen.getByRole("radio", { name: "2" })).toBeInTheDocument();
    expect(screen.getByRole("radio", { name: "Más" })).toBeInTheDocument();
  });

  it("calls handleRadioChange when a normal option is selected", async () => {
    const user = userEvent.setup();
    const handleRadioChange = vi.fn();
    render(<UniqueResponseForm {...baseProps({ handleRadioChange })} />);

    await user.click(screen.getByRole("radio", { name: "2" }));

    expect(handleRadioChange).toHaveBeenCalledWith(5, "2", 2);
  });

  it("marks the option as checked when it matches the stored answer", () => {
    const answers = { 5: { numeric_value: "2" } };
    render(<UniqueResponseForm {...baseProps({ answers })} />);

    expect(screen.getByRole("radio", { name: "2" })).toBeChecked();
  });

  it("shows a text input for STR other answers and forwards changes", () => {
    const handleOtherTextChange = vi.fn();
    const props = baseProps({
      q: { ...baseProps().q, input_type: "STR" },
      handleOtherTextChange,
      openTextFields: { 5: true },
    });

    render(<UniqueResponseForm {...props} />);

    const textInput = screen.getByPlaceholderText("Especifique su respuesta");
    fireEvent.change(textInput, { target: { value: "Bueno" } });

    expect(handleOtherTextChange).toHaveBeenCalledWith(5, "Bueno");
  });

  it("calls handleRadioChange with other when the Mas option is selected", async () => {
    const user = userEvent.setup();
    const handleRadioChange = vi.fn();
    render(<UniqueResponseForm {...baseProps({ handleRadioChange })} />);

    await user.click(screen.getByRole("radio", { name: "Más" }));

    expect(handleRadioChange).toHaveBeenCalledWith(5, "other", "");
  });

  it("increments the numeric other value with the plus button", async () => {
    const user = userEvent.setup();
    const handleOtherNumericChange = vi.fn();
    const props = baseProps({
      answers: { 5: { numeric_value: "3" } },
      handleOtherNumericChange,
    });

    render(<UniqueResponseForm {...props} />);

    await user.click(screen.getByRole("radio", { name: "Más" }));
    await user.click(screen.getByRole("button", { name: "+" }));

    expect(handleOtherNumericChange).toHaveBeenCalledWith(5, "4");
  });

  it("toggles the comment trigger when Otra observacion is clicked", async () => {
    const user = userEvent.setup();
    const setCommentTrigger = vi.fn();
    render(<UniqueResponseForm {...baseProps({ setCommentTrigger })} />);

    await user.click(screen.getByText("Otra observación"));

    const updater = setCommentTrigger.mock.calls[0][0];
    expect(updater({ 5: false })).toEqual({ 5: true });
  });

  it("renders the comment textarea and forwards comment changes", async () => {
    const user = userEvent.setup();
    const handleCommentChange = vi.fn();
    const props = baseProps({
      commentTrigger: { 5: true },
      handleCommentChange,
    });

    render(<UniqueResponseForm {...props} />);

    const textarea = screen.getByPlaceholderText("Escriba otra observación");
    await user.type(textarea, "mi comentario");

    expect(handleCommentChange).toHaveBeenCalledWith(5, "mi comentario");
  });
});