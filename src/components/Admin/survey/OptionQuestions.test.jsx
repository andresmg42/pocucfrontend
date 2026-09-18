import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi, beforeEach } from "vitest";
import OptionQuestions from "./OptionQuestions";
import api from "../../../api/user.api";

vi.mock("../../../api/user.api", () => ({
  default: {
    get: vi.fn(),
    post: vi.fn(),
  },
}));

describe("OptionQuestions", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("does not render when closed", () => {
    const { container } = render(<OptionQuestions isOpen={false} />);
    expect(container).toBeEmptyDOMElement();
  });

  it("fetches options, creates a new option, and selects an existing one", async () => {
    const user = userEvent.setup();
    api.get.mockResolvedValue({
      data: [{ id: 1, description: "Option A" }],
    });
    api.post.mockResolvedValue({
      data: { id: 2, description: "Option B" },
    });
    const onClose = vi.fn();
    const onSelectOption = vi.fn();

    render(
      <OptionQuestions
        isOpen
        onClose={onClose}
        onSelectOption={onSelectOption}
      />,
    );

    await waitFor(() => {
      expect(api.get).toHaveBeenCalledWith("options/");
    });

    await user.type(
      screen.getByPlaceholderText("Nueva opcion"),
      "  Option B  ",
    );
    await user.click(screen.getByRole("button", { name: "Crear" }));

    await waitFor(() => {
      expect(api.post).toHaveBeenCalledWith("options/", {
        description: "Option B",
      });
    });
    expect(onSelectOption).toHaveBeenCalledWith({
      id: 2,
      description: "Option B",
    });
    expect(onClose).toHaveBeenCalledTimes(1);
  });

  it("selects an existing option from the list", async () => {
    const user = userEvent.setup();
    api.get.mockResolvedValue({
      data: [{ id: 1, description: "Option A" }],
    });
    const onClose = vi.fn();
    const onSelectOption = vi.fn();

    render(
      <OptionQuestions
        isOpen
        onClose={onClose}
        onSelectOption={onSelectOption}
      />,
    );

    await waitFor(() => {
      expect(
        screen.getByRole("option", { name: "Option A" }),
      ).toBeInTheDocument();
    });

    await user.selectOptions(
      screen.getByRole("combobox"),
      screen.getByRole("option", { name: "Option A" }),
    );
    await user.click(screen.getByRole("button", { name: "Seleccionar" }));

    expect(onSelectOption).toHaveBeenCalledWith({
      id: 1,
      description: "Option A",
    });
    expect(onClose).toHaveBeenCalledTimes(1);
  });
});
