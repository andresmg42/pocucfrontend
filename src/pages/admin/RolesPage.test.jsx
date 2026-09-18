import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { useEffect } from "react";
import RolesPage from "./RolesPage";
import api from "../../services/apiAdmin";
import { toast } from "sonner";

vi.mock("../../services/apiAdmin", () => ({
  default: {
    roles: {
      list: vi.fn(),
      create: vi.fn(),
      update: vi.fn(),
      delete: vi.fn(),
    },
  },
}));

vi.mock("react-i18next", () => ({
  useTranslation: () => ({ t: (key) => key }),
}));

vi.mock("sonner", () => ({
  toast: { success: vi.fn(), error: vi.fn() },
}));

vi.mock("../../components/Admin/DataTable", () => ({
  default: ({ data = [], onEdit, onDelete }) => (
    <div data-testid="datatable">
      <span>rows:{data.length}</span>
      <button onClick={() => onEdit(data[0])} disabled={!data.length}>
        edit-row
      </button>
      <button onClick={() => onDelete(data[0])} disabled={!data.length}>
        delete-row
      </button>
    </div>
  ),
}));

vi.mock("../../components/Admin/Filters", () => ({
  default: function FiltersMock({ data, setFilteredData }) {
    useEffect(() => {
      setFilteredData(data);
    }, [data, setFilteredData]);
    return <div data-testid="filters" />;
  },
}));

vi.mock("../../components/Admin/Modal", () => ({
  default: ({ isOpen, children }) =>
    isOpen ? <div data-testid="modal">{children}</div> : null,
}));

const user = {
  id: 1,
  username: "jdoe",
  email: "jdoe@example.com",
  first_name: "John",
  last_name: "Doe",
  is_superuser: true,
  is_staff: true,
  is_active: true,
};

describe("RolesPage", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    api.roles.list.mockResolvedValue({ data: [user] });
    api.roles.create.mockResolvedValue({ data: user });
    api.roles.update.mockResolvedValue({ data: user });
    api.roles.delete.mockResolvedValue({});
  });

  it("loads users and renders the page", async () => {
    render(<RolesPage />);

    await waitFor(() => expect(api.roles.list).toHaveBeenCalledTimes(1));

    expect(
      screen.getByRole("heading", { name: "rolesPage.title" }),
    ).toBeInTheDocument();
    await waitFor(() =>
      expect(screen.getByTestId("datatable")).toHaveTextContent("rows:1"),
    );
  });

  it("shows an error when users cannot be loaded", async () => {
    api.roles.list.mockRejectedValueOnce(new Error("request failed"));
    vi.spyOn(console, "error").mockImplementation(() => {});

    render(<RolesPage />);

    await waitFor(() =>
      expect(toast.error).toHaveBeenCalledWith("rolesPage.loadError"),
    );
    expect(screen.getByText("rolesPage.title")).toBeInTheDocument();
  });

  it("creates a user from the create modal", async () => {
    const currentUser = userEvent.setup();
    render(<RolesPage />);

    await waitFor(() => expect(api.roles.list).toHaveBeenCalled());
    await currentUser.click(
      screen.getByRole("button", { name: /rolesPage.addNew/i }),
    );
    await currentUser.type(
      screen.getAllByRole("textbox")[0],
      "newuser@example.com",
    );
    await currentUser.selectOptions(
      screen.getByRole("combobox"),
      "administrator",
    );
    await currentUser.click(
      screen.getByRole("button", { name: "rolesPage.create" }),
    );

    await waitFor(() =>
      expect(api.roles.create).toHaveBeenCalledWith({
        email: "newuser@example.com",
        first_name: "",
        last_name: "",
        is_superuser: true,
        is_staff: true,
        is_active: true,
      }),
    );
    expect(toast.success).toHaveBeenCalledWith("rolesPage.createSuccess");
  });

  it("rejects a user without an email", async () => {
    render(<RolesPage />);

    await waitFor(() => expect(api.roles.list).toHaveBeenCalled());
    await userEvent
      .setup()
      .click(screen.getByRole("button", { name: /rolesPage.addNew/i }));
    fireEvent.submit(
      screen.getByRole("button", { name: "rolesPage.create" }).closest("form"),
    );

    expect(toast.error).toHaveBeenCalledWith("rolesPage.emailRequired");
    expect(api.roles.create).not.toHaveBeenCalled();
  });

  it("updates a selected user", async () => {
    const currentUser = userEvent.setup();
    render(<RolesPage />);

    await waitFor(() => expect(api.roles.list).toHaveBeenCalled());
    await currentUser.click(screen.getByRole("button", { name: "edit-row" }));

    await currentUser.selectOptions(screen.getByRole("combobox"), "staff");
    await currentUser.click(
      screen.getByRole("button", { name: "rolesPage.update" }),
    );

    await waitFor(() =>
      expect(api.roles.update).toHaveBeenCalledWith(1, {
        email: user.email,
        first_name: user.first_name,
        last_name: user.last_name,
        is_superuser: false,
        is_staff: true,
        is_active: true,
      }),
    );
    expect(toast.success).toHaveBeenCalledWith("rolesPage.updateSuccess");
  });

  it("deletes a user after confirmation", async () => {
    const currentUser = userEvent.setup();
    vi.spyOn(window, "confirm").mockReturnValue(true);
    render(<RolesPage />);

    await waitFor(() => expect(api.roles.list).toHaveBeenCalled());
    await currentUser.click(screen.getByRole("button", { name: "delete-row" }));

    await waitFor(() => expect(api.roles.delete).toHaveBeenCalledWith(1));
    expect(window.confirm).toHaveBeenCalledWith("rolesPage.deleteConfirm");
    expect(toast.success).toHaveBeenCalledWith("rolesPage.deleteSuccess");
  });
});
