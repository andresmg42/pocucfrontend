import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi, beforeEach } from "vitest";
import Login from "./Login";
import useAuthStore from "../stores/use-auth-store";

const navigateMock = vi.fn();

vi.mock("react-router", () => ({
  useNavigate: () => navigateMock,
}));

vi.mock("../stores/use-auth-store", () => ({
  default: vi.fn(),
}));

vi.mock("../api/user.api", () => ({
  default: {},
}));

describe("Login", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    navigateMock.mockClear();
    useAuthStore.mockReturnValue({
      loginGooglePopUp: vi.fn(),
      userLogged: null,
      isLoading: false,
      token: null,
    });
  });

  it("renders the login heading and the Google button", () => {
    render(<Login />);

    expect(
      screen.getByRole("heading", { name: "Iniciar Sesión" }),
    ).toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: /Iniciar sesión con Google/ }),
    ).toBeInTheDocument();
  });

  it("calls loginGooglePopUp when the Google button is clicked", async () => {
    const user = userEvent.setup();
    const loginGooglePopUp = vi.fn();
    useAuthStore.mockReturnValue({
      loginGooglePopUp,
      userLogged: null,
      isLoading: false,
      token: null,
    });

    render(<Login />);

    await user.click(
      screen.getByRole("button", { name: /Iniciar sesión con Google/ }),
    );

    expect(loginGooglePopUp).toHaveBeenCalledTimes(1);
  });

  it("navigates home when the user is logged in and not loading", async () => {
    useAuthStore.mockReturnValue({
      loginGooglePopUp: vi.fn(),
      userLogged: { displayName: "Test" },
      isLoading: false,
      token: "token",
    });

    render(<Login />);

    await waitFor(() => {
      expect(navigateMock).toHaveBeenCalledWith("/");
    });
  });

  it("does not navigate while loading", () => {
    useAuthStore.mockReturnValue({
      loginGooglePopUp: vi.fn(),
      userLogged: { displayName: "Test" },
      isLoading: true,
      token: "token",
    });

    render(<Login />);

    expect(navigateMock).not.toHaveBeenCalled();
  });

  it("does not navigate when there is no token", () => {
    useAuthStore.mockReturnValue({
      loginGooglePopUp: vi.fn(),
      userLogged: { displayName: "Test" },
      isLoading: false,
      token: null,
    });

    render(<Login />);

    expect(navigateMock).not.toHaveBeenCalled();
  });
});