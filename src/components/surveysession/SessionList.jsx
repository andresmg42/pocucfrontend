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

    if(!userLogged) return;
    
    async function getSession() {
      try {
        const res = await api.get(
          `surveysession/get_survey_session_by_survey_id?survey_id=${survey_id}&email=${userLogged.email}`
        )
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

  if(sessions.length===0) return(
     <div className="w-full max-w-md">
    <div className="bg-white border-2 border-dashed border-gray-300 rounded-xl p-8 text-center shadow-sm">
        
        {/* Icon */}
        <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-gray-100 mb-6">
            {/* SVG Icon: Calendar with a magnifying glass */}
            <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 text-gray-400" width="24" height="24" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" fill="none" strokeLinecap="round" strokeLinejoin="round">
                <path stroke="none" d="M0 0h24v24H0z" fill="none"/>
                <path d="M11.5 21h-5.5a2 2 0 0 1 -2 -2v-12a2 2 0 0 1 2 -2h12a2 2 0 0 1 2 2v4" />
                <path d="M16 3v4" />
                <path d="M8 3v4" />
                <path d="M4 11h16" />
                <path d="M18 18m-3 0a3 3 0 1 0 6 0a3 3 0 1 0 -6 0" />
                <path d="M20.2 20.2l1.8 1.8" />
            </svg>
        </div>

        {/* Headline */}
        <h3 className="text-2xl font-bold text-gray-800">No Sessions Found</h3>

        {/* Subtext */}
        <p className="mt-2 text-gray-500 max-w-sm mx-auto">
            It looks like there are no sessions here yet. Get started by creating a new one.
        </p>

        {/* Call to Action Button */}
        <div className="mt-8">
            <button type="button" className="inline-flex items-center rounded-lg bg-indigo-600 px-5 py-3 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600 transition-colors duration-200">
                {/* Plus Icon */}
                <svg className="-ml-1 mr-2 h-5 w-5" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor" fill="none" strokeLinecap="round" strokeLinejoin="round">
                   <path stroke="none" d="M0 0h24v24H0z" fill="none"></path>
                   <path d="M12 5l0 14"></path>
                   <path d="M5 12l14 0"></path>
                </svg>
                Create New Session
            </button>
        </div>

    </div>
</div>
  )

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
