import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi, beforeEach } from "vitest";
import SessionsReport from "./SessionsReport";
import api from "../../api/user.api";

const navigateMock = vi.fn();
const useRowSelectMock = vi.fn((tableData, options) => ({
  tableData,
  options,
}));

vi.mock("react-router", () => ({
  useNavigate: () => navigateMock,
  useParams: () => ({
    observer_id: "9",
    survey_id: "77",
    observer_name: "Observer A",
  }),
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

describe("SessionsReport", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    api.get.mockResolvedValue({
      data: [
        {
          id: 1,
          number_session: 2,
          state: 1,
          campus_name: "Campus",
          zone_name: "Zone",
          zone: 3,
          observational_distance: 10,
          visits_rate: 5,
          start_date: "2026-08-05",
          end_date: null,
          url: "https://example.com",
        },
      ],
    });
  });

  it("loads sessions and navigates on row selection", async () => {
    const user = userEvent.setup();

    render(<SessionsReport />);

    expect(screen.getByText("Spinner")).toBeInTheDocument();

    await waitFor(() => {
      expect(
        screen.getByText(/Reporte de Sesiones para Observer A/i),
      ).toBeInTheDocument();
    });

    await user.click(screen.getByRole("button", { name: "Select first" }));
    expect(navigateMock).toHaveBeenCalledWith("report-panel-visits/1/2");
  });
});
