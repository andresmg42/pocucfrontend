import React, { useEffect } from "react";
import { replace, useNavigate, useParams } from "react-router";
import api from "../../api/user.api";
import { useState } from "react";
import toast from "react-hot-toast";

const Form = () => {
  const { category_id, surveysession_id, visit_id, survey_id,category_name } = useParams();
  const [questions, setQuestions] = useState([]);
  const [answers, setAnswers] = useState({});
  const [openTextFields, setOpenTextFields] = useState({});
  const [isCompleted,setIsCompleted]=useState();
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  function isAllDigits(str) {
    
    if (typeof str !== "string" || str.length === 0) {
      return false;
    }

    const digitRegex = /^\d+$/;
    return digitRegex.test(str);
  }

  useEffect(() => {
    
    async function initializeForm() {
      try {
        
        const completionResponse = await api.get(
          `category/category_completed?category_id=${category_id}&visit_id=${visit_id}`
        );

        
        if (completionResponse.data.is_completed) {
          
          toast.error("This section has already been completed.");
          
          setIsCompleted(true)
        }else{

          
          const questionsResponse = await api.get(
          `survey/get_survey/?surveysession_id=${surveysession_id}&category_id=${category_id}`
        );
        setQuestions(questionsResponse.data);

        }

       
        
      } catch (error) {
        console.error(
          "An unexpected error occurred while initializing the form",
          error
        );
      }
    }

    initializeForm();
  }, []);


  const handleRadioChange = (questionId, questionV, optionId) => {
    if (questionV == "other") {
      setOpenTextFields((prev) => ({ ...prev, [questionId]: true }));
      setAnswers((prev) => ({ ...prev, [questionId]: {} }));
    } else {
      setOpenTextFields((prev) => ({ ...prev, [questionId]: false }));
      setAnswers((prevAnswers) => {
        const isDigit = isAllDigits(questionV);
        return {
          ...prevAnswers,
          [questionId]: {
            numeric_value: isDigit ? questionV : null,
            textValue: !isDigit ? questionV : null,
            optionId: optionId,
            visitId: visit_id,
          },
        };
      });
    }
  };

  const handleOtherTextChange = (questionId, textValue) => {
    const isDigit = isAllDigits(textValue);
    setAnswers((prev) => ({
      ...prev,
      [questionId]: {
        optionId: "",
        numeric_value: isDigit ? textValue : null,
        textValue: !isDigit ? textValue : null,
        visitId: visit_id,
      },
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      console.log("answers", answers);

      setLoading(true);
      const res = await api.post("response/create/", answers);

      console.log("respuesta en el form", res);

      const targetPath = `/surveysession/${survey_id}/visits/${surveysession_id}/categories/${visit_id}`;
      toast.success("Survey saved successfully");
      navigate(-1);
    } catch (error) {
      console.log("error in handlesumbmit form", error);
      setLoading(false);
    } finally {
      setLoading(false);
    }
  };

  if(isCompleted) return (
    <div>Questions of Category {category_name} COMPLETED</div>
  )

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
              !q.options.some(
                (opt) =>
                  opt.description == answers[q.id]?.numeric_value ||
                  opt.description == answers[q.id]?.textValue
              ));
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
                        checked={
                          answers[q.id]?.numeric_value === option.description ||
                          answers[q.id]?.textValue === option.description
                        }
                        onChange={() =>
                          handleRadioChange(q.id, option.description, option.id)
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
                        onChange={() => handleRadioChange(q.id, "other", "")}
                        class="w-5 h-5 text-blue-600 focus:ring-blue-500"
                      />
                      <span className="font-bold text-black">Otra</span>
                    </label>

                    {isOtherOpen && (
                      <input
                        type="text"
                        id={q.id}
                        placeholder="Especifique su respuesta"
                        value={
                          answers[q.id]?.numeric_value ||
                          answers[q.id]?.textValue ||
                          ""
                        }
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
                          (opt) =>
                            opt.description ==
                              answers[sub_q.id]?.numeric_value ||
                            opt.description == answers[sub_q.id]?.textValue
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
                                handleRadioChange(
                                  sub_q.id,
                                  option.description,
                                  option.id
                                )
                              }
                              checked={
                                answers[sub_q.id]?.numeric_value ===
                                  option.description ||
                                answers[sub_q.id]?.textValue ===
                                  option.description
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
                              id={`${sub_q.id}-other`}
                              name={sub_q.id}
                              value="other"
                              required
                              checked={isOtherSelected}
                              onChange={() =>
                                handleRadioChange(sub_q.id, "other", "")
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
                              value={
                                answers[sub_q.id]?.numeric_value ||
                                answers[sub_q.id]?.textValue ||
                                ""
                              }
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
          Enviar
        </button>
      </form>
    </div>
  );
};

export default Form;
