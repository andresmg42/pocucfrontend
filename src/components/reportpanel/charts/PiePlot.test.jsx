import { render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import PiePlot from "./PiePlot";

vi.mock("recharts", () => ({
  PieChart: ({ children }) => <div data-testid="piechart">{children}</div>,
  Pie: ({ data, dataKey, nameKey, children }) => (
    <div
      data-testid="pie"
      data-length={data.length}
      data-key={dataKey}
      data-namekey={nameKey}
    >
      {children}
    </div>
  ),
  Cell: ({ fill }) => <div data-testid="cell" data-fill={fill} />,
  Tooltip: () => null,
  Legend: () => null,
}));

describe("PiePlot", () => {
  it("renders an empty state when there is no data", () => {
    render(<PiePlot data={[]} />);

    expect(screen.getByText("No hay datos para esta zona")).toBeInTheDocument();
    expect(screen.queryByTestId("piechart")).not.toBeInTheDocument();
  });

  it("renders a pie using average as data key and description as name key", () => {
    const data = [
      { description: "A", average: 3 },
      { description: "B", average: 5 },
    ];

    render(<PiePlot data={data} />);

    expect(screen.getByTestId("pie")).toHaveAttribute("data-length", "2");
    expect(screen.getByTestId("pie")).toHaveAttribute("data-key", "average");
    expect(screen.getByTestId("pie")).toHaveAttribute(
      "data-namekey",
      "description",
    );
  });

  it("applies the provided colors to every cell", () => {
    const data = [
      { description: "A", average: 3 },
      { description: "B", average: 5 },
    ];

    render(<PiePlot data={data} colors={["#ff0000", "#00ff00"]} />);

    const cells = screen.getAllByTestId("cell");
    expect(cells).toHaveLength(2);
    expect(cells[0]).toHaveAttribute("data-fill", "#ff0000");
    expect(cells[1]).toHaveAttribute("data-fill", "#00ff00");
  });
});