import React, { useEffect, useState } from "react";
import api from "../../api/user.api";
import useAuthStore from "../../stores/use-auth-store";
import { useNavigate } from "react-router";
import toast from "react-hot-toast";
import CreateSession from "./CreateSession";
import usePageStore from "../../stores/use-page-store";
import Placeholder1 from "../placeholders/Placeholder1";
import SurveySessionPlaceholderCard from "./SurveySessionPlaceholderCard";

const SessionList2 = ({ survey_id }) => {
  const navigate = useNavigate();

  const {
    addTrigger,
    setAddTrigger,
    session,
    setSession,
    update,
    setUpdate,
    setVisitAddTriggerDisabled,
  } = usePageStore();

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

        if (res.data) {
          const disableStates = sessions.reduce((acc, session) => {
            acc[session.id] = false;
            return acc;
          }, {});

          setVisitAddTriggerDisabled((prev) => ({ ...prev, ...disableStates }));
        }
      } catch (error) {
        console.log("error in SessionList", error);
        setLoading(false);
      } finally {
        setLoading(false);
      }
    }
    getSession();
  }, [userLogged, sessionIsDeleted]);

  if (loading) {
    return (
      <div className=" sm:p-6  flex flex-1  flex-col  items-center">
        <h2 class="text-4xl  font-bold  text-black ">Sesiones</h2>

        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4  m-5 ">
          <SurveySessionPlaceholderCard />
          <SurveySessionPlaceholderCard />
          <SurveySessionPlaceholderCard />
          <SurveySessionPlaceholderCard />
        </div>
      </div>
    );
  }

  const handleClickStart = async (surveysession_id, visit_number) => {
    try {
      const res = api.post("surveysession/update_start_session/", {
        surveysession_id: surveysession_id,
      });
    } catch (error) {
      console.error("error in handleClickStart of SessionList2.jsx", error);
    }

    navigate(`visits/${surveysession_id}/${visit_number}`);
  };

  const handleClickDelete = async (surveysession_id) => {
    const confirmed = window.confirm(
      "Esta seguro de que desea eliminar esta Sesión?"
    );

    if (confirmed) {
      try {
        const res = await api.delete(`surveysession/${surveysession_id}/`);
        toast.success("Secion de Encuesta Eliminada Exitosamente");

        setSessionIsDeleted((prev) => !prev);
      } catch (error) {
        console.log("error deleting Encuesta", error);
      }
    }
  };

  const handleClickEdit = (session) => {
    setSession(session);
    setAddTrigger(!addTrigger);
    setUpdate(true);
  };

  if (sessions.length === 0)
    return (
      <div className="flex flex-1 items-center justify-center">
        <Placeholder1
          page_name={"Sesión"}
          plural_page_name={"Sesiones"}
          onButtonClick={() => setAddTrigger(!addTrigger)}
        />
      </div>
    );

  return (
    <>
      {addTrigger && (
        <div className=" sm:p-6  flex   flex-col items-center">
          <div className=" w-full  flex items-center justify-center p-2">
            <h2 class="md:text-4xl text-2xl  font-bold  text-black ">Sesiones</h2>

          </div>
          

          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4  m-10 ">
            {sessions.map((session) => {
              console.log("session_id: ", session.id);
              console.log("session_state: ", session.state);
              var localTimeStart = null;
              var localTimeEnd = null;
              console.log("fecha de la visita:", session.start_date);
              if (session.start_date) {
                const dateObj = new Date(session.start_date);
                localTimeStart = dateObj.toLocaleString("es-CO", {
                  dateStyle: "full",
                  timeStyle: "short",
                });
              }

              if (session.end_date) {
                const dateObj = new Date(session.end_date);
                localTimeEnd = dateObj.toLocaleString("es-CO", {
                  dateStyle: "full",
                  timeStyle: "short",
                });
              }

              return (
                <div
                  key={session.id}
                  className="
          flex 
          flex-col 
          space-y-4 
          rounded-xl 
          bg-white 
          p-5 
          shadow-md 
          transition-all 
          duration-300 
          ease-in-out 
          hover:shadow-xl 
          hover:-translate-y-1.5
          border
          border-transparent
          hover:border-indigo-500
        "
                >
                  <div className="flex-grow">
                    <div className="flex items-center justify-between">
                      <h2 className="text-lg font-bold tracking-tight text-slate-800 uppercase">
                        Sesión: {session.number_session}
                      </h2>
                      {/* Status Badge */}
                      <span
                        className={`
                inline-flex 
                items-center 
                rounded-full 
                px-2.5 
                py-0.5 
                text-xs 
                font-medium
                ${
                  session.state === 2
                    ? "bg-green-100 text-green-800"
                    : session.state === 1
                    ? "bg-yellow-100 text-yellow-800"
                    : "bg-red-100 text-yellow-800"
                }
              `}
                      >
                        {session.state === 2
                          ? "Completa"
                          : session.state == 1
                          ? "En Proceso"
                          : "Sin Iniciar"}
                      </span>
                    </div>

                    <div className="mt-2 space-y-2 text-sm text-slate-500">
                      <div className="flex items-center gap-2">
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          className="h-4 w-4"
                          viewBox="0 0 20 20"
                          fill="currentColor"
                        >
                          <path
                            fillRule="evenodd"
                            d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z"
                            clipRule="evenodd"
                          />
                        </svg>
                        <span>Zona: {session.zone_name}</span>
                      </div>

                      <div className="flex items-center gap-2">
                        {/* Icon for Date */}
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          className="h-4 w-4"
                          viewBox="0 0 20 20"
                          fill="currentColor"
                        >
                          <path
                            fillRule="evenodd"
                            d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h8a1 1 0 100-2H6z"
                            clipRule="evenodd"
                          />
                        </svg>
                        <span>
                          Fecha Inicio:{" "}
                          {localTimeStart
                            ? localTimeStart
                            : "No has Iniciado la Sesión"}
                        </span>
                      </div>

                      {localTimeEnd && (
                        <div className="flex items-center gap-2">
                          {/* Icon for Date */}
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            className="h-4 w-4"
                            viewBox="0 0 20 20"
                            fill="currentColor"
                          >
                            <path
                              fillRule="evenodd"
                              d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h8a1 1 0 100-2H6z"
                              clipRule="evenodd"
                            />
                          </svg>
                          <span>Fecha Finalización: {localTimeEnd}</span>
                        </div>
                      )}

                      <div className="flex items-center gap-2">
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          className="h-4 w-4"
                          viewBox="0 0 20 20"
                          fill="currentColor"
                        >
                          <path d="M11 3a1 1 0 100 2h2.586l-6.293 6.293a1 1 0 101.414 1.414L15 6.414V9a1 1 0 102 0V4a1 1 0 00-1-1h-5z" />
                          <path d="M5 5a2 2 0 00-2 2v8a2 2 0 002 2h8a2 2 0 002-2v-3a1 1 0 10-2 0v3H5V7h3a1 1 0 000-2H5z" />
                        </svg>

                        <a
                          href={session.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-indigo-600 hover:text-indigo-800 hover:underline font-medium truncate"
                        >
                          {session.url}
                        </a>
                      </div>
                    </div>
                  </div>

                  <div className="mt-auto flex items-center justify-end gap-3 pt-4">
                    <button
                      type="button"
                      aria-label="Start session"
                      onClick={() =>
                        handleClickStart(session.id, session.visit_number)
                      }
                      className="flex h-9 w-9 items-center justify-center rounded-full bg-green-100 text-green-600 transition-colors hover:bg-green-200"
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-5 w-5"
                        viewBox="0 0 20 20"
                        fill="currentColor"
                      >
                        <path
                          fillRule="evenodd"
                          d="M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8v4a1 1 0 001.555.832l3-2a1 1 0 000-1.664l-3-2z"
                          clipRule="evenodd"
                        />
                      </svg>
                    </button>

                    <button
                      type="button"
                      aria-label="Edit session"
                      onClick={() => handleClickEdit(session)}
                      className="flex h-9 w-9 items-center justify-center rounded-full bg-blue-100 text-blue-600 transition-colors hover:bg-blue-200"
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-5 w-5"
                        viewBox="0 0 20 20"
                        fill="currentColor"
                      >
                        <path d="M17.414 2.586a2 2 0 00-2.828 0L7 10.172V13h2.828l7.586-7.586a2 2 0 000-2.828z" />
                        <path
                          fillRule="evenodd"
                          d="M2 6a2 2 0 012-2h4a1 1 0 010 2H4v10h10v-4a1 1 0 112 0v4a2 2 0 01-2 2H4a2 2 0 01-2-2V6z"
                          clipRule="evenodd"
                        />
                      </svg>
                    </button>

                    <button
                      type="button"
                      aria-label="Delete session"
                      onClick={() => handleClickDelete(session.id)}
                      className="flex h-9 w-9 items-center justify-center rounded-full bg-red-100 text-red-600 transition-colors hover:bg-red-200"
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-5 w-5"
                        viewBox="0 0 20 20"
                        fill="currentColor"
                      >
                        <path
                          fillRule="evenodd"
                          d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z"
                          clipRule="evenodd"
                        />
                      </svg>
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </>
  );
};

export default SessionList2;
