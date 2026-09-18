import { render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import Modal from "./Modal";

describe("Modal", () => {
  it("does not render when closed", () => {
    const { container } = render(
      <Modal isOpen={false} onClose={vi.fn()} title="Title">
        Body
      </Modal>,
    );
    expect(container).toBeEmptyDOMElement();
  });

  it("renders content and closes on button click", async () => {
    const onClose = vi.fn();

    render(
      <Modal isOpen onClose={onClose} title="Title">
        Body
      </Modal>,
    );

    expect(screen.getByText("Title")).toBeInTheDocument();
    expect(screen.getByText("Body")).toBeInTheDocument();
  });
});
