import React, { useState } from 'react'
import SessionList from '../../components/surveysession/SessionList'
import { useParams } from 'react-router'
import CreateSession from '../../components/surveysession/CreateSession'
import usePageStore from '../../stores/use-page-store'

const SurveySession = () => {
    const {id} =useParams();

    const {addTrigger,setAddTrigger}=usePageStore();
    

    const handleAddClick=(e)=>{
      e.preventDefault()
      setAddTrigger(!addTrigger)

    }
  return (
    <div>
      {addTrigger? 
      <SessionList survey_id={id}/>
      :
      <CreateSession survey_id={id}/>
      }

      <button
      onClick={handleAddClick}
      >
        <img src='/surveysession/add.svg' alt='add' className='fixed m-8 w-20 h-20 bottom-0 right-0' ></img>
        
      </button>
      
        
    </div>
  )
}

export default SurveySession