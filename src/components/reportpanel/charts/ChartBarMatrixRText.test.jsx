import { render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import ChartBarMatrixRText from "./ChartBarMatrixRText";

vi.mock("recharts", () => ({
  ResponsiveContainer: ({ children }) => <div>{children}</div>,
  BarChart: ({ children }) => <div data-testid="barchart">{children}</div>,
  Bar: ({ dataKey }) => <div data-testid="bar" data-key={dataKey} />,
  XAxis: () => null,
  YAxis: () => null,
  CartesianGrid: () => null,
  Tooltip: () => null,
  Legend: () => null,
}));

describe("ChartBarMatrixRText", () => {
  it("renders nothing when data is empty", () => {
    render(<ChartBarMatrixRText data={[]} />);

    expect(screen.queryByTestId("barchart")).not.toBeInTheDocument();
  });

  it("renders nothing when data is undefined", () => {
    render(<ChartBarMatrixRText />);

    expect(screen.queryByTestId("barchart")).not.toBeInTheDocument();
  });

  it("renders one bar per data key excluding the name key", () => {
    const data = [
      { name: "Zona A", Bueno: 4, Malo: 1 },
      { name: "Zona B", Bueno: 5, Malo: 2 },
    ];

    render(<ChartBarMatrixRText data={data} />);

    expect(screen.getByTestId("barchart")).toBeInTheDocument();
    const bars = screen.getAllByTestId("bar");
    expect(bars).toHaveLength(2);
    const keys = bars.map((bar) => bar.getAttribute("data-key"));
    expect(keys).toEqual(["Bueno", "Malo"]);
  });

  it("cycles the provided colors across bars", () => {
    const data = [
      { name: "Zona A", Bueno: 4 },
      { name: "Zona B", Regular: 2 },
    ];

    render(<ChartBarMatrixRText data={data} colors={["#aa0000", "#00aa00"]} />);

    const bars = screen.getAllByTestId("bar");
    expect(bars[0]).toHaveAttribute("data-key", "Bueno");
    expect(bars[1]).toHaveAttribute("data-key", "Regular");
  });
});