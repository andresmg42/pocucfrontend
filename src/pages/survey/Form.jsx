import React, { useEffect } from "react";
import { useParams } from "react-router";
import api from "../../api/user.api";
import { useState } from "react";

const Form = () => {
  const { category_id, surveysession_id } = useParams();
  const [questions, setQuestions] = useState([]);

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
                <fieldset key={q.question.id} class="space-y-3">
                  <legend class="text-lg text-black text-left font-semibold mb-2">
                    {q.question.description}
                  </legend>

                  <label class="flex items-center gap-3 p-3 border rounded-xl cursor-pointer hover:bg-gray-50">
                    <input
                      type="radio"
                      name="q1"
                      value="html"
                      required
                      class="w-5 h-5 text-blue-600 focus:ring-blue-500"
                    />
                    <span className="font-bold text-black">1</span>
                  </label>

                  <label class="flex items-center gap-3 p-3 border rounded-xl cursor-pointer hover:bg-gray-50">
                    <input
                      type="radio"
                      name="q1"
                      value="css"
                      class="w-5 h-5 text-blue-600 focus:ring-blue-500"
                    />
                    <span className="font-bold text-black" >2</span>
                  </label>

                  <label class="flex items-center gap-3 p-3 border rounded-xl cursor-pointer hover:bg-gray-50">
                    <input
                      type="radio"
                      name="q1"
                      value="javascript"
                      class="w-5 h-5 text-blue-600 focus:ring-blue-500"
                    />
                    <span className="font-bold text-black">3</span>
                  </label>
                  <label class="flex items-center gap-3 p-3 border rounded-xl cursor-pointer hover:bg-gray-50">
                    <input
                      type="radio"
                      name="q1"
                      value="javascript"
                      class="w-5 h-5 text-blue-600 focus:ring-blue-500"
                    />
                    <span className="font-bold text-black">4</span>
                  </label>
                  <label class="flex items-center gap-3 p-3 border rounded-xl cursor-pointer hover:bg-gray-50">
                    <input
                      type="radio"
                      name="q1"
                      value="javascript"
                      class="w-5 h-5 text-blue-600 focus:ring-blue-500"
                    />
                    <span className="font-bold text-black">5</span>
                  </label>
                  <label class="flex items-center gap-3 p-3 border rounded-xl cursor-pointer hover:bg-gray-50">
                    <input
                      type="radio"
                      name="q1"
                      value="javascript"
                      class="w-5 h-5 text-blue-600 focus:ring-blue-500"
                    />
                    <span className="font-bold text-black">mas</span>
                  </label>
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
