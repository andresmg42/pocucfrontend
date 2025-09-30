import React, { useEffect, useState } from "react";
import api from "../../api/user.api";
import useAuthStore from "../../stores/use-auth-store";
import { useNavigate } from "react-router";
import toast from "react-hot-toast";
import CreateSession from "./CreateSession";
import usePageStore from "../../stores/use-page-store";

const SessionList2 = ({ survey_id }) => {
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
        <div>
           {sessions.map(session=>(
             <div className="bg-white p-3 hover:bg-gray-200 transition duration-300 ease-in-out m-5
        hover:cursor-pointer"

        
        >
            
            <h1 className="font-bold uppercase text-black">{session.number_session}</h1>
            <p className="text-black opacity-40">Zona: {session.zone}</p>
            <p className="text-black opacity-40">Url: {session.url}</p>
            
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
        </div>
           ))} 
        </div>
        
      )}
    </>
  );
};

export default SessionList2;
