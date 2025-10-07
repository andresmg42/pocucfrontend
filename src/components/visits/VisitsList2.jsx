import { useState } from "react";
import useAuthStore from "../../stores/use-auth-store";
import { useEffect } from "react";
import api from "../../api/user.api";
import { useNavigate } from "react-router";
import toast from "react-hot-toast";
import usePageStore from "../../stores/use-page-store";
import Placeholder1 from "../placeholders/Placeholder1";

const VisitsList2 = ({ surveysession_id }) => {
  const [visits, setVisits] = useState([]);

  const [loading, setLoading] = useState(true);

  const { userLogged } = useAuthStore();

  const [visitedIsDeleted, setVisitIsDeleted] = useState(false);

  const navigate = useNavigate();

  const {
    setVisit,
    addTriggerVisit,
    setAddTriggerVisit,

    setUpdateVisit,
  } = usePageStore();

  useEffect(() => {
    async function getVisits() {
      try {
        const res = await api.get(
          `visit/sessionvisits?surveysession_id=${surveysession_id}`
        );

        if (res.data){
          const sortedData=res.data.sort((a,b)=>a.visit_number-b.visit_number);
          setVisits(sortedData);
        }

        
        console.log("respuesta en visitas fetch", res.data);
      } catch (error) {
        console.log("error in SessionList", error);
      } finally {
        setLoading(false);
      }
    }
    getVisits();
  }, [userLogged, visitedIsDeleted]);

  if (loading) {
    return <div className="text-center p-10 text-white">Loading users...</div>;
  }

  const handleClickStart = async (visit_id) => {
    try {
      const res = api.post(`visit/update_start_date/`,{'visit_id':visit_id});

      if (res.status === 200) {
        toast.success("visit started successfully");
      }
    } catch (error) {
      console.error(error);
    }

    console.log("este es el surveysession_id", surveysession_id);
    navigate(`categories/${visit_id}`);
  };

  const handleClickDelete = async (visit_id) => {
    try {
      const res = await api.delete(`visit/${visit_id}/`);

      setVisitIsDeleted((prev) => !prev);

      toast.success("Visita Eliminada Exitosamente");
    } catch (error) {
      console.log("error deleting visit", error);
    }
  };

  const handleClickEdit = async (visit) => {
    setVisit(visit);
    setAddTriggerVisit(!addTriggerVisit);
    setUpdateVisit(true);
  };

  if (visits.length === 0)
    return (
      <div className="flex items-center justify-center">
        <Placeholder1
          page_name={"Visita"}
          plural_page_name={"Visitas"}
          onButtonClick={() => {
            setAddTriggerVisit(!addTriggerVisit);
            setUpdateVisit(false);
          }}
        />
      </div>
    );

  return (
    <>
      {addTriggerVisit && (
        <div className="p-4 sm:p-6 md:p-8">
          <h2 class="text-4xl font-bold dark:text-white text-black mb-10">
            Visitas
          </h2>

          {/* Responsive grid layout that adjusts to screen size */}
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {visits.map((visit) => {

              var localTimeStart=null;
              var localTimeEnd=null;
              console.log('fecha de la visita:',visit.visit_start_date_time)
              if (visit.visit_start_date_time) {
                const dateObj = new Date(visit.visit_start_date_time);
                localTimeStart = dateObj.toLocaleString("es-CO", {
                  dateStyle: "full", 
                  timeStyle: "short", 
                });
              }

              if (visit.visit_end_date_time){
                const dateObj = new Date(visit.visit_end_date_time);
                localTimeEnd = dateObj.toLocaleString("es-CO", {
                  dateStyle: "full", 
                  timeStyle: "short", 
                });

              }
                
                console.log('localtime',localTimeStart)
              

              return (
                <div
                  key={visit.id}
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
                  {/* Card Header & Main Content */}
                  <div className="flex-grow">
                    <div className="flex items-center justify-between">
                      <h2 className="text-lg font-bold tracking-tight text-slate-800 uppercase">
                        Visita: {visit.visit_number}
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
                  visit.state === 2
                    ? "bg-green-100 text-green-800"
                    : visit.state === 1
                    ? "bg-yellow-100 text-yellow-800"
                    : "bg-red-100 text-yellow-800"
                }
              `}
                      >
                        {visit.state === 2
                          ? "Completa"
                          : visit.state == 1
                          ? "En Proceso"
                          : "Sin Iniciar"}
                      </span>
                    </div>

                    {/* Meta Information */}
                    <div className="mt-3 space-y-2 text-sm text-slate-500">
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
                        <span>Fecha Inicio: {localTimeStart? localTimeStart:'No has Iniciado la visita'}</span>
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
  
                    </div>
                  </div>

                  {/* Action Buttons pushed to the bottom */}
                  <div className="mt-auto flex items-center justify-end gap-3 pt-4">
                    <button
                      type="button"
                      aria-label="Start visit"
                      onClick={() => handleClickStart(visit.id)}
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
                      aria-label="Edit visit"
                      onClick={() => handleClickEdit(visit)}
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
                      aria-label="Delete visit"
                      onClick={() => handleClickDelete(visit.id)}
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

export default VisitsList2;
