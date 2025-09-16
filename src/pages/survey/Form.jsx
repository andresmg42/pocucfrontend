import React, { useEffect } from 'react'
import { useParams } from 'react-router'
import api from '../../api/user.api';

const Form = () => {

  const {id}=useParams();

  useEffect(()=>{

    async function getSurveyQuestions(){
      try {
        console.log('survey_question_id in form',id)
        const res= await api.get(`survey/get_survey/?surveysession_id=${id}`) 
        console.log(res)
      } catch (error) {
        console.log(error)
        
      }
    }

    getSurveyQuestions();

  },[])

  return (
    <div>Form</div>
  )
}

export default Form