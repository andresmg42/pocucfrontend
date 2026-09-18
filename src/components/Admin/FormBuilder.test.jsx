import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi, beforeEach } from "vitest";
import FormBuilder from "./FormBuilder";
import api from "../../services/apiAdmin";

vi.mock("react-i18next", () => ({
  useTranslation: () => ({ t: (key) => key }),
}));

vi.mock("sonner", () => ({
  toast: {
    success: vi.fn(),
    error: vi.fn(),
  },
}));

vi.mock("../../services/apiAdmin", () => ({
  default: {
    question: {
      getBySurvey: vi.fn(),
      reorderQuestions: vi.fn(),
    },
    option: {
      getOptions: vi.fn(),
    },
  },
}));

vi.mock("./QuestionCard", () => ({
  default: ({ question }) => <div>QuestionCard:{question.id}</div>,
}));

vi.mock("./QuestionBankModal", () => ({
  default: ({ onClose }) => <button onClick={onClose}>Mock Bank Modal</button>,
}));

vi.mock("./CategorySubcategoryFilter", () => ({
  default: ({ onCategoryChange, onSubcategoryChange }) => (
    <div>
      <button
        type="button"
        onClick={() => onCategoryChange({ id: 1, name: "Cat" })}
      >
        Pick category
      </button>
      <button
        type="button"
        onClick={() => onSubcategoryChange({ id: 2, name: "Sub", category: 1 })}
      >
        Pick subcategory
      </button>
    </div>
  ),
}));

describe("FormBuilder", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    api.question.getBySurvey.mockResolvedValue({ data: [] });
    api.option.getOptions.mockResolvedValue({ data: [] });
  });

  it("renders the empty state and opens the bank modal", async () => {
    const user = userEvent.setup();

    render(
      <FormBuilder survey={{ id: 9, name: "Survey" }} onClose={vi.fn()} />,
    );

    await waitFor(() => {
      expect(screen.getByText("formBuilder.noQuestions")).toBeInTheDocument();
    });

    await user.click(
      screen.getByRole("button", { name: "formBuilder.addFromBank" }),
    );
    expect(screen.getByText("Mock Bank Modal")).toBeInTheDocument();
  });
});
