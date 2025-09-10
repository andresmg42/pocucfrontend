import React from 'react'
import SessionList from '../../components/surveysession/SessionList'
import { useParams } from 'react-router'

const SurveySession = () => {
    const {id} =useParams();
  return (
    <div>
        <SessionList survey_id={id}/>
    </div>
  )
}

export default SurveySession