import { useState, useEffect } from "react";
import { Plus } from "lucide-react";
import { toast } from "sonner";
import DataTable from "../../components/Admin/DataTable";
import Modal from "../../components/Admin/Modal";
import api from "../../services/apiAdmin";
import Filters from "../../components/admin/Filters";

export default function ZonePage() {
  const [data, setData] = useState([]);
  const [campuses, setCampuses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState(null);
  const [filteredData, setFilteredData] = useState([]);
  const [formData, setFormData] = useState({
    name: "",
    number: 1,
    zone_type: "OP",
    campus: null,
  });

  useEffect(() => {
    loadData();
    loadCampuses();
  }, []);

  const loadData = async () => {
    try {
      setLoading(true);
      const result = await api.zone.list();
      setData(result.data);
      console.log("zone data", result.data);
    } catch (error) {
      console.error("Error loading data:", error);
      toast.error("Error loading zones");
    } finally {
      setLoading(false);
    }
  };

  const loadCampuses = async () => {
    try {
      const result = await api.campus.list();
      // console.log("campuses in zonepage", result.data);
      setCampuses(result.data);
    } catch (error) {
      console.error("Error loading campuses:", error);
      toast.error("Error loading campuses");
    }
  };

  const handleCreate = () => {
    setEditingItem(null);
    setFormData({ name: "", number: 1, zone_type: "OP", campus: null });
    setIsModalOpen(true);
  };

  const handleEdit = (item) => {
    setEditingItem(item);
    setFormData({
      name: item.name,
      number: item.number,
      zone_type: item.zone_type,
      campus: item.campus,
    });
    setIsModalOpen(true);
  };

  const handleDelete = async (item) => {
    if (window.confirm(`Are you sure you want to delete "${item.name}"?`)) {
      try {
        await api.zone.delete(item.id);
        toast.success("Zone deleted successfully");
        loadData();
      } catch (error) {
        console.error("Error deleting:", error);
        toast.error("Error deleting zone");
      }
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingItem) {
        await api.zone.update(editingItem.id, formData);
        toast.success("Zone updated successfully");
      } else {
        await api.zone.create(formData);
        toast.success("Zone created successfully");
      }
      setIsModalOpen(false);
      loadData();
    } catch (error) {
      console.error("Error saving:", error);
      toast.error("Error saving zone");
    }
  };

  const columns = [
    { key: "id", label: "ID" },
    { key: "name", label: "Name" },
    { key: "number", label: "Number" },
    {
      key: "zone_type",
      label: "Zone Type",
      render: (val) => {
        const types = { OP: "Open Space", CL: "Closed Space", MX: "Mixed" };
        return types[val] || val;
      },
    },
    { key: "campus", label: "Campus" },
  ];

  if (loading) {
    return <div className="p-8 text-center">Loading...</div>;
  }

  return (
    <div className="p-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-gray-900">Zones</h1>
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
        criteria={["name", "campus"]}
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
        title={editingItem ? "Edit Zone" : "Create Zone"}
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
              maxLength={300}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Number
            </label>
            <input
              min={1}
              type="number"
              value={formData.number}
              onChange={(e) =>
                setFormData({ ...formData, number: parseInt(e.target.value) })
              }
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Zone Type
            </label>
            <select
              value={formData.zone_type}
              onChange={(e) =>
                setFormData({ ...formData, zone_type: e.target.value })
              }
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
              required
            >
              <option value="OP">Open Space</option>
              <option value="CL">Closed Space</option>
              <option value="MX">Mixed</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Campus
            </label>
            <select
              value={formData.campus || ""}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  campus: e.target.value ? parseInt(e.target.value) : null,
                })
              }
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
            >
              <option value="">None</option>
              {campuses.map((campus) => (
                <option key={campus.id} value={campus.id}>
                  {campus.name}
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
