import React from 'react'
import SessionList from '../../components/surveysession/SessionList'
import { useParams } from 'react-router'
import CreateSession from '../../components/surveysession/CreateSession'

const SurveySession = () => {
    const {id} =useParams();
  return (
    <div>
      <CreateSession survey_id={id}/>
        {/* <SessionList survey_id={id}/> */}
    </div>
  )
}

export default SurveySession