import { useState, useEffect } from "react";
import { Plus } from "lucide-react";
import { toast } from "sonner";
import DataTable from "../../components/Admin/DataTable";
import Modal from "../../components/Admin/Modal";
import api from "../../services/apiAdmin";
import Filters from "../../components/Admin/Filters";
import { useTranslation } from "react-i18next";

export default function ResponsePage() {
  const { t } = useTranslation();
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filteredData, setFilteredData] = useState([]);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      setLoading(true);
      const result = await api.response.list();
      setData(result.data);
      console.log("response data:", result.data);
    } catch (error) {
      console.error("Error loading data:", error);
      toast.error("Error loading responses");
    } finally {
      setLoading(false);
    }
  };

  const columns = [
    { key: "id", label: "ID" },
    {
      key: "parent_question",
      label: t("responsePage.parentQuestion"),
      render: (val) => (val ? val : "-"),
    },
    { key: "question", label: t("responsePage.questionID") },
    { key: "question_code", label: t("responsePage.questionCode") },
    {
      key: "question_description",
      label: t("responsePage.questionDescription"),
    },
    { key: "option", label: t("responsePage.optionID") },
    { key: "numeric_value", label: t("responsePage.numericValue") },
    {
      key: "text_value",
      label: t("responsePage.textValue"),
      render: (val) => (val ? val : "-"),
    },
    { key: "subcategory", label: t("responsePage.subcategory") },
    { key: "category", label: t("responsePage.category") },
    { key: "observer", label: t("responsePage.observer") },
    { key: "observer_email", label: t("responsePage.email") },
    { key: "survey", label: t("responsePage.survey") },
    { key: "campus", label: "Campus" },
    {
      key: "zone",
      label: t("responsePage.zone"),
      render: (val) => val.slice(0, 20) + "...",
    },
    { key: "surveysession_id", label: t("responsePage.sessionID") },
    { key: "visita", label: t("responsePage.visitID") },
  ];

  if (loading) {
    return <div className="p-8 text-center">Loading...</div>;
  }

  return (
    <div className="p-8">
      <h1 className="text-3xl font-bold text-gray-900 mb-10">
        {t("responsePage.title")}
      </h1>
      <Filters
        data={data}
        setFilteredData={setFilteredData}
        criteria={[
          { key: "question_code", label: t("responsePage.questionCode") },
          { key: "observer_email", label: t("responsePage.email") },
          { key: "parent_question", label: t("responsePage.parentQuestion") },
          { key: "category", label: t("responsePage.category") },
          { key: "subcategory", label: t("responsePage.subcategory") },
          { key: "observer", label: t("responsePage.observer") },
          "campus",
          { key: "zone", label: t("responsePage.zone") },
          { key: "survey", label: t("responsePage.survey") },
        ]}
      />

      <DataTable columns={columns} data={filteredData} />
    </div>
  );
}
