import React, { useEffect } from "react";
import { replace, useNavigate, useParams } from "react-router";
import api from "../../api/user.api";
import { useState } from "react";
import toast from "react-hot-toast";
import usePageStore from "../../stores/use-page-store";

const Form = () => {
  const { category_id, surveysession_id, visit_id, survey_id, category_name } =
    useParams();
  const { setVisitAddTriggerDisabled } = usePageStore();
  const [questions, setQuestions] = useState([]);
  const [answers, setAnswers] = useState({});
  const [openTextFields, setOpenTextFields] = useState({});
  const [isCompleted, setIsCompleted] = useState();
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

          setIsCompleted(true);
        } else {
          const questionsResponse = await api.get(
            `survey/get_survey/?surveysession_id=${surveysession_id}&category_id=${category_id}`
          );
          setQuestions(questionsResponse.data);

          console.log("questions in form", questionsResponse.data);
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
      // questions_required= questions.filter((q)=>q.is_required)
      // response_completed = questions_required.reduce((bool,q) => bool && q.id in answers,true)
      const problemQuestions = questions.filter(
        (q) =>
          q.is_required &&
          q.question_type != "matrix_parent" &&
          !(q.id in answers)
      );
      if (problemQuestions.length === 0) {
        console.log("answers", answers);

        setLoading(true);
        const res = await api.post("response/create/", answers);

        console.log("respuesta en el form", res);

        toast.success("Survey saved successfully");
        navigate(-1);
      } else {
        toast.error("Debes Completar todas las respuestas obligatorias");

        const firstProblem = problemQuestions[0];

        const element = document.getElementById(firstProblem.id);

        if (element) {
          element.scrollIntoView({ behavior: "smooth", block: "center" });
          element.classList.add("question-error-highlight");
        }
      }
    } catch (error) {
      console.log("error in handlesumbmit form", error);
      setLoading(false);
    } finally {
      setLoading(false);
    }
  };

  if (isCompleted)
    return <div>Questions of Category {category_name} COMPLETED</div>;

  return (
    <div className=" flex-1 h-screen   flex items-center  justify-center bg-[url('/formulario/formulario.png')] bg-cover bg-center bg-no-repeat">
      <div className="h-full w-full p-5 overflow-y-auto form-scrollbar">
        <style>{`
        .form-scrollbar::-webkit-scrollbar {
          display: none;
        }
        .form-scrollbar {
          -ms-overflow-style: none;  /* IE and Edge */
          scrollbar-width: none;  /* Firefox */
        }
      `}</style>

        
        <form
          onSubmit={handleSubmit}
          className="w-full mx-auto max-w-3xl bg-white shadow-2xl rounded-2xl p-6 md:p-10   border border-gray-100 h-fit"
        >
          <div className="text-center mb-4 md:mb-8">
            <div className="inline-block p-2 md:p-3 bg-blue-600 rounded-xl md:rounded-2xl mb-2 md:mb-4">
              <svg
                className="w-6 h-6 md:w-10 md:h-10 text-white"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                />
              </svg>
            </div>
            <h1 className="text-2xl md:text-4xl font-bold text-gray-800 mb-1 md:mb-2">
              Formulario de {category_name}
            </h1>
            <p className="text-sm md:text-base text-gray-600">
              Sus respuestas nos ayudan a mejorar la salud y bienestar de los
              estudiantes de UniValle
            </p>
          </div>

          {questions.map((q) => {
            const isOtherOpen = openTextFields[q.id];

            const isOtherSelected =
              isOtherOpen ||
              (answers[q.id] &&
                !q.options.some(
                  (opt) =>
                    opt.description === answers[q.id]?.numeric_value ||
                    opt.description === answers[q.id]?.textValue
                ));

            switch (q.question_type) {
              case "unique_response":
                return (
                  <fieldset
                    key={q.id}
                    className="pb-8 mb-8 border-b border-gray-200 last:border-b-0 last:mb-0 last:pb-0 space-y-3"
                  >
                    {/* Styled question text */}

                    <div className="flex gap-3">
                      {q.is_required && (
                        <legend className="text-red-700 font-bold text-lg">
                          *
                        </legend>
                      )}

                      <legend className="text-xl font-semibold text-gray-800 mb-4">
                        {`${q.code} ${q.description}`}
                      </legend>
                    </div>

                    {/* Options map */}
                    {q.options.map((option) => (
                      <label
                        key={option.id}
                        className="flex items-center gap-3 p-3.5 rounded-lg cursor-pointer transition-colors duration-200 hover:bg-blue-50 border border-transparent hover:border-blue-200"
                      >
                        <input
                          type="radio"
                          id={option.id}
                          name={q.id}
                          value={option.description}
                          required={q.is_required}
                          checked={
                            answers[q.id]?.numeric_value ===
                              option.description ||
                            answers[q.id]?.textValue === option.description
                          }
                          onChange={() =>
                            handleRadioChange(
                              q.id,
                              option.description,
                              option.id
                            )
                          }
                          // Styled radio button
                          className="w-5 h-5 text-blue-600 focus:ring-2 focus:ring-offset-1 focus:ring-blue-500"
                        />
                        <span className="font-medium text-gray-700">
                          {option.description}
                        </span>
                      </label>
                    ))}

                    {/* "Other" Option */}
                    <div>
                      <label className="flex items-center gap-3 p-3.5 rounded-lg cursor-pointer transition-colors duration-200 hover:bg-blue-50 border border-transparent hover:border-blue-200">
                        <input
                          type="radio"
                          id={`${q.id}-other`}
                          name={q.id}
                          value="other"
                          required={q.is_required}
                          checked={isOtherSelected}
                          onChange={() => handleRadioChange(q.id, "other", "")}
                          className="w-5 h-5 text-blue-600 focus:ring-2 focus:ring-offset-1 focus:ring-blue-500"
                        />
                        <span className="font-medium text-gray-700">mas</span>
                      </label>

                      {/* Indented "Other" text field */}
                      <div className="pl-10 mt-2">
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
                            required={q.is_required}
                            autoFocus
                            // Styled text input
                            className="block w-full p-3 text-gray-900 border border-gray-300 rounded-lg bg-gray-50 text-sm focus:ring-blue-500 focus:border-blue-500"
                          />
                        )}
                      </div>
                    </div>
                  </fieldset>
                );

              case "matrix_parent":
                return (
                  <fieldset
                    key={q.id}
                    className="pb-8 mb-8 border-b border-gray-200 last:border-b-0 last:mb-0 last:pb-0"
                  >
                    <div className="flex gap-3">
                      {q.is_required && (
                        <legend className="text-red-700 font-bold text-lg">
                          *
                        </legend>
                      )}
                      <legend className="text-xl font-semibold text-gray-800 mb-4">
                        {`${q.code} ${q.description}`}
                      </legend>
                    </div>

                    {/* Sub-questions map */}
                    {q.sub_questions.map((sub_q) => {
                      // Logic remains unchanged
                      const isOtherOpen = openTextFields[sub_q.id];
                      const isOtherSelected =
                        isOtherOpen ||
                        (answers[sub_q.id] &&
                          !q.options.some(
                            (opt) =>
                              opt.description ===
                                answers[sub_q.id]?.numeric_value ||
                              opt.description === answers[sub_q.id]?.textValue
                          ));

                      return (
                        // Sub-question fieldset
                        <fieldset
                          key={sub_q.id}
                          className="mt-6 pt-6 border-t border-gray-100 first:mt-0 first:pt-0 first:border-t-0"
                        >
                          <legend className="text-md font-medium text-gray-700 mb-3">
                            {sub_q.description}
                          </legend>

                          {/* Responsive wrapper for options */}
                          <div className="flex flex-wrap gap-2 md:gap-4 pl-0 md:pl-4">
                            {q.options.map((option) => (
                              <label
                                key={option.id}
                                className="flex items-center gap-3 p-3.5 rounded-lg cursor-pointer transition-colors duration-200 hover:bg-blue-50 border border-transparent hover:border-blue-200"
                              >
                                <input
                                  type="radio"
                                  id={option.id}
                                  name={sub_q.id}
                                  value={option.description}
                                  required={sub_q.is_required}
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
                                  className="w-5 h-5 text-blue-600 focus:ring-2 focus:ring-offset-1 focus:ring-blue-500"
                                />
                                <span className="font-medium text-gray-700">
                                  {option.description}
                                </span>
                              </label>
                            ))}
                            {/* "Other" option for matrix sub-question */}
                            <div>
                              <label className="flex items-center gap-3 p-3.5 rounded-lg cursor-pointer transition-colors duration-200 hover:bg-blue-50 border border-transparent hover:border-blue-200">
                                <input
                                  type="radio"
                                  id={`${sub_q.id}-other`}
                                  name={sub_q.id}
                                  value="other"
                                  required={sub_q.is_required}
                                  checked={isOtherSelected}
                                  onChange={() =>
                                    handleRadioChange(sub_q.id, "other", "")
                                  }
                                  className="w-5 h-5 text-blue-600 focus:ring-2 focus:ring-offset-1 focus:ring-blue-500"
                                />
                                <span className="font-medium text-gray-700">
                                  mas
                                </span>
                              </label>

                              <div className="pl-10 mt-2">
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
                                      handleOtherTextChange(
                                        sub_q.id,
                                        e.target.value
                                      )
                                    }
                                    required={sub_q.is_required}
                                    autoFocus
                                    className="block w-full p-3 text-gray-900 border border-gray-300 rounded-lg bg-gray-50 text-sm focus:ring-blue-500 focus:border-blue-500"
                                  />
                                )}
                              </div>
                            </div>
                          </div>
                        </fieldset>
                      );
                    })}
                  </fieldset>
                );

              default:
                return null;
            }
          })}

          <div className="w-full flex items-center justify-center pt-8">
            <button
              type="submit"
              className="text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-4 focus:ring-blue-300 font-medium rounded-full text-lg px-12 py-3.5 transition-all duration-200 ease-in-out shadow-md hover:shadow-lg"
            >
              Enviar
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Form;
