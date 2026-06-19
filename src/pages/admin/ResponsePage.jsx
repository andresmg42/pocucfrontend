import { useState, useEffect } from "react";
import { Plus } from "lucide-react";
import { toast } from "sonner";
import DataTable from "../../components/Admin/DataTable";
import Modal from "../../components/Admin/Modal";
import api from "../../services/api";

export default function ResponsePage() {
  const [data, setData] = useState([]);
  const [visits, setVisits] = useState([]);
  const [options, setOptions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState(null);
  const [formData, setFormData] = useState({
    visita: "",
    question: "",
    numeric_value: null,
    text_value: "",
    option: null,
  });

  useEffect(() => {
    loadData();
    loadVisits();
    loadOptions();
  }, []);

  const loadData = async () => {
    try {
      setLoading(true);
      const result = await api.response.list();
      setData(result);
    } catch (error) {
      console.error("Error loading data:", error);
      toast.error("Error loading responses");
    } finally {
      setLoading(false);
    }
  };

  const loadVisits = async () => {
    try {
      const result = await api.visit.list();
      setVisits(result);
    } catch (error) {
      console.error("Error loading visits:", error);
      toast.error("Error loading visits");
    }
  };

  const loadOptions = async () => {
    try {
      const result = await api.option.list();
      setOptions(result);
    } catch (error) {
      console.error("Error loading options:", error);
      toast.error("Error loading options");
    }
  };

  const handleCreate = () => {
    setEditingItem(null);
    setFormData({
      visita: "",
      question: "",
      numeric_value: null,
      text_value: "",
      option: null,
    });
    setIsModalOpen(true);
  };

  const handleEdit = (item) => {
    setEditingItem(item);
    setFormData({
      visita: item.visita,
      question: item.question,
      numeric_value: item.numeric_value,
      text_value: item.text_value || "",
      option: item.option,
    });
    setIsModalOpen(true);
  };

  const handleDelete = async (item) => {
    if (
      window.confirm(`Are you sure you want to delete response #${item.id}?`)
    ) {
      try {
        await api.response.delete(item.id);
        toast.success("Response deleted successfully");
        loadData();
      } catch (error) {
        console.error("Error deleting:", error);
        toast.error("Error deleting response");
      }
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const submitData = {
        visita: parseInt(formData.visita),
        question: parseInt(formData.question),
        numeric_value: formData.numeric_value
          ? parseInt(formData.numeric_value)
          : null,
        text_value: formData.text_value || null,
        option: formData.option ? parseInt(formData.option) : null,
      };

      if (editingItem) {
        await api.response.update(editingItem.id, submitData);
        toast.success("Response updated successfully");
      } else {
        await api.response.create(submitData);
        toast.success("Response created successfully");
      }
      setIsModalOpen(false);
      loadData();
    } catch (error) {
      console.error("Error saving:", error);
      toast.error("Error saving response");
    }
  };

  const columns = [
    { key: "id", label: "ID" },
    { key: "visita", label: "Visit ID" },
    { key: "question", label: "Question ID" },
    { key: "numeric_value", label: "Numeric Value" },
    { key: "text_value", label: "Text Value" },
    { key: "option", label: "Option ID" },
  ];

  if (loading) {
    return <div className="p-8 text-center">Loading...</div>;
  }

  return (
    <div className="p-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-gray-900">Responses</h1>
        <button
          onClick={handleCreate}
          className="flex items-center gap-2 bg-red-700 text-white px-4 py-2 rounded-lg hover:bg-red-800 transition-colors"
        >
          <Plus size={20} />
          Add New
        </button>
      </div>

      <DataTable
        columns={columns}
        data={data}
        onEdit={handleEdit}
        onDelete={handleDelete}
      />

      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={editingItem ? "Edit Response" : "Create Response"}
      >
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Visit
            </label>
            <select
              value={formData.visita}
              onChange={(e) =>
                setFormData({ ...formData, visita: e.target.value })
              }
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
              required
            >
              <option value="">Select a visit</option>
              {visits.map((visit) => (
                <option key={visit.id} value={visit.id}>
                  Visit #{visit.id} - Visit Number: {visit.visit_number}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Question ID
            </label>
            <input
              type="number"
              value={formData.question}
              onChange={(e) =>
                setFormData({ ...formData, question: e.target.value })
              }
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Numeric Value
            </label>
            <input
              type="number"
              value={formData.numeric_value || ""}
              onChange={(e) =>
                setFormData({ ...formData, numeric_value: e.target.value })
              }
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Text Value
            </label>
            <input
              type="text"
              value={formData.text_value}
              onChange={(e) =>
                setFormData({ ...formData, text_value: e.target.value })
              }
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
              maxLength={30}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Option
            </label>
            <select
              value={formData.option || ""}
              onChange={(e) =>
                setFormData({ ...formData, option: e.target.value })
              }
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
            >
              <option value="">None</option>
              {options.map((option) => (
                <option key={option.id} value={option.id}>
                  {option.description}
                </option>
              ))}
            </select>
          </div>

          <div className="flex justify-end gap-3 pt-4">
            <button
              type="button"
              onClick={() => setIsModalOpen(false)}
              className="px-4 py-2 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-red-700 text-white rounded-lg hover:bg-red-800 transition-colors"
            >
              {editingItem ? "Update" : "Create"}
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
