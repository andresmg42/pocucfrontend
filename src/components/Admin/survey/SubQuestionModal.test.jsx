import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi, beforeEach } from "vitest";
import SubQuestionModal from "./SubQuestionModal";

describe("SubQuestionModal", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("does not render when closed", () => {
    const { container } = render(<SubQuestionModal isOpen={false} />);
    expect(container).toBeEmptyDOMElement();
  });

  it("creates a subquestion with the expected payload", async () => {
    const user = userEvent.setup();
    const onClose = vi.fn();
    const onCreate = vi.fn().mockResolvedValue(true);

    render(<SubQuestionModal isOpen onClose={onClose} onCreate={onCreate} />);

    await user.type(
      screen.getByPlaceholderText("Descripcion de la subpregunta"),
      "  Sub pregunta nueva  ",
    );
    await user.type(screen.getByPlaceholderText("Codigo"), "  S1  ");
    await user.click(screen.getByRole("button", { name: "Crear" }));

    await waitFor(() => {
      expect(onCreate).toHaveBeenCalledWith({
        description: "Sub pregunta nueva",
        code: "S1",
        question_type: "matrix_child",
      });
    });
    expect(onClose).toHaveBeenCalledTimes(1);
  });

  it("ignores empty descriptions", async () => {
    const user = userEvent.setup();
    const onClose = vi.fn();
    const onCreate = vi.fn();

    render(<SubQuestionModal isOpen onClose={onClose} onCreate={onCreate} />);

    await user.click(screen.getByRole("button", { name: "Crear" }));

    expect(onCreate).not.toHaveBeenCalled();
    expect(onClose).not.toHaveBeenCalled();
  });
});
