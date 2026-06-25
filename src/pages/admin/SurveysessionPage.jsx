import { useState, useEffect } from "react";
import { Plus } from "lucide-react";
import { toast } from "sonner";
import DataTable from "../../components/Admin/DataTable";
import Modal from "../../components/Admin/Modal";
import api from "../../services/apiAdmin";

export default function SurveysessionPage() {
  const [data, setData] = useState([]);
  const [zones, setZones] = useState([]);
  const [surveys, setSurveys] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState(null);
  const [observers, setObservers] = useState([]);
  const [campuses, setCampuses] = useState([]);
  const [selectedCampusId, setSelectedCampusId] = useState(null);
  const [formData, setFormData] = useState({
    zone: "",
    observer: "",
    survey: "",
    observational_distance: "",
    url: "",
    visit_number: 1,
  });

  useEffect(() => {
    loadData();
    loadCampuses();
    loadSurveys();
    loadObservers();
  }, []);

  useEffect(() => {
    loadZones();
  }, [selectedCampusId]);

  const loadData = async () => {
    try {
      setLoading(true);
      const result = await api.surveysession.list();
      const valid_data = result?.data || [];
      console.log("surveysession data", valid_data);
      setData(valid_data);
    } catch (error) {
      console.error("Error loading data:", error);
      toast.error("Error loading survey sessions");
    } finally {
      setLoading(false);
    }
  };

  const loadZones = async () => {
    if (selectedCampusId) {
      const result = await api.zone.getZoneByCampus(selectedCampusId);
      console.log("zones", result.data);
      setZones(result.data);
    }
  };

  const loadCampuses = async () => {
    try {
      const result = await api.campus.list();
      setCampuses(result.data);
    } catch (error) {
      console.error("Error loading campus", error);
      toast.error("Error Loading campus");
    }
  };

  const loadSurveys = async () => {
    try {
      const result = await api.survey.list();
      setSurveys(result.data);
    } catch (error) {
      console.error("Error loading surveys:", error);
      toast.error("Error loading surveys");
    }
  };

  const loadObservers = async () => {
    try {
      const result = await api.observer.list();
      setObservers(result.data);
      console.log("observers", result.data);
    } catch (error) {
      console.error("Error loading observers", error);
      toast.error("Error Loading Observers");
    }
  };

  const handleCreate = () => {
    setEditingItem(null);
    setFormData({
      zone: "",
      observer: "",
      survey: "",
      observational_distance: "",
      url: "",
      visit_number: 1,
    });
    setIsModalOpen(true);
  };

  const handleEdit = (item) => {
    setEditingItem(item);
    setFormData({
      zone: item.zone,
      observer: item.observer,
      survey: item.survey,
      observational_distance: item.observational_distance,
      url: item.url,
      visit_number: item.visit_number,
    });
    setIsModalOpen(true);
  };

  const handleDelete = async (item) => {
    if (
      window.confirm(`Are you sure you want to delete session #${item.id}?`)
    ) {
      try {
        await api.surveysession.delete(item.id);
        toast.success("Survey session deleted successfully");
        loadData();
      } catch (error) {
        console.error("Error deleting:", error);
        toast.error("Error deleting survey session");
      }
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingItem) {
        await api.surveysession.update(editingItem.id, formData);
        toast.success("Survey session updated successfully");
      } else {
        await api.surveysession.create(formData);
        toast.success("Survey session created successfully");
      }
      setIsModalOpen(false);
      loadData();
    } catch (error) {
      const err = error?.response?.data;
      console.error("Error saving:", error);
      toast.error(`Error saving survey session,error ${JSON.stringify(err)}`);
    }
  };

  const columns = [
    { key: "id", label: "ID" },
    { key: "number_session", label: "# Session" },
    { key: "observer", label: "Observer" },
    { key: "survey_name", label: "Survey" },
    { key: "campus_name", label: "Campus" },
    { key: "zone_name", label: "Zone" },
    {
      key: "state",
      label: "State",
      render: (val) =>
        val === 0 ? "Sin Iniciar" : val === 1 ? "En Proceso" : "Finalizada",
    },

    { key: "visit_number", label: "Visits" },
    {
      key: "start_date",
      label: "Start Date",
      render: (val) => (val ? Date(val).toLocaleString() : "-"),
    },
    {
      key: "end_date",
      label: "End Date",
      render: (val) => (val ? Date(val).toLocaleString() : "-"),
    },
  ];

  if (loading) {
    return <div className="p-8 text-center">Loading...</div>;
  }

  return (
    <div className="p-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-gray-900">Survey Sessions</h1>
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
        title={editingItem ? "Edit Survey Session" : "Create Survey Session"}
      >
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Campus
            </label>
            <select
              value={selectedCampusId ? selectedCampusId : ""}
              onChange={(e) => setSelectedCampusId(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
              required
            >
              <option value="">Select a Campus</option>
              {campuses?.map((campus) => (
                <option key={campus.id} value={campus.id}>
                  {campus.name}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Zone
            </label>
            <select
              value={formData.zone}
              onChange={(e) =>
                setFormData({ ...formData, zone: parseInt(e.target.value) })
              }
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
              required
            >
              <option value="">Select a zone</option>
              {zones.map((zone) => (
                <option key={zone.id} value={zone.id}>
                  {zone.name}
                </option>
              ))}
            </select>
          </div>
          {(editingItem?.state === 0 || !editingItem) && (
            <>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Observer
                </label>
                <select
                  value={formData.observer}
                  onChange={(e) =>
                    setFormData({ ...formData, observer: e.target.value })
                  }
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                  required
                >
                  <option value="">Select Observer</option>
                  {observers?.map((observer) => (
                    <option key={observer.id} value={observer.email}>
                      {observer.name}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Survey
                </label>
                <select
                  value={formData.survey}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      survey: parseInt(e.target.value),
                    })
                  }
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                  required
                >
                  <option value="">Select a survey</option>
                  {surveys.map((survey) => (
                    <option key={survey.id} value={survey.id}>
                      {survey.name}
                    </option>
                  ))}
                </select>
              </div>
            </>
          )}

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Observational Distance (m)
            </label>
            <input
              min={3}
              type="Number"
              value={formData.observational_distance}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  observational_distance: e.target.value,
                })
              }
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
              required
              maxLength={20}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              URL
            </label>
            <input
              type="text"
              value={formData.url}
              onChange={(e) =>
                setFormData({ ...formData, url: e.target.value })
              }
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
              required
              maxLength={100}
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Number of Visits
            </label>
            <input
              min={1}
              type="number"
              value={formData.visit_number}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  visit_number: parseInt(e.target.value),
                })
              }
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
              required
            />
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
