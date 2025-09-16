import { useParams } from "react-router";
import usePageStore from "../../stores/use-page-store";
import VisitsList from "../../components/visits/VisitsList";
import CreateVisit from "../../components/visits/CreateVisit";

const Visits = () => {
  const { id } = useParams();

  const { addTriggerVisit,setAddTriggerVisit } = usePageStore();

  const handleAddClick = (e) => {
    e.preventDefault();
    setAddTriggerVisit(!addTriggerVisit);
  };

  return (
    <div>
      {addTriggerVisit ? (
        <VisitsList surveysession_id={id} />
      ) : (
        <CreateVisit surveysession_id={id} />
      )}

      <button onClick={handleAddClick}>
        <img
          src="/surveysession/add.svg"
          alt="add"
          className="fixed m-8 w-20 h-20 bottom-0 right-0"
        ></img>
      </button>
    </div>
  );
};

export default Visits;
