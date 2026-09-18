import { render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import ProtectedRoute from "./ProtectedRoute";

vi.mock("react-router", () => ({
  Navigate: ({ to }) => <div>Navigate:{to}</div>,
  Outlet: () => <div>Outlet</div>,
  useLocation: () => ({ pathname: "/protected" }),
}));

vi.mock("../../stores/use-auth-store", () => ({
  default: vi.fn(),
}));

vi.mock("../placeholders/DeniedAccessPlaceholder", () => ({
  default: () => <div>Denied access</div>,
}));

import useAuthStore from "../../stores/use-auth-store";

describe("ProtectedRoute", () => {
  it("shows loading while the auth store is loading", () => {
    useAuthStore.mockReturnValue({ isLoading: true });

    render(<ProtectedRoute />);

    expect(screen.getByText("Loading...")).toBeInTheDocument();
  });

  it("renders the outlet for admin users and denied access otherwise", () => {
    useAuthStore.mockReturnValue({
      isLoading: false,
      role: { is_admin: true },
    });

    const { rerender } = render(<ProtectedRoute />);
    expect(screen.getByText("Outlet")).toBeInTheDocument();

    useAuthStore.mockReturnValue({
      isLoading: false,
      role: { is_admin: false, is_staff: false },
    });
    rerender(<ProtectedRoute />);
    expect(screen.getByText("Denied access")).toBeInTheDocument();
  });
});
