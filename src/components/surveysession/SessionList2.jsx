import React, { useEffect, useState } from "react";
import api from "../../api/user.api";
import useAuthStore from "../../stores/use-auth-store";
import { useNavigate } from "react-router";
import toast from "react-hot-toast";
import CreateSession from "./CreateSession";
import usePageStore from "../../stores/use-page-store";
import Placeholder1 from "../placeholders/Placeholder1";

const SessionList2 = ({ survey_id }) => {
  const navigate = useNavigate();

  const { addTrigger, setAddTrigger, session, setSession, update, setUpdate } =
    usePageStore();

  const [sessions, setSessions] = useState([]);

  const [loading, setLoading] = useState(true);

  const { userLogged } = useAuthStore();

  const [sessionIsDeleted, setSessionIsDeleted] = useState(false);

  useEffect(() => {
    if (!userLogged) return;
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
    setAddTrigger(!addTrigger);
    setUpdate(true);
  };

  if(sessions.length===0) return (
    <div className="flex items-center justify-center">
      <Placeholder1 page_name={'Sesion'} plural_page_name={'Sesiones'} onButtonClick={()=>setAddTrigger(!addTrigger)}/>
    </div>
  )

  return (
    <>
      {addTrigger && (
        <div className=" min-h-screen p-4 sm:p-6 md:p-8">
      
      <div className="flex flex-col items-center gap-6">
        {sessions.map((session) => (
          
          <div
            key={session.id} 
            className="
              bg-white 
              rounded-xl
              shadow-md
              p-6 
              flex 
              flex-col 
              items-center 
              text-center
              transition 
              duration-300 
              ease-in-out 
              hover:shadow-xl
              transform
              hover:-translate-y-1
              w-full
              max-w-2xl
            "
          >
            
            <div className="flex-grow w-full">
              <h1 className="font-bold text-xl uppercase text-gray-800">
                {session.number_session}
              </h1>
              <p className="text-gray-500 text-sm mt-1">Zona: {session.zone}</p>
              
              <p className="text-gray-500 text-sm break-all">Url: {session.url}</p>
            </div>

            
            <div className="flex items-center justify-center gap-8  mt-6 w-full sm:w-auto">
              <button
                type="button"
                className="cursor-pointer"
  
                onClick={() => handleClickStart(session.id)}
              >
                <img src="/buttons/start.svg" alt="start" />
              </button>

              <button
                type="button"
                className="cursor-pointer"
                onClick={() => handleClickEdit(session)}
              >
                <img src="/buttons/edit.svg" alt="edit" />
              </button>

              <button
                type="button"
                className="cursor-pointer"
                onClick={() => handleClickDelete(session.id)}
              >
                <img src="/buttons/trash.svg" alt="trash" />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
      )}
    </>
  );
};

export default SessionList2;
