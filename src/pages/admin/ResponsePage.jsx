import { useState, useEffect } from "react";
import { Plus } from "lucide-react";
import { toast } from "sonner";
import DataTable from "../../components/Admin/DataTable";
import Modal from "../../components/Admin/Modal";
import api from "../../services/apiAdmin";
import Filters from "../../components/admin/Filters";

export default function ResponsePage() {
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
      label: "Parent Question",
      render: (val) => (val ? val : "-"),
    },
    { key: "question", label: "Question ID" },
    { key: "question_code", label: "Question Code" },
    { key: "question_description", label: "Q description" },
    { key: "option", label: "Option ID" },
    { key: "numeric_value", label: "Numeric Value" },
    {
      key: "text_value",
      label: "Text Value",
      render: (val) => (val ? val : "-"),
    },
    { key: "subcategory", label: "Subcategory" },
    { key: "category", label: "category" },
    { key: "observer", label: "Observer" },
    { key: "observer_email", label: "Email" },
    { key: "survey", label: "Survey" },
    { key: "campus", label: "Campus" },
    { key: "zone", label: "Zone", render: (val) => val.slice(0, 20) + "..." },
    { key: "surveysession_id", label: "Session Id" },
    { key: "visita", label: "Visit ID" },
  ];

  if (loading) {
    return <div className="p-8 text-center">Loading...</div>;
  }

  return (
    <div className="p-8">
      <Filters
        data={data}
        setFilteredData={setFilteredData}
        criteria={[
          { key: "question_code", label: "Quetion Code" },
          { key: "observer_email", label: "Observer Email" },
          { key: "parent_question", label: "Parent Question Description" },
          "category",
          "subcategory",
          "observer",
          "campus",
          "zone",
          "survey",
        ]}
      />

      <DataTable columns={columns} data={filteredData} />
    </div>
  );
}
