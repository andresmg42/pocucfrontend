import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import AggregationPanelNumeric from "./AggregationPanelNumeric";

describe("AggregationPanelNumeric", () => {
  it("renders the numeric statistics table header", () => {
    render(<AggregationPanelNumeric data={[]} />);

    expect(
      screen.getByRole("heading", {
        name: "Estadisticas Descriptivas Numericas",
      }),
    ).toBeInTheDocument();
  });

  it("renders a row with formatted statistics for each data item", () => {
    const data = [
      {
        description: "Pregunta 1",
        average: 4.5,
        median: 4,
        std_dev: 0.707,
        minimum: 1,
        maximum: 5,
        count: 10,
        mode_numeric: { description: "5", count: 4 },
        quartiles: { q1: 3, q2: 4, q3: 5, iqr: 2 },
      },
    ];

    render(<AggregationPanelNumeric data={data} />);

    expect(screen.getByText("Pregunta 1")).toBeInTheDocument();
    expect(screen.getByText("4.50")).toBeInTheDocument();
    expect(screen.getByText("4.00")).toBeInTheDocument();
    expect(screen.getByText("0.71")).toBeInTheDocument();
    expect(screen.getByText("1")).toBeInTheDocument();
    expect(screen.getByText("10")).toBeInTheDocument();
    expect(screen.getAllByText("5")).toHaveLength(2);
    expect(screen.getByText("4")).toBeInTheDocument();
    expect(screen.getByText("Q1: 3")).toBeInTheDocument();
    expect(screen.getByText("Q2: 4")).toBeInTheDocument();
    expect(screen.getByText("Q3: 5")).toBeInTheDocument();
    expect(screen.getByText("IQR: 2")).toBeInTheDocument();
  });

  it("renders only the header row when data is empty", () => {
    render(<AggregationPanelNumeric data={[]} />);

    expect(screen.queryAllByRole("row")).toHaveLength(1);
  });
});
