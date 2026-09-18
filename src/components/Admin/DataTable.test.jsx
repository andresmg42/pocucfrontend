import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";
import DataTable from "./DataTable";

vi.mock("react-i18next", () => ({
  useTranslation: () => ({ t: (key) => key }),
}));

describe("DataTable", () => {
  it("renders empty and populated states and wires actions", async () => {
    const user = userEvent.setup();
    const onEdit = vi.fn();
    const onDelete = vi.fn();
    const onRowClick = vi.fn();

    const { rerender } = render(
      <DataTable
        columns={[{ key: "name", label: "Name" }]}
        data={[]}
        onEdit={onEdit}
        onDelete={onDelete}
        onRowClick={onRowClick}
      />,
    );

    expect(screen.getByText("dataTable.noData")).toBeInTheDocument();

    rerender(
      <DataTable
        columns={[{ key: "name", label: "Name" }]}
        data={[{ id: 1, name: "Row 1" }]}
        onEdit={onEdit}
        onDelete={onDelete}
        onRowClick={onRowClick}
      />,
    );

    await user.click(screen.getByText("Row 1"));
    await user.click(screen.getByTitle("Edit"));
    await user.click(screen.getByTitle("Delete"));

    expect(onRowClick).toHaveBeenCalledWith({ id: 1, name: "Row 1" });
    expect(onEdit).toHaveBeenCalledWith({ id: 1, name: "Row 1" });
    expect(onDelete).toHaveBeenCalledWith({ id: 1, name: "Row 1" });
  });
});
