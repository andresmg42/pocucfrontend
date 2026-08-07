import { render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import ChartBarUniqueR from "./ChartBarUniqueR";

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

describe("ChartBarUniqueR", () => {
  it("renders an empty state when there is no data", () => {
    render(<ChartBarUniqueR data={[]} />);

    expect(screen.getByText("No data to display")).toBeInTheDocument();
    expect(screen.queryByTestId("barchart")).not.toBeInTheDocument();
  });

  it("renders a bar for the count data key with one cell per data item", () => {
    const data = [
      { description: "A", count: 3 },
      { description: "B", count: 5 },
    ];

render(<ChartBarUniqueR data={data} />);

    expect(screen.getByTestId("barchart")).toHaveAttribute("data-length", "2");
    const bars = screen.getAllByTestId("bar");
    expect(bars).toHaveLength(1);
    expect(bars[0]).toHaveAttribute("data-key", "count");

    expect(screen.getAllByTestId("cell")).toHaveLength(2);
  });

  it("generates an hsl fill for every cell", () => {
    const data = [
      { description: "A", count: 3 },
      { description: "B", count: 5 },
    ];

    render(<ChartBarUniqueR data={data} />);

    expect(screen.getAllByTestId("cell").length).toBe(2);
    screen.getAllByTestId("cell").forEach((cell) => {
      expect(cell.getAttribute("data-fill")).toMatch(/^hsl\(/);
    });
  });
});