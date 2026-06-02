import { useState, useEffect, useRef } from "react";
import { ArrowLeft, Database, Grid3x3, ListChecks } from "lucide-react";
import { toast } from "sonner";
import { DndProvider } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";
import QuestionCard from "./QuestionCard";
import QuestionBankModal from "./QuestionBankModal";
import CategorySubcategoryFilter from "./CategorySubcategoryFilter";
import api from "../../services/apiAdmin";

export default function FormBuilder({ survey, onClose }) {
  const [questions, setQuestions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showBankModal, setShowBankModal] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [selectedSubcategory, setSelectedSubcategory] = useState(null);
  const [showFilterWarning, setShowFilterWarning] = useState(false);
  const questionRefs = useRef({});

  useEffect(() => {
    loadQuestions();
  }, [survey.id]);

  const loadQuestions = async () => {
    try {
      setLoading(true);
      const result = await api.question.getBySurvey(survey.id);
      console.log("questions from backend", result.data);
      setQuestions(result.data);
    } catch (error) {
      console.error("Error loading questions:", error);
      toast.error("Error loading questions");
    } finally {
      setLoading(false);
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
    try {
      let savedQuestion;
      if (question.isNew || typeof question.id === "string") {
        // Create new question
        const { isNew, ...questionData } = question;
        savedQuestion = await api.question.create(questionData);
        // Create subquestions if any
        if (question.sub_questions && question.sub_questions.length > 0) {
          for (const subQ of question.sub_questions) {
            const { isNew: subIsNew, ...subQData } = subQ;
            const createdSubQ = await api.question.create({
              ...subQData,
              parent_question: savedQuestion.id,
              survey: [survey.id],
            });
          }
        }
        toast.success("Question created successfully");
      } else {
        // Update existing question
        savedQuestion = await api.question.update(question.id, question);
        toast.success("Question updated successfully");
      }
      await loadQuestions();
    } catch (error) {
      console.error("Error saving question:", error);
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

    const questionsToAdd = selectedQuestions.map((q, index) => ({
      ...q,
      id: `temp-bank-${Date.now()}-${index}`,
      survey: [...(q.survey || []), survey.id],
      position: maxPosition + index + 1,
      isNew: true,
    }));

    setQuestions([...questions, ...questionsToAdd]);
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

  if (loading) {
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
    <div className="fixed inset-0 bg-gray-50 z-50 overflow-hidden flex flex-col">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <button
            onClick={onClose}
            className="flex items-center gap-2 text-gray-600 hover:text-gray-900 transition-colors"
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

        <button
          onClick={() => setShowBankModal(true)}
          className="flex items-center gap-2 bg-white border-2 border-red-700 text-red-700 px-4 py-2 rounded-lg hover:bg-red-50 transition-colors"
        >
          <Database size={20} />+ Add from Bank
        </button>
      </div>

      {/* Category/Subcategory Filter */}
      <div
        className={`bg-white border-b border-gray-200 px-6 py-4 ${showFilterWarning ? "ring-2 ring-red-500" : ""}`}
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

      {/* Questions List */}
      <DndProvider backend={HTML5Backend}>
        <div className="flex-1 overflow-y-auto px-6 py-6">
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
                    index={index}
                    totalQuestions={filteredQuestions.length}
                    onSave={handleSaveQuestion}
                    onDelete={handleDeleteQuestion}
                    onUpdate={handleUpdateQuestion}
                    onMoveUp={handleMoveQuestionUp}
                    onMoveDown={handleMoveQuestionDown}
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
  );
}
