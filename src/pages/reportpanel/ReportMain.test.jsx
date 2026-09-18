import { render, screen } from "@testing-library/react";
import { describe, expect, it, vi, beforeEach } from "vitest";
import ReportMain from "./ReportMain";
import useAuthStore from "../../stores/use-auth-store";

const navigateMock = vi.fn();

vi.mock("react-router", () => ({
  useNavigate: () => navigateMock,
}));

vi.mock("../../stores/use-auth-store", () => ({
  default: vi.fn(),
}));

vi.mock("../../components/reportpanel/SurveyReport", () => ({
  default: () => <div data-testid="survey-report" />,
}));

vi.mock("../../components/placeholders/DeniedAccessPlaceholder", () => ({
  default: () => <div data-testid="denied-access" />,
}));

describe("ReportMain", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    useAuthStore.mockReturnValue({ userLogged: null, role: {} });
  });

  it("renders SurveyReport when the user is an admin", () => {
    useAuthStore.mockReturnValue({
      userLogged: {},
      role: { is_admin: true, is_staff: false },
    });

    render(<ReportMain />);

    expect(screen.getByTestId("survey-report")).toBeInTheDocument();
    expect(screen.queryByTestId("denied-access")).not.toBeInTheDocument();
  });

  it("renders SurveyReport when the user is staff", () => {
    useAuthStore.mockReturnValue({
      userLogged: {},
      role: { is_admin: false, is_staff: true },
    });

    render(<ReportMain />);

    expect(screen.getByTestId("survey-report")).toBeInTheDocument();
  });

  it("renders DeniedAccessPlaceholder for non-admin users", () => {
    useAuthStore.mockReturnValue({
      userLogged: {},
      role: { is_admin: false, is_staff: false },
    });

    render(<ReportMain />);

    expect(screen.getByTestId("denied-access")).toBeInTheDocument();
    expect(screen.queryByTestId("survey-report")).not.toBeInTheDocument();
  });
});