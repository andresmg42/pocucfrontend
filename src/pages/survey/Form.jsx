import React, { useEffect } from 'react'
import { useParams } from 'react-router'
import api from '../../api/user.api';
import { useState } from 'react';


const Form = () => {

  const {id}=useParams();
  const [questions,setQuestions]=useState([])

  useEffect(()=>{

    async function getSurveyQuestions(){
      try {
        console.log('survey_question_id in form',id)
        const res= await api.get(`survey/get_survey/?surveysession_id=${id}`) 
        setQuestions(res.data)
        // console.log('resp from questions request: ',res)
      } catch (error) {
        console.log(error)
        
      }
    }

    getSurveyQuestions();

  },[])

  return (
   <div>
     {questions.map(q=>{
      switch (q.question.question_type) {
        case 'unique_response':
          return (
            <div key={q.question.id} className="mb-4">
              <h3>{q.question.description}</h3>
              {q.options.map((opt) => (
                <label key={opt.id} className="block">
                  <input type="radio" name={`q_${q.question.id}`} value={opt.id} />
                  {opt.description}
                </label>
              ))}
            </div>
          )
          
          break;
      
        default:
          break;
      }
     })}
   </div>

  )
}

export default Form