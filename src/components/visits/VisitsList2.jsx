import { useState } from "react";
import useAuthStore from "../../stores/use-auth-store";
import { useEffect } from "react";
import api from "../../api/user.api";
import { useNavigate } from "react-router";
import toast from "react-hot-toast";
import usePageStore from "../../stores/use-page-store";

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

        setVisits(res.data);
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

  const handleClickStart = (visit_id) => {
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

  return (
    <>
      {addTriggerVisit && (
        <div>
          {visits.map((visit) => (
            <div
              className="bg-white p-3 hover:bg-gray-200 transition duration-300 ease-in-out m-5
        hover:cursor-pointer"
            >
              <h1 className="font-bold uppercase text-black">
                Numero visita: {visit.visit_number}
              </h1>
              <p className="text-black opacity-40">
                Fecha de visita: {visit.visit_date}
              </p>
              <p className="text-black opacity-40">
                Hora Inicio: {visit.start_time}
              </p>
              <p className="text-black opacity-40">
                Hora Final: {visit.end_time}
              </p>
              <p className="text-black opacity-40">
                Estado:
                {visit.complete ? 'Completa' : 'Incompleta'}
              </p>

              <div className="flex mt-8">
                <button
                  type="button"
                  class="focus:outline-none text-white bg-green-700 hover:bg-green-800 focus:ring-4 focus:ring-green-300 font-medium rounded-lg text-sm px-5 py-2.5 me-2 mb-2 dark:bg-green-600 dark:hover:bg-green-700 dark:focus:ring-green-800"
                  onClick={() => handleClickStart(visit.id)}
                >
                  Iniciar
                </button>

                <button
                  type="button"
                  class="focus:outline-none text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 me-2 mb-2 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
                  onClick={() => handleClickEdit(visit)}
                >
                  Editar
                </button>

                <button
                  type="button"
                  class="focus:outline-none text-white bg-red-700 hover:bg-red-800 focus:ring-4 focus:ring-red-300 font-medium rounded-lg text-sm px-5 py-2.5 me-2 mb-2 dark:bg-red-600 dark:hover:bg-red-700 dark:focus:ring-red-800"
                  onClick={() => handleClickDelete(visit.id)}
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

export default VisitsList2;
