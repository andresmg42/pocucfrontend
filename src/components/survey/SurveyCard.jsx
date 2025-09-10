import { Navigate, useNavigate } from "react-router"

const SurveyCard = ({survey}) => {

  const navigate=useNavigate();
  return (
    <div className="bg-white p-3 hover:bg-gray-200 transition duration-300 ease-in-out
        hover:cursor-pointer"

        onClick={()=>{
            navigate(`surveysession/${survey.id}`)
        }}
        >
            
            {survey.image_url!=null && (
               <img 
               src={survey.image_url} 
               alt={survey.name}
               className="w-32 h-[120px] object-cover mb-3 rounded-md"
           />
            )}
            <h1 className="font-bold uppercase text-black">{survey.name}</h1>
            <p className="text-black opacity-40">Tema: {survey.topic}</p>
            <p className="text-black opacity-40">Descripción: {survey.description}</p>
            
        </div>
  )
}

export default SurveyCard