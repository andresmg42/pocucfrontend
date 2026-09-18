import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi, beforeEach } from "vitest";
import Form2 from "./Form2";
import api from "../../api/user.api";
import useAuthStore from "../../stores/use-auth-store";
import toast from "react-hot-toast";
import { deleteCategoryDataFromVisit } from "../../utils/storage_functions";

const navigateMock = vi.fn();

vi.mock("react-router", () => ({
  useNavigate: () => navigateMock,
  useParams: () => ({
    category_id: "10",
    surveysession_id: "20",
    visit_id: "30",
    survey_id: "40",
    category_name: "Infraestructura",
    visit_number: "1",
  }),
}));

vi.mock("../../api/user.api", () => ({
  default: { get: vi.fn(), post: vi.fn() },
}));

vi.mock("react-hot-toast", () => ({
  default: { success: vi.fn(), error: vi.fn() },
}));

vi.mock("../../stores/use-auth-store", () => ({
  default: vi.fn(),
}));

vi.mock("../../utils/storage_functions", () => ({
  getInitialState: () => ({}),
  saveStorageState: vi.fn(),
  deleteCategoryDataFromVisit: vi.fn(),
}));

vi.mock("./UniqueResponseForm", () => ({
  default: () => <div data-testid="unique-form" />,
}));

vi.mock("./MatrixParentForm", () => ({
  default: () => <div data-testid="matrix-form" />,
}));

describe("Form2", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    useAuthStore.mockReturnValue({ token: "token", isLoading: false });
    navigateMock.mockClear();
  });

  it("shows the completed message when the category was already answered", async () => {
    api.get.mockResolvedValue({ data: { is_completed: true } });

    render(<Form2 />);

    await waitFor(() => {
      expect(
        screen.getByText("Questions of Category Infraestructura COMPLETED"),
      ).toBeInTheDocument();
    });

    expect(api.get).toHaveBeenCalledWith(
      "category/category_completed?category_id=10&visit_id=30",
    );
    expect(toast.error).toHaveBeenCalledWith(
      "This section has already been completed.",
    );
    expect(
      screen.queryByRole("button", { name: "Enviar" }),
    ).not.toBeInTheDocument();
  });

  it("submits the empty form and navigates back when there are no questions", async () => {
    const user = userEvent.setup();
    let callCount = 0;
    api.get.mockImplementation(() => {
      callCount += 1;
      if (callCount === 1) {
        return Promise.resolve({ data: { is_completed: false } });
      }
      return Promise.resolve({ data: [] });
    });
    api.post.mockResolvedValue({ status: 201 });

    render(<Form2 />);

    await waitFor(() => {
      expect(
        screen.getByRole("heading", { name: "Formulario de Infraestructura" }),
      ).toBeInTheDocument();
    });

    await user.click(screen.getByRole("button", { name: "Enviar" }));

    await waitFor(() => {
      expect(api.post).toHaveBeenCalledWith("response/create/", {
        answers: {},
        comments: {},
      });
    });
    expect(deleteCategoryDataFromVisit).toHaveBeenCalled();
    expect(toast.success).toHaveBeenCalledWith("Survey saved successfully");
    expect(navigateMock).toHaveBeenCalledWith(-1);
  });

  it("blocks submission and shows an error when required questions are unanswered", async () => {
    const user = userEvent.setup();
    let callCount = 0;
    api.get.mockImplementation(() => {
      callCount += 1;
      if (callCount === 1) {
        return Promise.resolve({ data: { is_completed: false } });
      }
      return Promise.resolve({
        data: [
          {
            id: 1,
            code: "A1",
            question_type: "unique_response",
            is_required: true,
          },
        ],
      });
    });

    render(<Form2 />);

    await waitFor(() => {
      expect(screen.getByTestId("unique-form")).toBeInTheDocument();
    });

    await user.click(screen.getByRole("button", { name: "Enviar" }));

    expect(toast.error).toHaveBeenCalledWith(
      "Debes Completar todas las respuestas obligatorias",
    );
    expect(api.post).not.toHaveBeenCalled();
    expect(navigateMock).not.toHaveBeenCalled();
  });

  it("does not fetch anything when there is no token", () => {
    useAuthStore.mockReturnValue({ token: null, isLoading: false });

    render(<Form2 />);

    expect(api.get).not.toHaveBeenCalled();
  });
});