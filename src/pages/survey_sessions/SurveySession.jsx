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
    <div className="flex flex-1 bg-[url('/registro-sesiones/sesion.png')] bg-cover md:bg-contain bg-no-repeat">
      {addTrigger ? (
        <SessionList2 survey_id={survey_id} />
      ) : (
        <CreateSession survey_id={survey_id} />
      )}

      <button  onClick={handleAddClick}>
        <img
          src="/surveysession/add.svg"
          alt="add"
          className="fixed m-8 h-10 w-10 md:w-20 md:h-20 top-10 right-0"
        ></img>
      </button>
    </div>
  );
};

export default SurveySession;
