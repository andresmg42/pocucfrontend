import { useState, useEffect } from "react";
import { Plus } from "lucide-react";
import { toast } from "sonner";
import DataTable from "../../components/Admin/DataTable";
import Modal from "../../components/Admin/Modal";
import api from "../../services/apiAdmin";
import Filters from "../../components/Admin/Filters";

export default function SubcategoryPage() {
  const [data, setData] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState(null);
  const [filteredData, setFilteredData] = useState([]);
  const [formData, setFormData] = useState({
    name: "",
    category: "",
  });

  useEffect(() => {
    loadData();
    loadCategories();
  }, []);

  const loadData = async () => {
    try {
      setLoading(true);
      const result = await api.subcategory.list();
      setData(result.data);
    } catch (error) {
      console.error("Error loading data:", error);
      toast.error("Error loading subcategories");
    } finally {
      setLoading(false);
    }
  };

  const loadCategories = async () => {
    try {
      const result = await api.category.list();
      setCategories(result.data);
    } catch (error) {
      console.error("Error loading categories:", error);
      toast.error("Error loading categories");
    }
  };

  const handleCreate = () => {
    setEditingItem(null);
    setFormData({ name: "", category: "" });
    setIsModalOpen(true);
  };

  const handleEdit = (item) => {
    setEditingItem(item);
    setFormData({
      name: item.name,
      category: item.category,
    });
    setIsModalOpen(true);
  };

  const handleDelete = async (item) => {
    if (window.confirm(`Are you sure you want to delete "${item.name}"?`)) {
      try {
        await api.subcategory.delete(item.id);
        toast.success("Subcategory deleted successfully");
        loadData();
      } catch (error) {
        console.error("Error deleting:", error);
        toast.error("Error deleting subcategory");
      }
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingItem) {
        await api.subcategory.update(editingItem.id, formData);
        toast.success("Subcategory updated successfully");
      } else {
        await api.subcategory.create(formData);
        toast.success("Subcategory created successfully");
      }
      setIsModalOpen(false);
      loadData();
    } catch (error) {
      console.error("Error saving:", error);
      toast.error("Error saving subcategory");
    }
  };

  const columns = [
    { key: "id", label: "ID" },
    { key: "name", label: "Name" },
    { key: "category", label: "Category ID" },
    { key: "category_name", label: "Category" },
  ];

  if (loading) {
    return <div className="p-8 text-center">Loading...</div>;
  }

  return (
    <div className="p-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-gray-900">Subcategories</h1>
        <button
          onClick={handleCreate}
          className="flex items-center gap-2 bg-red-700 text-white px-4 py-2 rounded-lg hover:bg-red-800 transition-colors"
        >
          <Plus size={20} />
          Add New
        </button>
      </div>

      <Filters
        data={data}
        setFilteredData={setFilteredData}
        criteria={["name", { key: "category_name", label: "category" }]}
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
        title={editingItem ? "Edit Subcategory" : "Create Subcategory"}
      >
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Name
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
              Category
            </label>
            <select
              value={formData.category}
              onChange={(e) =>
                setFormData({ ...formData, category: parseInt(e.target.value) })
              }
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
              required
            >
              <option value="">Select a category</option>
              {categories.map((category) => (
                <option key={category.id} value={category.id}>
                  {category.name}
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
