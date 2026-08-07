import { render, screen, waitFor } from "@testing-library/react";
import { describe, expect, it, vi, beforeEach } from "vitest";
import VisitReport from "./VisitReport";
import api from "../../api/user.api";

const navigateMock = vi.fn();

vi.mock("react-router", () => ({
  useNavigate: () => navigateMock,
  useParams: () => ({ session_id: "55", session_number: "4" }),
}));

vi.mock("../../api/user.api", () => ({
  default: { get: vi.fn() },
}));

vi.mock("@table-library/react-table-library/compact", () => ({
  CompactTable: ({ columns, data }) => (
    <div data-testid="table">
      {columns.map((column) => (
        <span key={column.label}>{column.renderCell(data.nodes[0])}</span>
      ))}
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
  useRowSelect: vi.fn(() => ({})),
}));

vi.mock("./Spinner", () => ({ default: () => <div>Spinner</div> }));

describe("VisitReport", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    api.get.mockResolvedValue({
      data: [
        {
          id: 1,
          visit_number: 1,
          state: 2,
          visit_start_date_time: "2026-08-05T10:00:00Z",
          visit_end_date_time: null,
        },
      ],
    });
  });

  it("loads visits and renders the table", async () => {
    render(<VisitReport />);

    expect(screen.getByText("Spinner")).toBeInTheDocument();

    await waitFor(() => {
      expect(
        screen.getByText(/Reporte de visitas para la sesión numero 4/i),
      ).toBeInTheDocument();
    });

    expect(screen.getByTestId("table")).toBeInTheDocument();
    expect(screen.getByText("Completa")).toBeInTheDocument();
  });
});
