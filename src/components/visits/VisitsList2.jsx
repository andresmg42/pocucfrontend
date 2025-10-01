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
        <div className="flex flex-col items-center gap-6">
          {visits.map((visit) => (
            <div
            key={visit.id}
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
                {visit.complete ? "Completa" : "Incompleta"}
              </p>

              <div className="flex items-center justify-center gap-8  mt-6 w-full sm:w-auto">
                <button
                  type="button"
                  className="cursor-pointer"
                  onClick={() => handleClickStart(visit.id)}
                >
                  <img src="/buttons/start.svg" alt="start" />
                </button>
                <button
                  type="button"
                  className="cursor-pointer"
                  onClick={() => handleClickEdit(visit)}
                >
                  <img src="/buttons/edit.svg" alt="edit" />
                </button>

                <button
                  type="button"
                  className="cursor-pointer"
                  onClick={() => handleClickDelete(visit.id)}
                >
                  <img src="/buttons/trash.svg" alt="trash" />
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
