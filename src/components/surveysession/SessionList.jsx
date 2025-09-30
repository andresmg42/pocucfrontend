import React, { useEffect, useState } from "react";
import api from "../../api/user.api";
import useAuthStore from "../../stores/use-auth-store";
import { useNavigate } from "react-router";
import toast from "react-hot-toast";
import CreateSession from "./CreateSession";
import usePageStore from "../../stores/use-page-store";

const SessionList = ({ survey_id }) => {
  const navigate = useNavigate();

  const { addTrigger, setAddTrigger, session, setSession,update,setUpdate } = usePageStore();

  const [sessions, setSessions] = useState([]);

  const [loading, setLoading] = useState(true);

  const { userLogged } = useAuthStore();

  const [sessionIsDeleted, setSessionIsDeleted] = useState(false);

  useEffect(() => {
    async function getSession() {
      try {
        const res = await api.get(
          `surveysession/get_survey_session_by_survey_id?survey_id=${survey_id}&email=${userLogged.email}`
        );
        console.log("esta es la respuesta en sessionlist", res);
        setSessions(res.data);
      } catch (error) {
        console.log("error in SessionList", error);
      } finally {
        setLoading(false);
      }
    }
    getSession();
  }, [userLogged, sessionIsDeleted]);

  if (loading) {
    return <div className="text-center p-10 text-white">Loading users...</div>;
  }

  const handleClickStart = (surveysession_id) => {
    navigate(`visits/${surveysession_id}`);
  };

  const handleClickDelete = async (surveysession_id) => {
    try {
      const res = await api.delete(`surveysession/${surveysession_id}/`);

      toast.success("Secion de Encuesta Eliminada Exitosamente");

      setSessionIsDeleted((prev) => !prev);
    } catch (error) {
      console.log("error deleting Encuesta", error);
    }
  };

  const handleClickEdit = (session) => {
    setSession(session);
    setAddTrigger(!addTrigger)
    setUpdate(true)
  };

  return (
    <>
      {addTrigger && (
        <div className="container mx-auto p-4 sm:p-6 lg:p-8">
          <h1 className="text-2xl sm:text-3xl font-bold mb-6 text-gray-800">
            Lista de Sesiónes
          </h1>
          {/* Wrapper for responsive table */}
          <div className="overflow-x-auto relative shadow-md sm:rounded-lg">
            <table className="w-full text-sm text-left text-gray-500">
              <thead className="text-xs text-gray-700 uppercase bg-gray-50">
                <tr>
                  <th scope="col" className="py-3 px-6">
                    ID
                  </th>

                  <th scope="col" className="py-3 px-6">
                    Numemro de Sesion
                  </th>
                  <th scope="col" className="py-3 px-6">
                    Numero de Zona
                  </th>
                  <th scope="col" className="py-3 px-6">
                    Fecha de Inicio
                  </th>
                  <th scope="col" className="py-3 px-6">
                    Fecha de Finalizacion
                  </th>
                  <th scope="col" className="py-3 px-6">
                    Distancia de Observacion(m)
                  </th>
                  <th scope="col" className="py-3 px-6">
                    Fecha de Carga
                  </th>
                  <th scope="col" className="py-3 px-6">
                    Url Evidencia
                  </th>
                  <th scope="col" className="py-3 px-6">
                    Accion
                  </th>
                </tr>
              </thead>
              <tbody>
                {sessions.map((session) => (
                  <tr
                    key={session.id}
                    className="bg-white border-b hover:bg-gray-100"
                  >
                    {/* ID is bolded to make it stand out */}
                    <th
                      scope="row"
                      className="py-4 px-6 font-medium text-gray-900 whitespace-nowrap"
                    >
                      {session.id}
                    </th>
                    <td className="py-4 px-6">{session.number_session}</td>
                    <td className="py-4 px-6">{session.zone}</td>
                    <td className="py-4 px-6">{session.start_date}</td>
                    <td className="py-4 px-6">{session.end_date}</td>
                    <td className="py-4 px-6">
                      {session.observational_distance}
                    </td>
                    <td className="py-4 px-6">{session.uploaded_at}</td>
                    <td className="py-4 px-6">{session.url}</td>
                    <td className="py-4 px-6">
                      {
                        <div className="flex">
                          <button
                            type="button"
                            class="focus:outline-none text-white bg-green-700 hover:bg-green-800 focus:ring-4 focus:ring-green-300 font-medium rounded-lg text-sm px-5 py-2.5 me-2 mb-2 dark:bg-green-600 dark:hover:bg-green-700 dark:focus:ring-green-800"
                            onClick={() => handleClickStart(session.id)}
                          >
                            Iniciar
                          </button>

                          <button
                            type="button"
                            class="focus:outline-none text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 me-2 mb-2 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
                            onClick={() => handleClickEdit(session)}
                          >
                            Editar
                          </button>

                          <button
                            type="button"
                            class="focus:outline-none text-white bg-red-700 hover:bg-red-800 focus:ring-4 focus:ring-red-300 font-medium rounded-lg text-sm px-5 py-2.5 me-2 mb-2 dark:bg-red-600 dark:hover:bg-red-700 dark:focus:ring-red-800"
                            onClick={() => handleClickDelete(session.id)}
                          >
                            Eliminar
                          </button>
                        </div>
                      }
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </>
  );
};

export default SessionList;
