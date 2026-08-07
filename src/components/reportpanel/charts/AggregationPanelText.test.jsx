import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import AggregationPanelText from "./AggregationPanelText";

describe("AggregationPanelText", () => {
  it("renders the nominal statistics table header", () => {
    render(<AggregationPanelText data={[]} />);

    expect(
      screen.getByRole("heading", {
        name: "Estadisticas Descriptivas Nominales",
      }),
    ).toBeInTheDocument();
  });

  it("renders a row with text statistics for each data item", () => {
    const data = [
      {
        description: "Pregunta 1",
        count_text: 8,
        mode_text: { text_value: "Bueno", count: 5 },
      },
    ];

    render(<AggregationPanelText data={data} />);

    expect(screen.getByText("Pregunta 1")).toBeInTheDocument();
    expect(screen.getByText("8")).toBeInTheDocument();
    expect(screen.getByText("Bueno")).toBeInTheDocument();
    expect(screen.getByText("5")).toBeInTheDocument();
  });

  it("renders only the header row when data is empty", () => {
    render(<AggregationPanelText data={[]} />);

    expect(screen.queryAllByRole("row")).toHaveLength(1);
  });
});
