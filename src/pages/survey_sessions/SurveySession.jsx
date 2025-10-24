import React, { useState } from "react";
import SessionList from "../../components/surveysession/SessionList";
import { useParams } from "react-router";
import CreateSession from "../../components/surveysession/CreateSession";
import usePageStore from "../../stores/use-page-store";
import SessionList2 from "../../components/surveysession/SessionList2";
const SurveySession = () => {
  const { survey_id } = useParams();

  const { addTrigger, setAddTrigger,setUpdate,update } = usePageStore();

  const handleAddClick = (e) => {
    e.preventDefault();
    setAddTrigger(!addTrigger);
    setUpdate(false)
    
  };
  return (
    <div className="bg-[url('public/registro-sesiones/sesion.png')] md:bg-fixed md:bg-contain md:bg-no-repeat">
      {addTrigger ? (
        <SessionList2 survey_id={survey_id} />
      ) : (
        <CreateSession survey_id={survey_id} />
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

export default SurveySession;
