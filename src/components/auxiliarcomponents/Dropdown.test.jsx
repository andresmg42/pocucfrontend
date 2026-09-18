import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";
import Dropdown from "./Dropdown";

describe("Dropdown", () => {
  it("opens and selects an option", async () => {
    const user = userEvent.setup();
    const onSelect = vi.fn();

    render(
      <Dropdown
        placeholder="Choose"
        options={[
          { value: "es", label: "Spanish" },
          { value: "en", label: "English" },
        ]}
        onSelect={onSelect}
      />,
    );

    expect(screen.getByText("Choose")).toBeInTheDocument();

    await user.click(screen.getByRole("button", { name: /Choose/i }));
    await user.click(screen.getByRole("button", { name: "English" }));

    expect(onSelect).toHaveBeenCalledWith({ value: "en", label: "English" });
    expect(screen.getByText("English")).toBeInTheDocument();
  });

  it("closes when clicking outside", async () => {
    const user = userEvent.setup();

    render(
      <div>
        <Dropdown
          placeholder="Choose"
          options={[{ value: "es", label: "Spanish" }]}
          onSelect={vi.fn()}
        />
        <button type="button">Outside</button>
      </div>,
    );

    await user.click(screen.getByRole("button", { name: /Choose/i }));
    expect(screen.getByRole("button", { name: "Spanish" })).toBeInTheDocument();

    await user.click(screen.getByRole("button", { name: "Outside" }));
    expect(
      screen.queryByRole("button", { name: "Spanish" }),
    ).not.toBeInTheDocument();
  });
});
