import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi, beforeEach } from "vitest";
import SurveyReport from "./SurveyReport";
import api from "../../api/user.api";

const navigateMock = vi.fn();
const useRowSelectMock = vi.fn((tableData, options) => ({
  tableData,
  options,
}));

vi.mock("react-router", () => ({
  useNavigate: () => navigateMock,
}));

vi.mock("../../api/user.api", () => ({
  default: { get: vi.fn() },
}));

vi.mock("@table-library/react-table-library/compact", () => ({
  CompactTable: ({ columns, data, select }) => (
    <div>
      <button
        type="button"
        onClick={() =>
          select?.options?.onChange?.(null, { id: data.nodes[0]?.id })
        }
      >
        Select first
      </button>
      <div data-testid="first-row">
        {columns.map((column) => (
          <span key={column.label}>{column.renderCell(data.nodes[0])}</span>
        ))}
      </div>
    </div>
  ),
}));

vi.mock("@table-library/react-table-library/theme", () => ({
  useTheme: () => ({}),
}));

vi.mock("@table-library/react-table-library/baseline", () => ({
  getTheme: () => ({}),
}));

vi.mock("@table-library/react-table-library/select", () => ({
  useRowSelect: vi.fn((tableData, options) => ({
    tableData,
    options,
  })),
}));

vi.mock("./Spinner", () => ({ default: () => <div>Spinner</div> }));

describe("SurveyReport", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    api.get.mockResolvedValue({
      data: [
        {
          id: 1,
          name: "Survey A",
          topic: "Topic",
          description: "Desc",
          uploaded_at: "2026-08-05",
        },
      ],
    });
  });

  it("loads surveys and navigates to the question stats panel", async () => {
    const user = userEvent.setup();

    render(<SurveyReport />);

    expect(screen.getByText("Spinner")).toBeInTheDocument();

    await waitFor(() => {
      expect(screen.getByText("Reporte de Formularios")).toBeInTheDocument();
    });

    await user.click(
      screen.getByRole("button", { name: "Estadisticas Survey A" }),
    );
    expect(navigateMock).toHaveBeenCalledWith("/questions-panel/1/Survey A");
  });
});
