import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi, beforeEach } from "vitest";
import Stats from "./Stats";
import api from "../../api/user.api";

vi.mock("react-router", () => ({
  useNavigate: () => vi.fn(),
  useParams: () => ({
    question_id: "5",
    survey_id: "77",
    description: "Pregunta A",
    code: "A1",
  }),
}));

vi.mock("../../api/user.api", () => ({
  default: { get: vi.fn() },
}));

vi.mock("./NoDataPlaceholder", () => ({
  default: () => <div data-testid="no-data" />,
}));

vi.mock("../../components/reportpanel/charts/ChartBarMatrixR", () => ({
  default: () => <div data-testid="chart-matrix" />,
}));

vi.mock("../../components/reportpanel/charts/ChartBarUniqueR", () => ({
  default: () => <div data-testid="chart-unique" />,
}));

vi.mock("../../components/reportpanel/charts/ZonaTable", () => ({
  default: ({ setIdZone }) => (
    <button type="button" onClick={() => setIdZone(5)}>
      Cambiar zona
    </button>
  ),
}));

vi.mock("../../components/reportpanel/charts/AggregationPanelNumeric", () => ({
  default: () => <div data-testid="panel-numeric" />,
}));

vi.mock("../../components/reportpanel/charts/AggregationPanelText", () => ({
  default: () => <div data-testid="panel-text" />,
}));

vi.mock("../../components/reportpanel/charts/PiePlot", () => ({
  default: () => <div data-testid="pie" />,
}));

vi.mock("../../components/reportpanel/charts/ChartBarMatrixRText", () => ({
  default: () => <div data-testid="chart-matrix-text" />,
}));

const uniqueData = () => ({
  data_text: [{ description: "Regular", count: 2 }],
  data_numeric: [{ description: "Bueno", count: 4 }],
  visualization_type: "unique",
  aggregate_stats: [
    { description: "Bueno", average: 4, mode_numeric: { description: "4", count: 8 } },
  ],
});

describe("Stats", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("shows a loading indicator while fetching", () => {
    api.get.mockReturnValue(new Promise(() => {}));

    render(<Stats />);

    expect(screen.getByText("Loading your data...")).toBeInTheDocument();
  });

  it("renders NoDataPlaceholder when no mode data exists", async () => {
    api.get.mockResolvedValue({
      data: {
        data_text: [],
        data_numeric: [],
        visualization_type: "unique",
        aggregate_stats: [{ description: "X", average: 3 }],
      },
    });

    render(<Stats />);

    await waitFor(() => {
      expect(screen.getByTestId("no-data")).toBeInTheDocument();
    });
  });

  it("renders the title and unique-response charts when mode data is present", async () => {
    api.get.mockResolvedValue({ data: uniqueData() });

    render(<Stats />);

    await waitFor(() => {
      expect(screen.getAllByTestId("chart-unique").length).toBeGreaterThan(0);
    });

    expect(screen.getByText("A1 Pregunta A")).toBeInTheDocument();
    expect(
      screen.getByRole("heading", { name: "Grafico de Barras de R. Numericas" }),
    ).toBeInTheDocument();
    expect(
      screen.getByRole("heading", { name: "Grafico de Barras de R. Nominales" }),
    ).toBeInTheDocument();
    expect(screen.getByTestId("panel-numeric")).toBeInTheDocument();
    expect(screen.getByTestId("panel-text")).toBeInTheDocument();
  });

  it("renders the matrix branch for stacked bar visualization", async () => {
    api.get.mockResolvedValue({
      data: {
        data_text: [{ name: "Zona A", Bueno: 5 }],
        data_numeric: [],
        visualization_type: "stacked_bar_100_percent",
        aggregate_stats: [
          { description: "A", average: 3, mode_text: { text_value: "Bueno", count: 3 } },
        ],
      },
    });

    render(<Stats />);

    await waitFor(() => {
      expect(
        screen.getByRole("heading", { name: "Grafico de Barras de R. Nominales" }),
      ).toBeInTheDocument();
    });

    expect(screen.getByTestId("chart-matrix-text")).toBeInTheDocument();
    expect(
      screen.queryByRole("heading", { name: "Grafico de Barras de R. Numericas" }),
    ).not.toBeInTheDocument();
  });

  it("re-fetches with zone_id when the selected zone changes", async () => {
    const user = userEvent.setup();
    api.get.mockResolvedValue({ data: uniqueData() });

    render(<Stats />);

    await waitFor(() => {
      expect(screen.getByText("A1 Pregunta A")).toBeInTheDocument();
    });

    await user.click(screen.getByRole("button", { name: "Cambiar zona" }));

    await waitFor(() => {
      expect(
        api.get,
      ).toHaveBeenCalledWith(
        "pocucstats/descriptive_analisis_by_question?question_id=5&zone_id=5&survey_id=77",
      );
    });
  });
});