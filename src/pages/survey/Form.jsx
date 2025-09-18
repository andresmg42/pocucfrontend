import React, { useEffect } from "react";
import { useParams } from "react-router";
import api from "../../api/user.api";
import { useState } from "react";

const Form = () => {
  const { category_id, surveysession_id } = useParams();
  const [questions, setQuestions] = useState([]);
  const[selectedValue,setSelectedValue]=useState('');
  const [otherValue,setOtherValue]=useState('');

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

  return (
    <div className="flex  items-center justify-center">
      <form
        action="/submit"
        method="post"
        class="w-full max-w-2xl bg-white shadow-lg rounded-2xl p-6 space-y-8"
      >
        {questions.map((q) => {
          switch (q.question.question_type) {
            case "unique_response":
              return (
                <fieldset key={q.question.id} class="space-y-0">
                  <legend class="text-lg text-black text-left font-semibold mb-2">
                    {q.question.description}
                  </legend>

                  <label class="flex items-center gap-3 p-3 border rounded-xl cursor-pointer hover:bg-gray-50">
                    <input
                      type="radio"
                      name={q.question.id}
                      value="1"
                      required
                      class="w-5 h-5 text-blue-600 focus:ring-blue-500"
                    />
                    <span className="font-bold text-black">1</span>
                  </label>

                  <label class="flex items-center gap-3 p-3 border rounded-xl cursor-pointer hover:bg-gray-50">
                    <input
                      type="radio"
                      name={q.question.id}
                      value="2"
                      class="w-5 h-5 text-blue-600 focus:ring-blue-500"
                    />
                    <span className="font-bold text-black">2</span>
                  </label>

                  <label class="flex items-center gap-3 p-3 border rounded-xl cursor-pointer hover:bg-gray-50">
                    <input
                      type="radio"
                      name={q.question.id}
                      value="3"
                      class="w-5 h-5 text-blue-600 focus:ring-blue-500"
                    />
                    <span className="font-bold text-black">3</span>
                  </label>
                  <label class="flex items-center gap-3 p-3 border rounded-xl cursor-pointer hover:bg-gray-50">
                    <input
                      type="radio"
                      name={q.question.id}
                      value="4"
                      class="w-5 h-5 text-blue-600 focus:ring-blue-500"
                    />
                    <span className="font-bold text-black">4</span>
                  </label>
                  <label class="flex items-center gap-3 p-3 border rounded-xl cursor-pointer hover:bg-gray-50">
                    <input
                      type="radio"
                      name={q.question.id}
                      value="5"
                      class="w-5 h-5 text-blue-600 focus:ring-blue-500"
                    />
                    <span className="font-bold text-black">5</span>
                  </label>
                  <label class="flex items-center gap-3 p-3 border rounded-xl cursor-pointer hover:bg-gray-50">
                    <input
                      type="radio"
                      name={q.question.id}
                      value="mas"
                      class="w-5 h-5 text-blue-600 focus:ring-blue-500"
                    />
                    <span className="font-bold text-black">mas</span>
                  </label>
                </fieldset>
              );
            case "multiple_option":
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
                        class="w-5 h-5 text-blue-600 focus:ring-blue-500"
                      />
                      <span className="font-bold text-black">
                        Otra
                      </span>
                    </label>

                  

                   
                    <input
                      type="text"
                      id={q.question.id}
                      placeholder="Otra?"
                      class="block w-full p-2 text-gray-900 border border-gray-300 rounded-lg bg-gray-50 text-xs focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                    />
                    </div>                  
                  
                </fieldset>
              );

            default:
              break;
          }
        })}
      </form>
    </div>
  );
};

export default Form;
