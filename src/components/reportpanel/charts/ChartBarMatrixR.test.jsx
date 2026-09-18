import { render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import ChartBarMatrixR from "./ChartBarMatrixR";

vi.mock("recharts", () => ({
  ResponsiveContainer: ({ children }) => <div>{children}</div>,
  BarChart: ({ children, data }) => (
    <div data-testid="barchart" data-length={data.length}>
      {children}
    </div>
  ),
  Bar: ({ dataKey, children }) => (
    <div data-testid="bar" data-key={dataKey}>
      {children}
    </div>
  ),
  XAxis: () => null,
  YAxis: () => null,
  CartesianGrid: () => null,
  Tooltip: () => null,
  Legend: () => null,
  Cell: ({ fill }) => <div data-testid="cell" data-fill={fill} />,
}));

describe("ChartBarMatrixR", () => {
  it("renders an empty state when there is no data", () => {
    render(<ChartBarMatrixR data={[]} />);

    expect(screen.getByText("No hay datos para esta zona")).toBeInTheDocument();
    expect(screen.queryByTestId("barchart")).not.toBeInTheDocument();
  });

  it("renders a bar for the average data key when data is present", () => {
    const data = [{ description: "A", average: 5 }];

    render(<ChartBarMatrixR data={data} colors={["#ff0000"]} />);

    expect(screen.getByTestId("barchart")).toHaveAttribute(
      "data-length",
      "1",
    );
    const bars = screen.getAllByTestId("bar");
    expect(bars).toHaveLength(1);
    expect(bars[0]).toHaveAttribute("data-key", "average");
  });

  it("colors each cell from the provided colors cycling by index", () => {
    const data = [
      { description: "A", average: 1 },
      { description: "B", average: 2 },
      { description: "C", average: 3 },
    ];

    render(<ChartBarMatrixR data={data} colors={["#ff0000", "#00ff00"]} />);

    const cells = screen.getAllByTestId("cell");
    expect(cells).toHaveLength(3);
    expect(cells[0]).toHaveAttribute("data-fill", "#ff0000");
    expect(cells[1]).toHaveAttribute("data-fill", "#00ff00");
    expect(cells[2]).toHaveAttribute("data-fill", "#ff0000");
  });
});