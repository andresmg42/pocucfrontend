import { useState, useEffect } from "react";
import { Plus } from "lucide-react";
import { toast } from "sonner";
import { useTranslation } from "react-i18next";
import DataTable from "../../components/Admin/DataTable";
import Modal from "../../components/Admin/Modal";
import api from "../../services/apiAdmin";
import Filters from "../../components/Admin/Filters";

export default function SurveysessionPage() {
  const { t } = useTranslation();
  const [data, setData] = useState([]);
  const [zones, setZones] = useState([]);
  const [surveys, setSurveys] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState(null);
  const [observers, setObservers] = useState([]);
  const [campuses, setCampuses] = useState([]);
  const [selectedCampusId, setSelectedCampusId] = useState(null);
  const [filteredData, setFilteredData] = useState([]);
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

      setData(valid_data);
    } catch (error) {
      console.error("Error loading data:", error);
      toast.error(t("surveysessionPage.loadError"));
    } finally {
      setLoading(false);
    }
  };

  const loadZones = async () => {
    if (selectedCampusId) {
      const result = await api.zone.getZoneByCampus(selectedCampusId);

      setZones(result.data);
    }
  };

  const loadCampuses = async () => {
    try {
      const result = await api.campus.list();
      setCampuses(result.data);
    } catch (error) {
      console.error("Error loading campus", error);
      toast.error(t("surveysessionPage.loadCampusesError"));
    }
  };

  const loadSurveys = async () => {
    try {
      const result = await api.survey.list();
      setSurveys(result.data);
    } catch (error) {
      console.error("Error loading surveys:", error);
      toast.error(t("surveysessionPage.loadSurveysError"));
    }
  };

  const loadObservers = async () => {
    try {
      const result = await api.observer.list();
      setObservers(result.data);
    } catch (error) {
      console.error("Error loading observers", error);
      toast.error(t("surveysessionPage.loadObserversError"));
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
    if (window.confirm(t("surveysessionPage.deleteConfirm", { id: item.id }))) {
      try {
        await api.surveysession.delete(item.id);
        toast.success(t("surveysessionPage.deleteSuccess"));
        loadData();
      } catch (error) {
        console.error("Error deleting:", error);
        toast.error(t("surveysessionPage.deleteError"));
      }
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingItem) {
        await api.surveysession.update(editingItem.id, formData);
        toast.success(t("surveysessionPage.updateSuccess"));
      } else {
        await api.surveysession.create(formData);
        toast.success(t("surveysessionPage.createSuccess"));
      }
      setIsModalOpen(false);
      loadData();
    } catch (error) {
      const err = error?.response?.data;
      console.error("Error saving:", error);
      toast.error(
        `${t("surveysessionPage.saveError")}: ${JSON.stringify(err)}`,
      );
    }
  };

  const columns = [
    { key: "id", label: t("surveysessionPage.columns.id") },
    {
      key: "number_session",
      label: t("surveysessionPage.columns.numberSession"),
    },
    { key: "observer", label: t("surveysessionPage.columns.observer") },
    { key: "survey_name", label: t("surveysessionPage.columns.survey") },
    { key: "campus_name", label: t("surveysessionPage.columns.campus") },
    {
      key: "zone_name",
      label: t("surveysessionPage.columns.zone"),
      render: (val) => val.slice(0, 20) + "...",
    },
    {
      key: "state",
      label: t("surveysessionPage.columns.state"),
      render: (val) =>
        val === 0
          ? t("surveysessionPage.stateValues.notStarted")
          : val === 1
            ? t("surveysessionPage.stateValues.inProgress")
            : t("surveysessionPage.stateValues.finished"),
    },

    { key: "visit_number", label: t("surveysessionPage.columns.visits") },
    {
      key: "start_date",
      label: t("surveysessionPage.columns.startDate"),
      render: (val) =>
        val
          ? new Date(val).toLocaleString("en-US", {
              year: "numeric",
              month: "2-digit",
              day: "2-digit",
              hour: "2-digit",
              minute: "2-digit",
              second: "2-digit",
            })
          : "-",
    },
    {
      key: "end_date",
      label: t("surveysessionPage.columns.endDate"),
      render: (val) =>
        val
          ? new Date(val).toLocaleString("en-US", {
              year: "numeric",
              month: "2-digit",
              day: "2-digit",
              hour: "2-digit",
              minute: "2-digit",
              second: "2-digit",
            })
          : "-",
    },
    {
      key: "uploaded_at",
      label: t("surveysessionPage.columns.uploadedAt"),
      render: (val) =>
        val
          ? new Date(val).toLocaleDateString("en-US", { timeZone: "UTC" })
          : "-",
    },
  ];

  if (loading) {
    return (
      <div className="p-8 text-center">{t("surveysessionPage.loading")}</div>
    );
  }

  return (
    <div className="p-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-gray-900">
          {t("surveysessionPage.title")}
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
          { key: "observer", label: t("surveysessionPage.filters.observer") },
          {
            key: "state",
            label: t("surveysessionPage.filters.stateLabel"),
          },
          {
            key: "survey_name",
            label: t("surveysessionPage.filters.surveyLabel"),
          },
          {
            key: "campus_name",
            label: t("surveysessionPage.filters.campusLabel"),
          },
          { key: "zone_name", label: t("surveysessionPage.filters.zoneLabel") },
          {
            key: "start_date",
            label: t("surveysessionPage.filters.startDate"),
            type: "date",
          },
          {
            key: "end_date",
            label: t("surveysessionPage.filters.endDate"),
            type: "date",
          },
          {
            key: "uploaded_at",
            label: t("surveysessionPage.filters.uploadedAt"),
            type: "date",
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
          editingItem
            ? t("surveysessionPage.modal.editTitle")
            : t("surveysessionPage.modal.createTitle")
        }
      >
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              {t("surveysessionPage.modal.campusLabel")}
            </label>
            <select
              value={selectedCampusId ? selectedCampusId : ""}
              onChange={(e) => setSelectedCampusId(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
              required
            >
              <option value="">
                {t("surveysessionPage.modal.selectCampus")}
              </option>
              {campuses?.map((campus) => (
                <option key={campus.id} value={campus.id}>
                  {campus.name}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              {t("surveysessionPage.modal.zoneLabel")}
            </label>
            <select
              value={formData.zone}
              onChange={(e) =>
                setFormData({ ...formData, zone: parseInt(e.target.value) })
              }
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
              required
            >
              <option value="">
                {t("surveysessionPage.modal.selectZone")}
              </option>
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
                  {t("surveysessionPage.modal.observerLabel")}
                </label>
                <select
                  value={formData.observer}
                  onChange={(e) =>
                    setFormData({ ...formData, observer: e.target.value })
                  }
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                  required
                >
                  <option value="">
                    {t("surveysessionPage.modal.selectObserver")}
                  </option>
                  {observers?.map((observer) => (
                    <option key={observer.id} value={observer.email}>
                      {observer.name}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  {t("surveysessionPage.modal.surveyLabel")}
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
                  <option value="">
                    {t("surveysessionPage.modal.selectSurvey")}
                  </option>
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
              {t("surveysessionPage.modal.distanceLabel")}
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
              {t("surveysessionPage.modal.urlLabel")}
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
              {t("surveysessionPage.modal.visitsLabel")}
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
