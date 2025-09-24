import { useEffect,useState } from "react"
import SurveyCard from "./SurveyCard"
import api from "../../api/user.api"

const SurveyList = () => {
    const [surveys,setSurveys]=useState([])

  useEffect(()=>{

    async function getSurveys(){
      try {
      const surveys=await api.get('survey/list/')
      console.log(surveys)
      setSurveys(surveys.data)
      
    } catch (error) {
      console.log(error)
      
    }

    }

    getSurveys()
    
  },[])

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
        {surveys.map(survey=>(
            <SurveyCard key={survey.id} survey={survey}/>
        ))}
    </div>
  )
}

export default SurveyList