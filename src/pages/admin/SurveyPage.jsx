import { useState, useEffect } from "react";
import { Plus } from "lucide-react";
import { toast } from "sonner";
import { useTranslation } from "react-i18next";
import DataTable from "../../components/Admin/DataTable";
import Modal from "../../components/Admin/Modal";
import FormBuilder from "../../components/Admin/FormBuilder";
import api from "../../services/apiAdmin";
import Filters from "../../components/Admin/Filters";

export default function SurveyPage() {
  const { t } = useTranslation();
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState(null);
  const [selectedSurvey, setSelectedSurvey] = useState(null);
  const [filteredData, setFilteredData] = useState([]);
  const [formData, setFormData] = useState({
    name: "",
    topic: "",
    version: "",
    description: "",
    image_url: "",
  });

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      setLoading(true);
      const result = await api.survey.list();
      setData(result.data);
    } catch (error) {
      console.error("Error loading data:", error);
      toast.error(t("surveyPage.loadError"));
    } finally {
      setLoading(false);
    }
  };

  const handleCreate = () => {
    setEditingItem(null);
    setFormData({
      name: "",
      topic: "",
      version: "",
      description: "",
      image_url: "",
    });
    setIsModalOpen(true);
  };

  const handleEdit = (item) => {
    setEditingItem(item);
    setFormData({
      name: item.name,
      topic: item.topic,
      version: item.version,
      description: item.description,
      image_url: item.image_url || "",
    });
    setIsModalOpen(true);
  };

  const handleDelete = async (item) => {
    if (window.confirm(t("surveyPage.deleteConfirm", { name: item.name }))) {
      try {
        await api.survey.delete(item.id);
        toast.success(t("surveyPage.deleteSuccess"));
        loadData();
      } catch (error) {
        console.error("Error deleting:", error);
        toast.error(t("surveyPage.deleteError"));
      }
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingItem) {
        await api.survey.update(editingItem.id, formData);
        toast.success(t("surveyPage.updateSuccess"));
      } else {
        await api.survey.create(formData);
        toast.success(t("surveyPage.createSuccess"));
      }
      setIsModalOpen(false);
      loadData();
    } catch (error) {
      console.error("Error saving:", error);
      toast.error(t("surveyPage.saveError"));
    }
  };

  const columns = [
    { key: "id", label: "ID" },
    { key: "name", label: t("surveyPage.name") },
    { key: "topic", label: t("surveyPage.topic") },
    { key: "version", label: t("surveyPage.version") },
    { key: "description", label: t("surveyPage.description") },
  ];

  if (loading) {
    return <div className="p-8 text-center">{t("surveyPage.loading")}</div>;
  }

  if (selectedSurvey) {
    return (
      <FormBuilder
        survey={selectedSurvey}
        onClose={() => setSelectedSurvey(null)}
      />
    );
  }

  return (
    <div className="p-8">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">
            {t("surveyPage.title")}
          </h1>
          <p className="text-sm text-gray-500 mt-1">
            {t("surveyPage.subtitle")}
          </p>
        </div>
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
          { key: "name", label: t("surveyPage.name") },
          { key: "topic", label: t("surveyPage.topic") },
          { key: "description", label: t("surveyPage.description") },
        ]}
      />

      <DataTable
        columns={columns}
        data={filteredData}
        onEdit={handleEdit}
        onDelete={handleDelete}
        onRowClick={(item) => setSelectedSurvey(item)}
      />

      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={
          editingItem
            ? t("surveyPage.editSurvey")
            : t("surveyPage.createSurvey")
        }
      >
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              {t("surveyPage.name")}
            </label>
            <input
              type="text"
              value={formData.name}
              onChange={(e) =>
                setFormData({ ...formData, name: e.target.value })
              }
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
              required
              maxLength={50}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              {t("surveyPage.topic")}
            </label>
            <input
              type="text"
              value={formData.topic}
              onChange={(e) =>
                setFormData({ ...formData, topic: e.target.value })
              }
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
              required
              maxLength={20}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              {t("surveyPage.version")}
            </label>
            <input
              type="text"
              value={formData.version}
              onChange={(e) =>
                setFormData({ ...formData, version: e.target.value })
              }
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
              required
              maxLength={10}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              {t("surveyPage.description")}
            </label>
            <input
              type="text"
              value={formData.description}
              onChange={(e) =>
                setFormData({ ...formData, description: e.target.value })
              }
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
              required
              maxLength={100}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              {t("surveyPage.imageUrl")}
            </label>
            <input
              type="text"
              value={formData.image_url}
              onChange={(e) =>
                setFormData({ ...formData, image_url: e.target.value })
              }
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
              maxLength={100}
            />
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
