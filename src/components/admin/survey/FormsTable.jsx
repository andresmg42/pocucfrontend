import { useEffect, useState } from "react";
import api from "../../../api/user.api";
import Forms from "./Forms";
import toast from "react-hot-toast";
import { useNavigate } from "react-router";

const FormsTable = () => {
  const navigate = useNavigate();
  const [surveys, setSurveys] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [created, setCreated] = useState(false);
  const [selected, setSelected] = useState({});
  const [edit, setEdit] = useState(false);
  const [editPayload, setEditPayload] = useState({});
  const [deleted, setDeleted] = useState(false);

  useEffect(() => {
    const fetchSurveys = async () => {
      try {
        const response = await api.get("survey/list/");
        setSurveys(response.data || []);
      } catch (error) {
        console.error("Error loading surveys", error);
      } finally {
        setLoading(false);
      }
    };

    fetchSurveys();
  }, [created, deleted]);

  if (isCreateOpen) {
    return (
      <Forms
        onBack={() => setIsCreateOpen(false)}
        setCreated={() => setCreated(!created)}
        editPayload={editPayload}
        edit={edit}
        setEdit={setEdit}
      />
    );
  }

  const handleEdit = (survey, event) => {
    event.preventDefault();
    event.stopPropagation();
    setIsCreateOpen(true);
    setEditPayload(survey);
    setEdit(true);
  };

  const handleDelete = async (event, survey_id) => {
    event.preventDefault();
    event.stopPropagation();
    const confirmed = window.confirm(
      "¿Estas seguro de eliminar este FORMULARIO?",
    );
    if (confirmed) {
      setLoading(true);
      const res = await api.delete(`survey/surveys/${survey_id}/`);
      setLoading(false);
      setDeleted((prev) => !prev);
      toast.success("Encuesta eliminada correctamente");
    }
  };

  return (
    <div className="w-full min-w-0 rounded-2xl border border-slate-200 bg-white/90 p-6 shadow-lg shadow-slate-200/60">
      <div className="mb-6 flex flex-wrap items-center justify-between gap-4">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-400">
            Formularios
          </p>
          <h2 className="mt-2 text-2xl font-semibold text-slate-900">
            Encuestas registradas
          </h2>
          <p className="mt-2 text-sm text-slate-500">
            Selecciona una encuesta para ver sus preguntas o administra desde
            las acciones.
          </p>
        </div>
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={() => {
              setEdit(false);
              setIsCreateOpen(true);
            }}
            className="inline-flex cursor-pointer h-10 w-10 items-center justify-center rounded-full border border-amber-200 bg-amber-50 text-lg font-semibold text-amber-600 shadow-sm transition hover:border-amber-300 hover:bg-amber-100"
            aria-label="Crear nueva encuesta"
          >
            +
          </button>
          <span className="rounded-full border border-amber-200 bg-amber-50 px-4 py-2 text-xs font-semibold uppercase tracking-[0.3em] text-amber-600">
            {loading ? "Cargando" : `${surveys.length} items`}
          </span>
        </div>
      </div>

      <div className="max-w-full overflow-x-auto rounded-2xl border border-slate-200 bg-white">
        <table className="w-full table-fixed divide-y divide-slate-200 text-left text-sm">
          <thead className="bg-slate-50 text-xs uppercase tracking-wider text-slate-500">
            <tr>
              <th className="w-40 px-4 py-3">Nombre</th>
              <th className="hidden w-28 px-4 py-3 sm:table-cell">Tema</th>
              <th className="hidden w-24 px-4 py-3 md:table-cell">Version</th>
              <th className="hidden px-4 py-3 lg:table-cell">Descripcion</th>
              <th className="hidden w-20 px-4 py-3 xl:table-cell">Imagen</th>
              <th className="hidden w-28 px-4 py-3 xl:table-cell">Creado</th>
              <th className="w-36 px-4 py-3 text-right">Acciones</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {loading && (
              <tr>
                <td
                  className="px-4 py-6 text-center text-slate-400"
                  colSpan={7}
                >
                  Cargando encuestas...
                </td>
              </tr>
            )}

            {!loading && surveys.length === 0 && (
              <tr>
                <td
                  className="px-4 py-6 text-center text-slate-400"
                  colSpan={7}
                >
                  No hay encuestas registradas.
                </td>
              </tr>
            )}

            {!loading &&
              surveys.map((survey) => (
                <tr
                  key={survey.id}
                  className="cursor-pointer transition hover:bg-slate-50"
                  onClick={(event) => {
                    event.preventDefault();
                    event.stopPropagation();
                    navigate(`create-questions/${survey.id}`);
                  }}
                >
                  <td className="px-4 py-3 font-medium text-slate-900">
                    {survey.name}
                  </td>
                  <td className="hidden px-4 py-3 text-slate-600 sm:table-cell">
                    {survey.topic}
                  </td>
                  <td className="hidden px-4 py-3 text-slate-600 md:table-cell">
                    {survey.version}
                  </td>
                  <td className="hidden px-4 py-3 text-slate-600 lg:table-cell">
                    <span
                      className="block max-w-full truncate"
                      title={survey.description}
                    >
                      {survey.description}
                    </span>
                  </td>
                  <td className="hidden px-4 py-3 text-slate-600 xl:table-cell">
                    {survey.image_url ? (
                      <a
                        className="text-amber-600 underline-offset-2 hover:underline"
                        href={survey.image_url}
                        target="_blank"
                        rel="noreferrer"
                        onClick={(event) => event.stopPropagation()}
                      >
                        Ver
                      </a>
                    ) : (
                      "-"
                    )}
                  </td>
                  <td className="hidden px-4 py-3 text-slate-600 xl:table-cell">
                    {survey.uploaded_at ? survey.uploaded_at : "-"}
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex justify-end gap-2">
                      <button
                        type="button"
                        aria-label="Editar"
                        className="flex h-8 w-8 items-center justify-center rounded-lg border border-slate-200 text-slate-600 transition hover:border-slate-400 hover:text-slate-900"
                        onClick={(event) => handleEdit(survey, event)}
                      >
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth={2}
                          className="h-4 w-4"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            d="M16.862 4.487a2.25 2.25 0 013.182 3.182L8.25 19.463 4 20l.537-4.25L16.862 4.487z"
                          />
                        </svg>
                      </button>
                      <button
                        type="button"
                        aria-label="Eliminar"
                        className="flex h-8 w-8 items-center justify-center rounded-lg border border-rose-200 text-rose-600 transition hover:border-rose-300 hover:text-rose-700"
                        onClick={(event) => handleDelete(event, survey.id)}
                      >
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth={2}
                          className="h-4 w-4"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            d="M6 7h12M9 7V5a1 1 0 011-1h4a1 1 0 011 1v2m-1 0v12a2 2 0 01-2 2H8a2 2 0 01-2-2V7h12z"
                          />
                        </svg>
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default FormsTable;
