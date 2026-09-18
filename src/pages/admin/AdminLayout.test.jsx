import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";
import AdminLayout from "./AdminLayout";

vi.mock("../../components/Admin/Toaster.jsx", () => ({
  default: () => <div data-testid="admin-toaster" />,
}));

vi.mock("./CampusPage.jsx", () => ({
  default: () => <h1>Campus Mock Page</h1>,
}));

vi.mock("./ZonePage.jsx", () => ({
  default: () => <h1>Zone Mock Page</h1>,
}));

vi.mock("./CategoryPage.jsx", () => ({
  default: () => <h1>Category Mock Page</h1>,
}));

vi.mock("./SubcategoryPage.jsx", () => ({
  default: () => <h1>Subcategory Mock Page</h1>,
}));

vi.mock("./OptionPage.jsx", () => ({
  default: () => <h1>Option Mock Page</h1>,
}));

vi.mock("./ObserverPage.jsx", () => ({
  default: () => <h1>Observer Mock Page</h1>,
}));

vi.mock("./SurveyPage.jsx", () => ({
  default: () => <h1>Survey Mock Page</h1>,
}));

vi.mock("./SurveysessionPage.jsx", () => ({
  default: () => <h1>Surveysession Mock Page</h1>,
}));

vi.mock("./VisitPage.jsx", () => ({
  default: () => <h1>Visit Mock Page</h1>,
}));

vi.mock("./ResponsePage.jsx", () => ({
  default: () => <h1>Response Mock Page</h1>,
}));

vi.mock("../../components/Admin/Sidebar.jsx", () => ({
  default: ({ onNavigate }) => (
    <div>
      <button type="button" onClick={() => onNavigate("campus")}>
        Go Campus
      </button>
      <button type="button" onClick={() => onNavigate("zone")}>
        Go Zone
      </button>
    </div>
  ),
}));

describe("AdminLayout", () => {
  it("renders campus page by default and switches page via sidebar", async () => {
    const user = userEvent.setup();
    render(<AdminLayout />);

    expect(
      screen.getByRole("heading", { name: "Campus Mock Page" }),
    ).toBeInTheDocument();
    await user.click(screen.getByRole("button", { name: "Go Zone" }));
    expect(
      screen.getByRole("heading", { name: "Zone Mock Page" }),
    ).toBeInTheDocument();
    expect(screen.getByTestId("admin-toaster")).toBeInTheDocument();
  });
});
