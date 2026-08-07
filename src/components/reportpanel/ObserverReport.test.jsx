import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi, beforeEach } from "vitest";
import ObserverReport from "./ObserverReport";
import api from "../../api/user.api";

const navigateMock = vi.fn();
const useRowSelectMock = vi.fn((tableData, options) => ({
  tableData,
  options,
}));

vi.mock("react-router", () => ({
  useNavigate: () => navigateMock,
  useParams: () => ({ survey_id: "77", survey_name: "Survey A" }),
}));

vi.mock("../../api/user.api", () => ({
  default: { get: vi.fn() },
}));

vi.mock("@table-library/react-table-library/compact", () => ({
  CompactTable: ({ columns, data, select }) => (
    <div>
      <div data-testid="rows">{data.nodes.length}</div>
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

describe("ObserverReport", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    api.get.mockResolvedValue({
      data: {
        data: [
          {
            id: 1,
            name: "Observer 1",
            email: "o@example.com",
            sessions: 3,
            completed_rate: 80,
            register_date: "2026-08-05",
          },
        ],
      },
    });
  });

  it("loads the observers table and navigates on row selection", async () => {
    const user = userEvent.setup();

    render(<ObserverReport />);

    expect(screen.getByText("Spinner")).toBeInTheDocument();

    await waitFor(() => {
      expect(
        screen.getByText(/Reporte de Observadores para formulario Survey A/i),
      ).toBeInTheDocument();
    });

    await user.click(screen.getByRole("button", { name: "Select first" }));
    expect(navigateMock).toHaveBeenCalledWith(
      "report-panel-sessions/1/Observer 1",
    );
  });
});
