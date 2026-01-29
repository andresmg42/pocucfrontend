import React, { useEffect } from "react";
import { useNavigate, useParams } from "react-router";
import api from "../../api/user.api";
import { useState } from "react";
import toast from "react-hot-toast";
import {
  getInitialState,
  saveStorageState,
} from "../../utils/storage_functions";
import UniqueResponseForm from "./UniqueResponseForm";
import MatrixParentForm from "./MatrixParentForm";

const Form2 = () => {
  const {
    category_id,
    surveysession_id,
    visit_id,
    survey_id,
    category_name,
    visit_number,
  } = useParams();

  const ANSWERS_STORAGE_KEY = `mySurveySessionData_${surveysession_id}`;

  const [commentTrigger, setCommentTrigger] = useState({});
  const [questions, setQuestions] = useState([]);
  const [answers, setAnswers] = useState(() =>
    getInitialState(ANSWERS_STORAGE_KEY, visit_id, "answer"),
  );
  const [comments, setComments] = useState(() =>
    getInitialState(ANSWERS_STORAGE_KEY, visit_id, "comment"),
  );
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
    saveStorageState(ANSWERS_STORAGE_KEY, visit_id, "answer", answers);
    saveStorageState(ANSWERS_STORAGE_KEY, visit_id, "comment", comments);
  }, [answers, comments]);

  useEffect(() => {
    async function initializeForm() {
      try {
        const completionResponse = await api.get(
          `category/category_completed?category_id=${category_id}&visit_id=${visit_id}`,
        );

        if (completionResponse.data.is_completed) {
          toast.error("This section has already been completed.");

          setIsCompleted(true);
        } else {
          const questionsResponse = await api.get(
            `survey/get_survey/?surveysession_id=${surveysession_id}&category_id=${category_id}`,
          );
          setQuestions(questionsResponse.data);
          setCommentTrigger(() => {
            const parent_questions = questionsResponse.data.filter((q) =>
              ["matrix_parent", "unique_response"].includes(q.question_type),
            );
            const triggers = {};
            parent_questions.map((q) => (triggers[q.id] = false));
            return triggers;
          });

          console.log("questions in form", questionsResponse.data);
        }
      } catch (error) {
        console.error(
          "An unexpected error occurred while initializing the form",
          error,
        );
      }
    }

    initializeForm();
  }, []);

  const handleRadioChange = (questionId, questionV, optionId) => {
    if (questionV == "other") {
      setOpenTextFields((prev) => ({ ...prev, [questionId]: true }));
      setAnswers((prev) => ({
        ...prev,
        [questionId]: {
          optionId: "",
          numeric_value: "6",
          textValue: null,
          visitId: visit_id,
        },
      }));
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
    setAnswers((prev) => ({
      ...prev,
      [questionId]: {
        optionId: "",
        numeric_value: null,
        textValue: textValue,
        visitId: visit_id,
      },
    }));
  };

  const handleOtherNumericChange = (questionId, numericValue) => {
    setAnswers((prev) => ({
      ...prev,
      [questionId]: {
        optionId: "",
        numeric_value: numericValue,
        textValue: null,
        visitId: visit_id,
      },
    }));
  };

  const handleCommentChange = (questionId, comment) => {
    setComments((prev) => ({
      ...prev,
      [questionId]: {
        visitId: visit_id,
        comment: comment,
      },
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const problemQuestions = questions.filter(
        (q) =>
          q.is_required &&
          q.question_type != "matrix_parent" &&
          !(q.id in answers),
      );
      if (problemQuestions.length === 0) {
        console.log("answers", answers);

        setLoading(true);

        // Get all question IDs from the current category (including sub-questions)
        const currentQuestionIds = new Set();
        questions.forEach((q) => {
          currentQuestionIds.add(q.id);
          if (q.sub_questions && q.sub_questions.length > 0) {
            q.sub_questions.forEach((sub_q) => currentQuestionIds.add(sub_q.id));
          }
        });

        // Filter answers to only include questions from the current category
        const validAnswers = Object.fromEntries(
          Object.entries(answers).filter(([key, value]) => {
            const questionId = parseInt(key);
            // Check if the question is in the current category and has valid data
            return (
              currentQuestionIds.has(questionId) &&
              value &&
              typeof value === "object" &&
              value.visitId
            );
          })
        );

        console.log('validated answers',validAnswers)

        const payLoad = {
          answers: validAnswers,
          comments: comments,
        };

        const res = await api.post("response/create/", payLoad);

        console.log("respuesta en el form", res);

        //setAnswers({});

        // setComments({});

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
            

            switch (q.question_type) {
              case "unique_response":
                return (
                  <UniqueResponseForm
                    q={q}
                    comments={comments}
                    answers={answers}
                    handleRadioChange={handleRadioChange}
                    handleOtherTextChange={handleOtherTextChange}
                    handleOtherNumericChange={handleOtherNumericChange}
                    setCommentTrigger={setCommentTrigger}
                    handleCommentChange={handleCommentChange}
                    openTextFields={openTextFields}
                    commentTrigger={commentTrigger}
                  />
                );

              case "matrix_parent":
                return (
                  <MatrixParentForm
                    q={q}
                    comments={comments}
                    answers={answers}
                    handleRadioChange={handleRadioChange}
                    handleOtherTextChange={handleOtherTextChange}
                    handleOtherNumericChange={handleOtherNumericChange}
                    setCommentTrigger={setCommentTrigger}
                    handleCommentChange={handleCommentChange}
                    openTextFields={openTextFields}
                    commentTrigger={commentTrigger}
                  />
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

export default Form2;
