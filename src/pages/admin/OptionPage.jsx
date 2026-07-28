import { useState, useEffect } from "react";
import { Plus } from "lucide-react";
import { toast } from "sonner";
import DataTable from "../../components/Admin/DataTable";
import Modal from "../../components/Admin/Modal";
import api from "../../services/apiAdmin";
import Filters from "../../components/Admin/Filters";
import { useTranslation } from "react-i18next";

export default function OptionPage() {
  const { t } = useTranslation();
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState(null);
  const [formData, setFormData] = useState({ description: "", type: "NUM" });
  const [filteredData, setFilteredData] = useState([]);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      setLoading(true);
      const result = await api.option.list();
      setData(result.data);
      console.log("data:", result.data);
    } catch (error) {
      console.error("Error loading data:", error);
      toast.error("Error loading options");
    } finally {
      setLoading(false);
    }
  };

  const handleCreate = () => {
    setEditingItem(null);
    setFormData({ description: "" });
    setIsModalOpen(true);
  };

  const handleEdit = (item) => {
    setEditingItem(item);
    setFormData({ description: item.description, type: item.type });
    setIsModalOpen(true);
  };

  const handleDelete = async (item) => {
    if (
      window.confirm(`Are you sure you want to delete "${item.description}"?`)
    ) {
      try {
        await api.option.delete(item.id);
        toast.success("Option deleted successfully");
        loadData();
      } catch (error) {
        console.error("Error deleting:", error);
        toast.error("Error deleting option");
      }
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingItem) {
        await api.option.update(editingItem.id, formData);
        toast.success("Option updated successfully");
      } else {
        await api.option.create(formData);
        toast.success("Option created successfully");
      }
      setIsModalOpen(false);
      loadData();
    } catch (error) {
      console.error("Error saving:", error);
      toast.error("Error saving option");
    }
  };

  const columns = [
    { key: "id", label: "ID" },
    { key: "type", label: t("optionPage.type") },
    { key: "description", label: t("optionPage.description") },
  ];

  if (loading) {
    return <div className="p-8 text-center">Loading...</div>;
  }

  return (
    <div className="p-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-gray-900">
          {t("optionPage.title")}
        </h1>
        <button
          onClick={handleCreate}
          className="flex items-center gap-2 bg-red-700 text-white px-4 py-2 rounded-lg hover:bg-red-800 transition-colors"
        >
          <Plus size={20} />
          {t("addNewButton")}
        </button>
      </div>

      <Filters
        data={data}
        setFilteredData={setFilteredData}
        criteria={[
          { key: "description", label: t("optionPage.description") },
          { key: "type", label: t("optionPage.type") },
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
          editingItem
            ? t("optionPage.editOption")
            : t("optionPage.createOption")
        }
      >
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              {t("optionPage.description")}
            </label>
            <input
              type="text"
              value={formData.description}
              onChange={(e) =>
                setFormData({ ...formData, description: e.target.value })
              }
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
              required
              maxLength={30}
            />
            <label className="block mb-2 mt-4 text-sm font-medium text-gray-700 mb-2">
              {t("optionPage.type")}
            </label>
            <select
              value={formData.type}
              onChange={(e) =>
                setFormData({ ...formData, type: e.target.value })
              }
              className="w-1/2 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
            >
              <option value="NUM">{t("optionPage.numeric")}</option>
              <option value="STR">{t("optionPage.text")}</option>
            </select>
          </div>

          <div className="flex justify-end gap-3 pt-4">
            <button
              type="button"
              onClick={() => setIsModalOpen(false)}
              className="px-4 py-2 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
            >
              {t("cancelButton")}
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-red-700 text-white rounded-lg hover:bg-red-800 transition-colors"
            >
              {editingItem ? t("updateButton") : t("createButton")}
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
