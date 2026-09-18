import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi, beforeEach } from "vitest";
import ZonaTable from "./ZonaTable";
import api from "../../../api/user.api";

vi.mock("../../../api/user.api", () => ({
  default: { get: vi.fn() },
}));

describe("ZonaTable", () => {
  const setIdZone = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
    api.get.mockResolvedValue({
      data: [
        { id: 1, name: "Biblioteca Central", number: 1 },
        { id: 2, name: "Plaza Central", number: 2 },
      ],
    });
  });

  it("fetches and renders the zones table", async () => {
    render(<ZonaTable setIdZone={setIdZone} />);

    expect(
      screen.getByRole("heading", { name: "Zonas" }),
    ).toBeInTheDocument();

    await waitFor(() => {
      expect(screen.getByText("Biblioteca Central")).toBeInTheDocument();
    });

    expect(screen.getByText("Plaza Central")).toBeInTheDocument();
    expect(api.get).toHaveBeenCalledWith("zone/");
  });

  it("always renders the General row", async () => {
    render(<ZonaTable setIdZone={setIdZone} />);

    await waitFor(() => {
      expect(screen.getByText("Biblioteca Central")).toBeInTheDocument();
    });

    expect(screen.getByText("General")).toBeInTheDocument();
  });

  it("calls setIdZone with the zone id when a row is clicked", async () => {
    const user = userEvent.setup();
    render(<ZonaTable setIdZone={setIdZone} />);

    await waitFor(() => {
      expect(screen.getByText("Biblioteca Central")).toBeInTheDocument();
    });

    await user.click(screen.getByText("Biblioteca Central"));
    expect(setIdZone).toHaveBeenCalledWith(1);
  });

  it("calls setIdZone with 0 when the General row is clicked", async () => {
    const user = userEvent.setup();
    render(<ZonaTable setIdZone={setIdZone} />);

    await waitFor(() => {
      expect(screen.getByText("General")).toBeInTheDocument();
    });

    await user.click(screen.getByText("General"));
    expect(setIdZone).toHaveBeenCalledWith(0);
  });
});