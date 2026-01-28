import React, { useEffect, useState } from "react";
import { CompactTable } from "@table-library/react-table-library/compact";
import api from "../../api/user.api";
import { useTheme } from "@table-library/react-table-library/theme";
import { getTheme } from "@table-library/react-table-library/baseline";
import { useRowSelect } from "@table-library/react-table-library/select";
import { useNavigate } from "react-router";
import { useParams } from "react-router";
import Spinner from "./Spinner";

const SessionsReport = () => {
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState([]);
  const theme = useTheme(getTheme());
  const navigate = useNavigate();
  const { observer_id, survey_id, observer_name } = useParams();

  const tableData = { nodes: data };

  useEffect(() => {
    async function get_table() {
      try {
        const res = await api.get(
          `surveysession/get_table_session_info/?observer_id=${observer_id}&survey_id=${survey_id}`,
        );

        console.log("data in table session:", res.data);

        if (res.data) {
          setData(res.data);
        }
      } catch (error) {
        console.error("error in ObserveTable", error);
        setLoading(false);
      } finally {
        setLoading(false);
      }
    }

    get_table();
  }, []);
  const COLUMNS = [
    { label: "Id", renderCell: (item) => item.id },
    {
      label: "Numero Sesión",
      renderCell: (item) => item.number_session,
    },
    {
      label: "Estado",
      renderCell: (item) =>
        item.state === 2
          ? "Completada"
          : item.state === 1
            ? "En Proceso"
            : "No Iniciada",
    },
    {
      label: "Zona",
      renderCell: (item) => item.zone_name,
    },
    {
      label: "# Zona",
      renderCell: (item) => item.zone,
    },
    {
      label: "Distanacia Ob.",
      renderCell: (item) => item.observational_distance,
    },
    {
      label: "Numero Visitas",
      renderCell: (item) => item.visits_rate,
    },

    {
      label: "Fecha de Inicio",
      renderCell: (item) =>
        item.start_date
          ? new Date(item.start_date).toLocaleDateString()
          : "N/A",
    },
    {
      label: "Fecha de Finalizacion",
      renderCell: (item) =>
        item.end_date ? new Date(item.end_date).toLocaleDateString() : "N/A",
    },
    {
      label: "Url Evidencia",
      renderCell: (item) => (
        <a
          className="text-blue-700"
          href={item.url}
          target="_blank"
          rel="noopener noreferrer"
        >
          {item.url}
        </a>
      ),
    },
  ];

  const handleRowClick = (item) => {
    navigate(`report-panel-visits/${item.id}/${item.number_session}`);
  };

  const select = useRowSelect(tableData, {
    onChange: (action, state) => {
      const clickedItem = data.find((item) => item.id === state.id);

      console.log("this is the state", state.id);
      if (clickedItem) {
        handleRowClick(clickedItem);
      }
    },
  });

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center flex-1 h-[60vh]">
        <Spinner />

        <span className="text-lg text-slate-600">Loading data...</span>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center justify-center">
      <div className="flex items-center justify-center bg-black/2 w-full p-5">
        <h1 className="text-black text-xl font-bold">
          Reporte de Sesiones para {observer_name}
        </h1>
      </div>

      <div className="flex-1  p-5">
        {data.length > 0 ? (
          <CompactTable
            columns={COLUMNS}
            data={tableData}
            theme={theme}
            select={select}
          />
        ) : (
          <div className="text-black">Cargando datos o no hay visitas...</div>
        )}
      </div>
    </div>
  );
};

export default SessionsReport;
