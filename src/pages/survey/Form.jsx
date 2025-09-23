import React, { useEffect } from "react";
import { useParams } from "react-router";
import api from "../../api/user.api";
import { useState } from "react";

const Form = () => {
  const { category_id, surveysession_id,visit_id } = useParams();
  const [questions, setQuestions] = useState([]);
  const [answers, setAnswers] = useState({});
  const [openTextFields, setOpenTextFields] = useState({});
  const [loading,setLoading]=useState(false)

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

    const handleRadioChange = (questionId, questionV,optionId) => {
    if (questionV == "other") {
      setOpenTextFields((prev) => ({ ...prev, [questionId]: true }));
      setAnswers((prev) => ({ ...prev, [questionId]: {} }));
    } else {
      setOpenTextFields((prev) => ({ ...prev, [questionId]: false }));
      setAnswers((prevAnswers) => ({
        ...prevAnswers,
        [questionId]: {
          numeric_value:questionV,
          optionId:optionId,
          visitId:visit_id
        },
      }));
    }
  };

  const handleOtherTextChange = (questionId, textValue) => {
    setAnswers((prev) => ({ ...prev, [questionId]: {
      optionId:'',
      numeric_value:textValue
    } }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {

      setLoading(true)
      const res=await api.post('response/create/',answers)
      console.log('respuesta en el form',res)

      
    } catch (error) {

      console.log('error in handlesumbmit form',error)
      setLoading(false)
      
    }
    finally{
      setLoading(false)
    }
  };

  return (
    <div className="flex  items-center justify-center">
      <form
        onSubmit={handleSubmit}
        class="w-full max-w-2xl bg-white shadow-lg rounded-2xl p-6 space-y-8"
      >
        {questions.map((q) => {
          const isOtherOpen = openTextFields[q.id];

          const isOtherSelected =
            isOtherOpen ||
            (answers[q.id] &&
              !q.options.some((opt) => opt.description == answers[q.id]?.numeric_value));
          switch (q.question_type) {
            case "unique_response":
              return (
                <fieldset key={q.id}>
                  <legend class="text-lg text-black text-left font-semibold mb-2">
                    {q.description}
                  </legend>

                  {q.options.map((option) => (
                    <label
                      key={option.id}
                      class="flex items-center gap-3 p-3 border rounded-xl cursor-pointer hover:bg-gray-50"
                    >
                      <input
                        type="radio"
                        id={option.id}
                        name={q.id}
                        value={option.description}
                        required
                        checked={answers[q.id]?.numeric_value === option.description}
                        onChange={() =>
                          handleRadioChange(q.id, option.description,option.id)
                        }
                        class="w-5 h-5 text-blue-600 focus:ring-blue-500"
                      />
                      <span className="font-bold text-black">
                        {option.description}
                      </span>
                    </label>
                  ))}
                  <div>
                    <label class="flex items-center gap-3 p-3 border rounded-xl cursor-pointer hover:bg-gray-50">
                      <input
                        type="radio"
                        id={`${q.id}-other`}
                        name={q.id}
                        value="other"
                        required
                        checked={isOtherSelected}
                        onChange={() => handleRadioChange(q.id, "other",'')}
                        class="w-5 h-5 text-blue-600 focus:ring-blue-500"
                      />
                      <span className="font-bold text-black">Otra</span>
                    </label>

                    {isOtherOpen && (
                      <input
                        type="text"
                        id={q.id}
                        placeholder="Especifique su respuesta"
                        value={answers[q.id]?.numeric_value || ""}
                        onChange={(e) =>
                          handleOtherTextChange(q.id, e.target.value)
                        }
                        required
                        autoFocus
                        className="block w-full p-2 text-gray-900 border border-gray-300 rounded-lg bg-gray-50 text-xs focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                      />
                    )}
                  </div>
                </fieldset>
              );

            case "matrix_parent":
              return (
                <fieldset key={q.id}>
                  <legend class="text-lg text-black text-left font-semibold mb-2">
                    {q.description}
                  </legend>

                  {q.sub_questions.map((sub_q) => {
                    const isOtherOpen = openTextFields[sub_q.id];
                    const isOtherSelected =
                      isOtherOpen ||
                      (answers[sub_q.id] &&
                        !q.options.some(
                          (opt) => opt.description == answers[sub_q.id]?.numeric_value
                        ));

                    return (
                      <fieldset key={sub_q.id} className="flex flex-wrap">
                        <legend class="text-lg text-black text-left font-semibold mb-2">
                          {sub_q.description}
                        </legend>

                        {q.options.map((option) => (
                          <label
                            key={option.id}
                            class="flex items-center gap-3 p-3 border rounded-xl cursor-pointer hover:bg-gray-50"
                          >
                            <input
                              type="radio"
                              id={option.id}
                              name={sub_q.id}
                              value={option.description}
                              required
                              onChange={() =>
                                handleRadioChange(sub_q.id, option.description,option.id)
                              }
                              checked={answers[sub_q.id]?.numeric_value === option.description}
                              class="w-5 h-5 text-blue-600 focus:ring-blue-500"
                            />
                            <span className="font-bold text-black">
                              {option.description}
                            </span>
                          </label>
                        ))}
                        <div>
                          <label class="flex items-center gap-3 p-3 border rounded-xl cursor-pointer hover:bg-gray-50">
                            <input
                              type="radio"
                              id={`${sub_q.id}-other`}
                              name={sub_q.id}
                              value="other"
                              required
                              checked={isOtherSelected}
                              onChange={() =>
                                handleRadioChange(sub_q.id, "other",'')
                              }
                              class="w-5 h-5 text-blue-600 focus:ring-blue-500"
                            />
                            <span className="font-bold text-black">Otra</span>
                          </label>

                          {isOtherOpen && (
                            <input
                              type="text"
                              id={sub_q.id}
                              placeholder="Especifique su respuesta"
                              value={answers[sub_q.id]?.numeric_value || ""}
                              onChange={(e) =>
                                handleOtherTextChange(sub_q.id, e.target.value)
                              }
                              required
                              autoFocus
                              className="block w-full p-2 text-gray-900 border border-gray-300 rounded-lg bg-gray-50 text-xs focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                            />
                          )}
                        </div>
                      </fieldset>
                    );
                  })}
                </fieldset>
              );

            default:
              break;
          }
        })}
        <button
          type="submit"
          class="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 me-2 mb-2 dark:bg-blue-600 dark:hover:bg-blue-700 focus:outline-none dark:focus:ring-blue-800"
        >
          Submit
        </button>
      </form>
    </div>
  );
};

export default Form;
