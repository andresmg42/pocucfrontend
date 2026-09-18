import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi, beforeEach } from "vitest";
import QuestionPanel from "./QuestionPanel";
import api from "../../api/user.api";

const navigateMock = vi.fn();

vi.mock("react-router", () => ({
  useNavigate: () => navigateMock,
  useParams: () => ({ survey_id: "77", survey_name: "Survey A" }),
}));

vi.mock("../../api/user.api", () => ({
  default: { get: vi.fn() },
}));

vi.mock("@table-library/react-table-library/compact", () => ({
  CompactTable: ({ columns, data, select }) => {
    const node = data.nodes[0];
    return (
      <div>
        <div data-testid="rows">{data.nodes.length}</div>
        <button
          type="button"
          onClick={() => select?.options?.onChange?.(null, { id: node?.id })}
        >
          Select first
        </button>
        <div data-testid="first-row">
          {node ? (
            columns.map((column) => (
              <span key={column.label}>{column.renderCell(node)}</span>
            ))
          ) : null}
        </div>
      </div>
    );
  },
}));

vi.mock("@table-library/react-table-library/theme", () => ({
  useTheme: () => ({}),
}));

vi.mock("@table-library/react-table-library/baseline", () => ({
  getTheme: () => ({}),
}));

vi.mock("@table-library/react-table-library/select", () => ({
  useRowSelect: vi.fn((tableData, options) => ({ tableData, options })),
}));

describe("QuestionPanel", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    api.get.mockResolvedValue({
      data: [{ id: 1, code: "A1", description: "Pregunta uno", subcategory: { name: "Mobiliario" } }],
    });
  });

  it("renders the heading with the survey name", async () => {
    render(<QuestionPanel />);

    await waitFor(() => {
      expect(
        screen.getByRole("heading", {
          name: "Preguntas para formulario Survey A",
        }),
      ).toBeInTheDocument();
    });
  });

  it("fetches questions for the survey id", async () => {
    render(<QuestionPanel />);

    await waitFor(() => {
      expect(api.get).toHaveBeenCalledWith(
        "question/get_questions_by_survey?survey_id=77",
      );
    });
  });

  it("navigates to the stats route when a question row is selected", async () => {
    const user = userEvent.setup();
    render(<QuestionPanel />);

    await waitFor(() => {
      expect(screen.getByText("Pregunta uno")).toBeInTheDocument();
    });

    await user.click(screen.getByRole("button", { name: "Select first" }));
    expect(navigateMock).toHaveBeenCalledWith(
      `stats/1/${encodeURIComponent("Pregunta uno")}/A1`,
    );
  });
});