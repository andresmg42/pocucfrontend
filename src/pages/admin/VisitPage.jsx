import { useState, useEffect } from "react";
import { Plus } from "lucide-react";
import { toast } from "sonner";
import DataTable from "../../components/Admin/DataTable";
import Modal from "../../components/Admin/Modal";
import api from "../../services/apiAdmin";
import Filters from "../../components/admin/Filters";

export default function VisitPage() {
  const [data, setData] = useState([]);
  const [sessions, setSessions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState(null);
  const [filteredData, setFilteredData] = useState([]);
  const [formData, setFormData] = useState({
    surveysession: "",
    state: 0,
  });

  useEffect(() => {
    loadData();
    loadSessions();
  }, []);

  const loadData = async () => {
    try {
      setLoading(true);
      const result = await api.visit.list();
      setData(result.data);
      console.log("visit data,", result.data);
    } catch (error) {
      console.error("Error loading data:", error);
      toast.error("Error loading visits");
    } finally {
      setLoading(false);
    }
  };

  const loadSessions = async () => {
    try {
      const result = await api.surveysession.list();
      setSessions(result.data);
    } catch (error) {
      console.error("Error loading sessions:", error);
      toast.error("Error loading sessions");
    }
  };

  const handleCreate = () => {
    setEditingItem(null);
    setFormData({ surveysession: "" });
    setIsModalOpen(true);
  };

  const handleEdit = (item) => {
    setEditingItem(item);
    if (item.state === 0) {
      setFormData({
        surveysession: item.surveysession,
      });
      setIsModalOpen(true);
    } else {
      toast.error(
        "No puedes editar una visita en estado diferente de 'Sin Iniciar'",
      );
    }
  };

  const handleDelete = async (item) => {
    if (window.confirm(`Are you sure you want to delete visit #${item.id}?`)) {
      try {
        await api.visit.delete(item.id);
        toast.success("Visit deleted successfully");
        loadData();
      } catch (error) {
        console.error("Error deleting:", error);
        toast.error("Error deleting visit");
      }
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingItem) {
        await api.visit.update(editingItem.id, formData);
        toast.success("Visit updated successfully");
      } else {
        await api.visit.create(formData);
        toast.success("Visit created successfully");
      }
      setIsModalOpen(false);
      loadData();
    } catch (error) {
      console.error("Error saving:", error);
      toast.error("Error saving visit");
    }
  };

  const columns = [
    { key: "id", label: "ID" },
    {
      key: "observer",
      label: "Observer",
    },
    {
      key: "survey",
      label: "Survey",
    },
    { key: "surveysession", label: "Survey Session ID" },
    { key: "visit_number", label: "Visit #" },
    {
      key: "visit_start_date_time",
      label: "Start Date",
      render: (val) => (val ? new Date(val).toLocaleString() : "-"),
    },
    {
      key: "visit_end_date_time",
      label: "End Date",
      render: (val) => (val ? new Date(val).toLocaleString() : "-"),
    },
    {
      key: "state",
      label: "State",
      render: (val) =>
        val === 0 ? "Sin Iniciar" : val === 1 ? "En Proceso" : "Finalizada",
    },
  ];

  if (loading) {
    return <div className="p-8 text-center">Loading...</div>;
  }

  return (
    <div className="p-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-gray-900">Visits</h1>
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
        criteria={[
          "observer",
          "survey",
          {
            key: "state",
            label: "State(0:Sin Iniciar,1:En Proceso,2:Finalizada)",
          },
          { key: "visit_start_date_time", label: "start date", type: "date" },
          { key: "visit_end_date_time", label: "end date", type: "date" },
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
        title={editingItem ? "Edit Visit" : "Create Visit"}
      >
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Survey Session
            </label>
            <select
              value={formData.surveysession}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  surveysession: parseInt(e.target.value),
                })
              }
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
              required
            >
              <option value="">Select a session</option>
              {sessions.map((session) => (
                <option key={session.id} value={session.id}>
                  Session #{session.id}-{session.observer}-{session.campus_name}
                  -{session.zone_name.slice(0, 20) + "..."}
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
