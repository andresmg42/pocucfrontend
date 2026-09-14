import { useEffect, useState } from "react";
import { Plus } from "lucide-react";
import { toast } from "sonner";
import DataTable from "../../components/Admin/DataTable";
import Filters from "../../components/Admin/Filters";
import Modal from "../../components/Admin/Modal";
import api from "../../services/apiAdmin";
import { useTranslation } from "react-i18next";

const emptyForm = {
  username: "",
  email: "",
  first_name: "",
  last_name: "",
  is_superuser: false,
  is_staff: false,
  is_active: true,
};

const formatDate = (value) => (value ? new Date(value).toLocaleString() : "-");

const RolesPage = () => {
  const { t } = useTranslation();
  const [data, setData] = useState([]);
  const [filteredData, setFilteredData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState(null);
  const [formData, setFormData] = useState(emptyForm);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      setLoading(true);
      const result = await api.roles.list();
      setData(result.data);
    } catch (error) {
      console.error("Error loading users:", error);
      toast.error(t("rolesPage.loadError"));
    } finally {
      setLoading(false);
    }
  };

  const handleCreate = () => {
    setEditingItem(null);
    setFormData({ ...emptyForm });
    setIsModalOpen(true);
  };

  const handleEdit = (item) => {
    setEditingItem(item);
    setFormData({
      username: item.username || "",
      email: item.email || "",
      first_name: item.first_name || "",
      last_name: item.last_name || "",
      is_superuser: Boolean(item.is_superuser),
      is_staff: Boolean(item.is_staff),
      is_active: Boolean(item.is_active),
    });
    setIsModalOpen(true);
  };

  const handleDelete = async (item) => {
    if (window.confirm(t("rolesPage.deleteConfirm", item))) {
      try {
        await api.roles.delete(item.id);
        toast.success(t("rolesPage.deleteSuccess"));
        loadData();
      } catch (error) {
        console.error("Error deleting user:", error);
        toast.error(t("rolesPage.deleteError"));
      }
    }
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    try {
      if (editingItem) {
        await api.roles.update(editingItem.id, formData);
        toast.success(t("rolesPage.updateSuccess"));
      } else {
        await api.roles.create(formData);
        toast.success(t("rolesPage.createSuccess"));
      }
      setIsModalOpen(false);
      loadData();
    } catch (error) {
      console.error("Error saving user:", error);
      toast.error(t("rolesPage.saveError"));
    }
  };

  const updateField = (field) => (event) => {
    const value =
      event.target.type === "checkbox"
        ? event.target.checked
        : event.target.value;
    setFormData((previous) => ({ ...previous, [field]: value }));
  };

  const columns = [
    { key: "id", label: "ID" },
    { key: "username", label: t("rolesPage.username") },
    { key: "email", label: t("rolesPage.email") },
    { key: "first_name", label: t("rolesPage.firstName") },
    { key: "last_name", label: t("rolesPage.lastName") },
    {
      key: "is_superuser",
      label: t("rolesPage.superuser"),
      render: (value) => (value ? t("rolesPage.yes") : t("rolesPage.no")),
    },
    {
      key: "is_staff",
      label: t("rolesPage.staff"),
      render: (value) => (value ? t("rolesPage.yes") : t("rolesPage.no")),
    },
    {
      key: "is_active",
      label: t("rolesPage.active"),
      render: (value) => (value ? t("rolesPage.yes") : t("rolesPage.no")),
    },
    { key: "last_login", label: t("rolesPage.lastLogin"), render: formatDate },
    {
      key: "date_joined",
      label: t("rolesPage.dateJoined"),
      render: formatDate,
    },
  ];

  if (loading) {
    return <div className="p-8 text-center">{t("rolesPage.loading")}</div>;
  }

  return (
    <div className="p-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-gray-900">
          {t("rolesPage.title")}
        </h1>
        <button
          onClick={handleCreate}
          className="flex items-center gap-2 bg-red-700 text-white px-4 py-2 rounded-lg hover:bg-red-800 transition-colors"
        >
          <Plus size={20} />
          {t("rolesPage.addNew")}
        </button>
      </div>

      <Filters
        data={data}
        setFilteredData={setFilteredData}
        criteria={[
          { key: "id", label: "ID" },
          { key: "username", label: t("rolesPage.username") },
          { key: "email", label: t("rolesPage.email") },
          { key: "first_name", label: t("rolesPage.firstName") },
          { key: "last_name", label: t("rolesPage.lastName") },
          { key: "is_superuser", label: t("rolesPage.superuser") },
          { key: "is_staff", label: t("rolesPage.staff") },
          { key: "is_active", label: t("rolesPage.active") },
          {
            key: "last_login",
            label: t("rolesPage.lastLogin"),
            type: "dateRange",
          },
          {
            key: "date_joined",
            label: t("rolesPage.dateJoined"),
            type: "dateRange",
          },
        ]}
      />

      <DataTable
        columns={columns}
        data={filteredData}
        onEdit={handleEdit}
        onDelete={handleDelete}
      />

      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={
          editingItem ? t("rolesPage.editTitle") : t("rolesPage.createTitle")
        }
      >
        <form onSubmit={handleSubmit} className="space-y-4">
          {[
            ["username", t("rolesPage.username"), "text"],
            ["email", t("rolesPage.email"), "email"],
            ["first_name", t("rolesPage.firstName"), "text"],
            ["last_name", t("rolesPage.lastName"), "text"],
          ].map(([field, label, type]) => (
            <div key={field}>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                {label}
              </label>
              <input
                type={type}
                value={formData[field]}
                onChange={updateField(field)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                required={field === "username" || field === "email"}
              />
            </div>
          ))}

          {["is_superuser", "is_staff", "is_active"].map((field) => (
            <label
              key={field}
              className="flex items-center gap-2 text-sm font-medium text-gray-700"
            >
              <input
                type="checkbox"
                checked={formData[field]}
                onChange={updateField(field)}
                className="h-4 w-4 rounded border-gray-300 text-red-700 focus:ring-red-500"
              />
              {field === "is_superuser"
                ? t("rolesPage.superuser")
                : field === "is_staff"
                  ? t("rolesPage.staff")
                  : t("rolesPage.active")}
            </label>
          ))}

          <div className="flex justify-end gap-3 pt-4">
            <button
              type="button"
              onClick={() => setIsModalOpen(false)}
              className="px-4 py-2 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
            >
              {t("rolesPage.cancel")}
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-red-700 text-white rounded-lg hover:bg-red-800 transition-colors"
            >
              {editingItem ? t("rolesPage.update") : t("rolesPage.create")}
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
};

export default RolesPage;
