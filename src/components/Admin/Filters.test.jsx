import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";
import Filters from "./Filters";

vi.mock("react-i18next", () => ({
  useTranslation: () => ({ t: (key) => key }),
}));

describe("Filters", () => {
  it("filters text and date values", async () => {
    const user = userEvent.setup();
    const setFilteredData = vi.fn();

    render(
      <Filters
        criteria={["name", { key: "createdAt", type: "date" }]}
        data={[
          { id: 1, name: "Alpha", createdAt: "2026-08-05" },
          { id: 2, name: "Beta", createdAt: "2026-08-01" },
        ]}
        setFilteredData={setFilteredData}
      />,
    );

    await waitFor(() => {
      expect(setFilteredData).toHaveBeenLastCalledWith([
        { id: 1, name: "Alpha", createdAt: "2026-08-05" },
        { id: 2, name: "Beta", createdAt: "2026-08-01" },
      ]);
    });

    await user.type(screen.getByLabelText("name"), "Al");
    await waitFor(() => {
      expect(setFilteredData).toHaveBeenLastCalledWith([
        { id: 1, name: "Alpha", createdAt: "2026-08-05" },
      ]);
    });
  });
});
