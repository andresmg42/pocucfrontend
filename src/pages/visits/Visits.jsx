import { useParams } from "react-router";
import usePageStore from "../../stores/use-page-store";
import VisitsList from "../../components/visits/VisitsList";
import CreateVisit from "../../components/visits/CreateVisit";
import VisitsList2 from "../../components/visits/VisitsList2";

const Visits = () => {
  const { surveysession_id,visit_number } = useParams();

  const { addTriggerVisit,setAddTriggerVisit,updateVisit,setUpdateVisit,visitAddTriggerDisabled } = usePageStore();

  const handleAddClick = (e) => {
    e.preventDefault();
    setAddTriggerVisit(!addTriggerVisit);
    setUpdateVisit(false)
   
  };

  console.log('visit add trigger state',visitAddTriggerDisabled)

  return (
    <div>
      {addTriggerVisit ? (
        <VisitsList2 surveysession_id={surveysession_id} visit_number={visit_number} />
      ) : (
        <CreateVisit surveysession_id={surveysession_id} />
      )}

      <button 
      
      disabled={visitAddTriggerDisabled[surveysession_id]}
      onClick={handleAddClick}>
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
