import React, { useEffect } from "react";
import { useParams } from "react-router";
import api from "../../api/user.api";
import { useState } from "react";

const Form = () => {
  const { category_id, surveysession_id } = useParams();
  const [questions, setQuestions] = useState([]);
  const [answers,setAnswers]=useState({})
  const [openTextFields,setOpenTextFields]=useState({});
  

  useEffect(() => {
    async function getSurveyQuestions() {
      try {
        console.log("category_id in form", category_id);
        const res = await api.get(
          `survey/get_survey/?surveysession_id=${surveysession_id}&category_id=${category_id}`
        );
        setQuestions(res.data);
        console.log("resp from questions request: ", res);
      } catch (error) {
        console.log(error);
      }
    }

    getSurveyQuestions();
  }, []);

  const handleRadioChange=(questionId,value)=>{

    if (value=='other'){
      setOpenTextFields(prev=>({...prev,[questionId]:true}))
      setAnswers(prev=>({...prev,[questionId]:''}));
    }
    else{
      setOpenTextFields(prev=>({...prev,[questionId]:false}));
      setAnswers(prevAnswers=>({
      ...prevAnswers,
      [questionId]: value,
    }))

    }
    
  };

  const handleOtherTextChange=(questionId,textValue)=>{
    setAnswers(prev=>({...prev,[questionId]:textValue}))

  }

  const handleSubmit=()=>{

  }

  return (
    <div className="flex  items-center justify-center">
      <form
        onSubmit={handleSubmit}
        class="w-full max-w-2xl bg-white shadow-lg rounded-2xl p-6 space-y-8"
      >
        {questions.map((q) => {

          const isOtherOpen= openTextFields[q.question.id]

          const isOtherSelected= isOtherOpen || (answers[q.question.id] && !q.options.some(opt=>opt.description==answers[q.question.id]))
          switch (q.question.question_type) {
            case "range":
              return (
                <fieldset key={q.question.id} class="space-y-0">
                  <legend class="text-lg text-black text-left font-semibold mb-2">
                    {q.question.description}
                  </legend>

                  {['1','2','3','4','5','mas'].map((value)=>(

                    <label key={value} class="flex items-center gap-3 p-3 border rounded-xl cursor-pointer hover:bg-gray-50">
                    <input
                      type="radio"
                      name={q.question.id}
                      value={value}
                      checked={answers[q.question.id]===value}
                      onChange={()=>handleRadioChange(q.question.id,value)}
                      required
                      class="w-5 h-5 text-blue-600 focus:ring-blue-500"
                    />
                    <span className="font-bold text-black">{value}</span>
                  </label>


                  ))}

                </fieldset>
              );
            case "unique_response":
              return (
                <fieldset key={q.question.id}>
                  <legend class="text-lg text-black text-left font-semibold mb-2">
                    {q.question.description}
                  </legend>

                  {q.options.map((option) => (
                    <label
                      key={option.id}
                      class="flex items-center gap-3 p-3 border rounded-xl cursor-pointer hover:bg-gray-50"
                    >
                      <input
                        type="radio"
                        id={option.id}
                        name={q.question.id}
                        value={option.description}
                        required
                        checked={answers[q.question.id]===option.description}
                        onChange={()=>handleRadioChange(q.question.id,option.description)}
                        class="w-5 h-5 text-blue-600 focus:ring-blue-500"
                      />
                      <span className="font-bold text-black">
                        {option.description}
                      </span>
                    </label>
                  ))}
                  <div >
                   <label
                      class="flex items-center gap-3 p-3 border rounded-xl cursor-pointer hover:bg-gray-50"
                    >
                      <input
                        type="radio"
                        id={`${q.question.id}-other`}
                        name={q.question.id}
                        value="other"
                        required
                        checked={isOtherSelected}
                        onChange={()=>handleRadioChange(q.question.id,'other')}
                        class="w-5 h-5 text-blue-600 focus:ring-blue-500"
                      />
                      <span className="font-bold text-black">
                        Otra
                      </span>
                    </label>

                    {isOtherOpen && (
                       <input
                      type="text"
                      id={q.question.id}
                      placeholder="Especifique su respuesta"
                      value={answers[q.question.id] || ''}
                      onChange={(e)=>handleOtherTextChange(q.question.id,e.target.value)}
                      autoFocus
                      className="block w-full p-2 text-gray-900 border border-gray-300 rounded-lg bg-gray-50 text-xs focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                    />
                    )}                  
                    </div>                  
                  
                </fieldset>
              );

            default:
              break;
          }
        })}
       <button type="submit" class="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 me-2 mb-2 dark:bg-blue-600 dark:hover:bg-blue-700 focus:outline-none dark:focus:ring-blue-800">Submit</button>
      </form>
    </div>
  );
};

export default Form;
