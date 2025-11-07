import { useParams } from "react-router";
import usePageStore from "../../stores/use-page-store";
// import VisitsList from "../../components/visits/VisitsList";
// import CreateVisit from "../../components/visits/CreateVisit";
import VisitsList2 from "../../components/visits/VisitsList2";
import toast from "react-hot-toast";
import api from "../../api/user.api";

const Visits = () => {
  const { surveysession_id, visit_number } = useParams();

  const {
    addTriggerVisit,
    setAddTriggerVisit,
    updateVisit,
    setUpdateVisit,
    visitAddTriggerDisabled,
  } = usePageStore();

  const handleAddClick = async (e) => {
    e.preventDefault();

    if (!visitAddTriggerDisabled[surveysession_id]) {
      const res = await api.post("visit/", { surveysession: surveysession_id });
      console.log("respuesta in create visit:", res.data);
      setAddTriggerVisit(!addTriggerVisit)
      toast.success("Visita creada exitosamente!");
    } else {
      toast.error("Ya no puedes crear mas visitas!");
    }
  };

  console.log("visit add trigger state", visitAddTriggerDisabled);

  return (
    <div className="flex flex-1 bg-[url('/visitas/visitas.png')] bg-cover bg-center bg-no-repeat">
      <VisitsList2
        surveysession_id={surveysession_id}
        visit_number={visit_number}
      />

      <button
        // disabled={visitAddTriggerDisabled[surveysession_id]}
        onClick={handleAddClick}
      >
        <img
          src="/surveysession/add.svg"
          alt="add"
          className="fixed m-8 h-15 w-15 md:w-20 md:h-20 top-10 right-0"
        ></img>
      </button>
    </div>
  );
};

export default Visits;
