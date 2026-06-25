import { useState, useEffect } from "react";
import { Plus } from "lucide-react";
import { toast } from "sonner";
import DataTable from "../../components/Admin/DataTable";
import Modal from "../../components/Admin/Modal";
import api from "../../services/apiAdmin";

export default function ResponsePage() {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);

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
    { key: "question", label: "Question ID" },
    { key: "question_description", label: "Q description" },
    { key: "option", label: "Option ID" },
    { key: "numeric_value", label: "Numeric Value" },
    { key: "text_value", label: "Text Value" },
    { key: "subcategory", label: "Subcategory" },
    { key: "category", label: "category" },
    { key: "observer", label: "Observer" },
    { key: "observer_email", label: "Email" },
    { key: "survey", label: "Survey" },
    { key: "campus", label: "Campus" },
    { key: "zone", label: "Zone", render: (val) => val.slice(0, 20) + "..." },
    { key: "surveysession", label: "Session Id" },
    { key: "visita", label: "Visit ID" },
  ];

  if (loading) {
    return <div className="p-8 text-center">Loading...</div>;
  }

  return (
    <div className="p-8">
      <div className="overflow-x-auto bg-white rounded-lg shadow">
        <table className="w-full">
          <thead className="bg-gray-50 border-b border-gray-200">
            <tr>
              {columns.map((column) => (
                <th
                  key={column.key}
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  {column.label}
                </th>
              ))}
              <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {data.length === 0 ? (
              <tr>
                <td
                  colSpan={columns.length + 1}
                  className="px-6 py-8 text-center text-gray-500"
                >
                  No data available
                </td>
              </tr>
            ) : (
              data.map((row) => (
                <tr key={row.id} className={`"hover:bg-gray-50"}`}>
                  {columns.map((column) => (
                    <td
                      key={column.key}
                      className="px-6 py-4 text-sm text-gray-900"
                    >
                      {column.render
                        ? column.render(row[column.key], row)
                        : row[column.key]}
                    </td>
                  ))}
                  <td className="px-6 py-4 text-right text-sm">export</td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
