import { useState, useEffect, useRef } from "react";
import {
  ArrowLeft,
  Database,
  Grid3x3,
  ListChecks,
  RefreshCw,
} from "lucide-react";
import { toast } from "sonner";
import { DndProvider } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";
import QuestionCard from "./QuestionCard";
import QuestionBankModal from "./QuestionBankModal";
import CategorySubcategoryFilter from "./CategorySubcategoryFilter";
import api from "../../services/apiAdmin";

export default function FormBuilder({ survey, onClose }) {
  const [questions, setQuestions] = useState([]);
  // const [loading, setLoading] = useState(true);
  const [showBankModal, setShowBankModal] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [selectedSubcategory, setSelectedSubcategory] = useState(null);
  const [showFilterWarning, setShowFilterWarning] = useState(false);
  const [subQuestionsToDelete, setSubQuestionsToDelete] = useState({});
  const questionRefs = useRef({});
  const [isReordering, setIsReordering] = useState(false);
  const [initialLoading, setInitialLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(false);
  const [refresh, setRefresh] = useState(false);
  const [options, setOptions] = useState([]);

  useEffect(() => {
    loadQuestions(true);
    loadOptions();
  }, [survey.id]);

  useEffect(() => {
    loadQuestions();
    loadOptions();
  }, [refresh]);

  useEffect(() => {
    async function Reordering() {
      if (questions.length === 0) return;

      try {
        const res = await api.question.reorderQuestions(questions);

        console.log("response reorder", res.data);
      } catch (error) {
        console.error(
          "an unexpected error ocurred in questions reordering ",
          error,
        );
      }
    }

    Reordering();
  }, [isReordering]);

  const loadOptions = async () => {
    try {
      const result = await api.option.getOptions();
      const options = result?.data || [];
      console.log("options uploaded from the backend", options);
      setOptions(options);
    } catch (error) {
      console.error("Error loading options:", error);
    } finally {
      setLoadingOptions(false);
    }
  };

  const loadQuestions = async (isInitial = false) => {
    try {
      isInitial ? setInitialLoading(true) : setActionLoading(true);
      const result = await api.question.getBySurvey(survey.id);
      console.log("questions from backend", result.data);
      setQuestions(result.data);
    } catch (error) {
      console.error("Error loading questions:", error);
      toast.error("Error loading questions");
    } finally {
      isInitial ? setInitialLoading(false) : setActionLoading(false);
    }
  };

  const handleAddMatrixQuestion = () => {
    if (!selectedCategory || !selectedSubcategory) {
      setShowFilterWarning(true);
      toast.error("Please select a category and subcategory first");
      return;
    }

    setShowFilterWarning(false);
    // Calculate next position
    const maxPosition =
      questions.length > 0 ? Math.max(...questions.map((q) => q.position)) : 0;

    const newQuestion = {
      id: `temp-${Date.now()}`,
      subcategory: selectedSubcategory,
      code: "",
      question_type: "matrix_parent",
      description: "",
      parent_question: null,
      survey: [survey.id],
      options: [],
      position: maxPosition + 1,
      sub_questions: [],
      is_required: true,
      input_type: "NUM",
      isNew: true,
    };

    setQuestions([...questions, newQuestion]);
  };

  const handleAddUniqueResponseQuestion = () => {
    if (!selectedCategory || !selectedSubcategory) {
      setShowFilterWarning(true);
      toast.error("Please select a category and subcategory first");
      return;
    }

    setShowFilterWarning(false);
    // Calculate next position
    const maxPosition =
      questions.length > 0 ? Math.max(...questions.map((q) => q.position)) : 0;

    const newQuestion = {
      id: `temp-${Date.now()}`,
      subcategory: selectedSubcategory,
      code: "",
      question_type: "unique_response",
      description: "",
      parent_question: null,
      survey: [survey.id],
      options: [],
      position: maxPosition + 1,
      sub_questions: [],
      is_required: true,
      input_type: "NUM",
      isNew: true,
    };

    setQuestions([...questions, newQuestion]);
  };

  const handleSaveQuestion = async (question) => {
    const { isNew, sub_questions, id, ...questionDataRaw } = question;

    const newOptions = questionDataRaw.options?.map((opt) => opt.id) || [];

    const questionData = {
      ...questionDataRaw,
      options: newOptions,
      subcategory: questionDataRaw.subcategory?.id,
    };

    try {
      if (question.isNew || typeof question.id === "string") {
        // Create new question
        console.log("question data", questionData);
        const { data: savedQuestion } = await api.question.create(questionData);

        // Create subquestions if any
        if (question.sub_questions && question.sub_questions.length > 0) {
          for (const subQ of question.sub_questions) {
            const { isNew: subIsNew, id, ...subQData } = subQ;
            console.log("subquestion data", subQData);
            const { data: createdSubQ } = await api.question.create({
              ...subQData,
              parent_question: savedQuestion.id,
              subcategory: subQData.subcategory?.id,
            });
          }
        }
        toast.success("Question created successfully");
      } else {
        // Delete subquestions before update or create new ones
        const subQuestionsForThisOne = subQuestionsToDelete[id] || [];
        for (const subQuestionId of subQuestionsForThisOne) {
          console.log("subquestionID", subQuestionId);
          if (String(subQuestionId).startsWith("temp-")) continue;

          await api.question.delete(subQuestionId);
        }

        setSubQuestionsToDelete((prev) => ({ ...prev, [id]: [] }));

        // Update existing question

        const { data: updatedQuestion } = await api.question.update(
          id,
          questionData,
        );
        for (const subQRaw of question.sub_questions) {
          const { isNew: subIsNew, id: subId, ...subQDataRaw } = subQRaw;
          const subQ = {
            ...subQDataRaw,
            subcategory: subQDataRaw.subcategory?.id,
            parent_question: id,
          };
          if (subIsNew) {
            const { data: savedSubQuestion } = await api.question.create(subQ);
          } else {
            const { data: updatedSubQuestion } = await api.question.update(
              subId,
              subQ,
            );
          }
        }
        toast.success("Question updated successfully");
      }
      // await loadQuestions();
    } catch (error) {
      console.error("Error saving question:", error);

      if (error.response?.data?.non_field_errors) {
        const message = error.response.data.non_field_errors[0];
        toast.error(`Error saving question: ${message}`);
        return;
      }

      if (!error.response) {
        toast.error("Network error, please check your connection.");
        return;
      }

      toast.error("Error saving question");
    }
  };

  const handleDeleteQuestion = async (questionId) => {
    if (typeof questionId === "string" && questionId.startsWith("temp-")) {
      // Delete unsaved question
      setQuestions(questions.filter((q) => q.id !== questionId));
      return;
    }

    if (window.confirm("Are you sure you want to delete this question?")) {
      try {
        await api.question.delete(questionId);
        toast.success("Question deleted successfully");
        await loadQuestions();
      } catch (error) {
        console.error("Error deleting question:", error);
        toast.error("Error deleting question");
      }
    }
  };

  const handleAddFromBank = (selectedQuestions) => {
    // Calculate the next position
    const maxPosition =
      questions.length > 0 ? Math.max(...questions.map((q) => q.position)) : 0;

    const timestamp = Date.now();

    const questionsToAdd = selectedQuestions.map((q, index) => ({
      ...q,
      id: `temp-bank-${timestamp}-${index}`,
      survey: [survey.id],
      position: maxPosition + index + 1,
      isNew: true,
      sub_questions: q.sub_questions.map((sub_q, subIndex) => ({
        ...sub_q,
        survey: [survey.id],
        id: `temp-bank-${timestamp}-${subIndex}`,
        isNew: true,
      })),
    }));

    setQuestions((prev) => [...prev, ...questionsToAdd]);
    setShowBankModal(false);
    toast.success(`Added ${selectedQuestions.length} question(s) from bank`);
  };

  const handleUpdateQuestion = (updatedQuestion) => {
    setQuestions(
      questions.map((q) => (q.id === updatedQuestion.id ? updatedQuestion : q)),
    );
  };

  const selectedCategoryId = selectedCategory?.id ?? null;
  const selectedSubcategoryId = selectedSubcategory?.id ?? null;

  const getFilteredQuestions = (list, categoryId, subcategoryId) => {
    return list.filter((question) => {
      if (!categoryId && !subcategoryId) return true;
      const questionSubcategoryId = question.subcategory?.id ?? null;
      const questionCategoryId = question.subcategory?.category ?? null;

      if (categoryId && subcategoryId) {
        return (
          questionCategoryId === categoryId &&
          questionSubcategoryId === subcategoryId
        );
      }

      if (categoryId) {
        return questionCategoryId === categoryId;
      }

      return questionSubcategoryId === subcategoryId;
    });
  };

  const filteredQuestions = getFilteredQuestions(
    questions,
    selectedCategoryId,
    selectedSubcategoryId,
  );

  const moveQuestionById = (questionId, direction) => {
    const currentFiltered = getFilteredQuestions(
      questions,
      selectedCategoryId,
      selectedSubcategoryId,
    );
    const currentIndex = currentFiltered.findIndex((q) => q.id === questionId);
    const targetIndex = currentIndex + direction;

    if (currentIndex === -1 || targetIndex < 0) return;
    if (targetIndex >= currentFiltered.length) return;

    const targetId = currentFiltered[targetIndex].id;
    const updatedQuestions = [...questions];
    const fromIndex = updatedQuestions.findIndex((q) => q.id === questionId);
    const toIndex = updatedQuestions.findIndex((q) => q.id === targetId);

    if (fromIndex === -1 || toIndex === -1) return;

    [updatedQuestions[fromIndex], updatedQuestions[toIndex]] = [
      updatedQuestions[toIndex],
      updatedQuestions[fromIndex],
    ];

    const reorderedWithPositions = updatedQuestions.map((q, idx) => ({
      ...q,
      position: idx + 1,
    }));

    setQuestions(reorderedWithPositions);

    setIsReordering((prev) => !prev);

    setTimeout(() => {
      const element = questionRefs.current[questionId];
      if (element) {
        element.scrollIntoView({ behavior: "smooth", block: "nearest" });
      }
    }, 50);
  };

  const handleMoveQuestionUp = (questionId) => {
    moveQuestionById(questionId, -1);
  };

  const handleMoveQuestionDown = (questionId) => {
    moveQuestionById(questionId, 1);
  };

  if (initialLoading) {
    return (
      <div className="fixed inset-0 bg-white z-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red-700 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading form builder...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex h-screen">
      {/* Category/Subcategory Filter */}
      <div
        className={`bg-white w-80 border-b border-gray-200 px-6 py-4 ${showFilterWarning ? "ring-2 ring-red-500" : ""}`}
      >
        <CategorySubcategoryFilter
          selectedCategory={selectedCategory}
          selectedSubcategory={selectedSubcategory}
          onCategoryChange={setSelectedCategory}
          onSubcategoryChange={setSelectedSubcategory}
        />

        {showFilterWarning && (
          <p className="text-red-600 text-sm mt-2">
            ⚠️ Please select a category and subcategory before adding questions
          </p>
        )}
      </div>

      {/* Main Content */}
      <div className="flex-1 bg-gray-50  overflow-hidden flex flex-col">
        {/* Header */}
        <div className="bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <button
              onClick={onClose}
              className="flex cursor-pointer items-center gap-2 text-gray-600 hover:text-gray-900 transition-colors"
            >
              <ArrowLeft size={20} />
              Back to Surveys
            </button>
            <div className="h-6 w-px bg-gray-300"></div>
            <div>
              <h1 className="text-xl font-bold text-gray-900">{survey.name}</h1>
              <p className="text-sm text-gray-500">Form Builder</p>
            </div>
          </div>

          <div className="flex gap-10">
            <button>
              <RefreshCw
                onClick={() => setRefresh((prev) => !prev)}
                className="cursor-pointer"
              />
            </button>

            <button
              onClick={() => setShowBankModal(true)}
              className="flex cursor-pointer items-center gap-2 bg-white border-2 border-red-700 text-red-700 px-4 py-2 rounded-lg hover:bg-red-50 transition-colors"
            >
              <Database size={20} />+ Add from Bank
            </button>
          </div>
        </div>

        {/* Questions List */}
        <DndProvider backend={HTML5Backend}>
          <div className="flex-1 overflow-y-auto px-6 py-6 relative">
            {actionLoading && (
              <div className="absolute inset-0 bg-white/50 z-10 flex items-center justify-center">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-red-700" />
              </div>
            )}
            <div className="max-w-4xl mx-auto space-y-4">
              {filteredQuestions.length === 0 ? (
                <div className="text-center py-12 bg-white rounded-lg border-2 border-dashed border-gray-300">
                  <p className="text-gray-500 mb-4">
                    No questions yet. Start building your form!
                  </p>
                  <div className="flex justify-center gap-4">
                    <button
                      onClick={handleAddUniqueResponseQuestion}
                      className="inline-flex items-center gap-2 bg-red-700 text-white px-4 py-2 rounded-lg hover:bg-red-800 transition-colors"
                    >
                      <ListChecks size={20} />
                      Add Unique Response
                    </button>
                    <button
                      onClick={handleAddMatrixQuestion}
                      className="inline-flex items-center gap-2 bg-white border-2 border-red-700 text-red-700 px-4 py-2 rounded-lg hover:bg-red-50 transition-colors"
                    >
                      <Grid3x3 size={20} />
                      Add Matrix Question
                    </button>
                  </div>
                </div>
              ) : (
                <>
                  {filteredQuestions.map((question, index) => (
                    <QuestionCard
                      key={question.id}
                      setRef={(el) => (questionRefs.current[question.id] = el)}
                      question={question}
                      globalOptions={options}
                      questions={questions}
                      index={index}
                      totalQuestions={filteredQuestions.length}
                      refresh={refresh}
                      onSave={handleSaveQuestion}
                      onDelete={handleDeleteQuestion}
                      onUpdate={handleUpdateQuestion}
                      onMoveUp={handleMoveQuestionUp}
                      onMoveDown={handleMoveQuestionDown}
                      onDeleteSubQuestions={setSubQuestionsToDelete}
                    />
                  ))}

                  {/* Add New Question Buttons */}
                  <div className="flex justify-center gap-4 py-4">
                    <button
                      onClick={handleAddUniqueResponseQuestion}
                      className="flex items-center gap-2 bg-white border-2 border-gray-300 text-gray-700 px-6 py-3 rounded-lg hover:bg-gray-50 hover:border-red-700 hover:text-red-700 transition-colors"
                    >
                      <ListChecks size={20} />+ Add Unique Response
                    </button>
                    <button
                      onClick={handleAddMatrixQuestion}
                      className="flex items-center gap-2 bg-white border-2 border-gray-300 text-gray-700 px-6 py-3 rounded-lg hover:bg-gray-50 hover:border-red-700 hover:text-red-700 transition-colors"
                    >
                      <Grid3x3 size={20} />+ Add Matrix Question
                    </button>
                  </div>
                  <div className="h-50"></div>
                </>
              )}
            </div>
          </div>
        </DndProvider>

        {/* Question Bank Modal */}
        {showBankModal && (
          <QuestionBankModal
            onClose={() => setShowBankModal(false)}
            onAddQuestions={handleAddFromBank}
            surveyId={survey.id}
          />
        )}
      </div>
    </div>
  );
}
