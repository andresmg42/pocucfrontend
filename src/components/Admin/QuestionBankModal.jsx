import { useState, useEffect } from "react";
import { X, Search } from "lucide-react";
import api from "../../services/api";

export default function QuestionBankModal({
  onClose,
  onAddQuestions,
  surveyId,
}) {
  const [questions, setQuestions] = useState([]);
  const [filteredQuestions, setFilteredQuestions] = useState([]);
  const [selectedQuestions, setSelectedQuestions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [categories, setCategories] = useState([]);
  const [subcategories, setSubcategories] = useState([]);
  const [filterCategory, setFilterCategory] = useState("");
  const [filterSubcategory, setFilterSubcategory] = useState("");

  useEffect(() => {
    loadData();
  }, []);

  useEffect(() => {
    applyFilters();
  }, [questions, searchTerm, filterCategory, filterSubcategory]);

  const loadData = async () => {
    try {
      setLoading(true);
      const [questionsData, categoriesData, subcategoriesData] =
        await Promise.all([
          api.question.getBank(),
          api.category.list(),
          api.subcategory.list(),
        ]);
      // Filter out questions that are already in this survey
      const availableQuestions = questionsData.filter(
        (q) => !q.survey || !q.survey.includes(surveyId),
      );
      setQuestions(availableQuestions);
      setCategories(categoriesData);
      setSubcategories(subcategoriesData);
    } catch (error) {
      console.error("Error loading question bank:", error);
    } finally {
      setLoading(false);
    }
  };

  const applyFilters = () => {
    let filtered = [...questions];

    // Search filter
    if (searchTerm) {
      filtered = filtered.filter(
        (q) =>
          q.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
          q.code.toLowerCase().includes(searchTerm.toLowerCase()),
      );
    }

    // Category filter
    if (filterCategory) {
      const categoryId = parseInt(filterCategory);
      const relevantSubcategoryIds = subcategories
        .filter((s) => s.category === categoryId)
        .map((s) => s.id);
      filtered = filtered.filter((q) =>
        relevantSubcategoryIds.includes(q.subcategory.id),
      );
    }

    // Subcategory filter
    if (filterSubcategory) {
      const subcategoryId = parseInt(filterSubcategory);
      filtered = filtered.filter((q) => q.subcategory.id === subcategoryId);
    }

    setFilteredQuestions(filtered);
  };

  const handleToggleQuestion = (question) => {
    const isSelected = selectedQuestions.find((q) => q.id === question.id);
    if (isSelected) {
      setSelectedQuestions(
        selectedQuestions.filter((q) => q.id !== question.id),
      );
    } else {
      setSelectedQuestions([...selectedQuestions, question]);
    }
  };

  const handleAddSelected = () => {
    if (selectedQuestions.length === 0) {
      alert("Please select at least one question");
      return;
    }
    onAddQuestions(selectedQuestions);
  };

  const getSubcategoriesForCategory = (categoryId) => {
    return subcategories.filter((s) => s.category === parseInt(categoryId));
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-lg shadow-xl max-w-4xl w-full max-h-[90vh] flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <div>
            <h2 className="text-2xl font-bold text-gray-900">Question Bank</h2>
            <p className="text-sm text-gray-500 mt-1">
              Select questions to add to your survey
            </p>
          </div>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors"
          >
            <X size={24} />
          </button>
        </div>

        {/* Filters */}
        <div className="p-6 border-b border-gray-200 space-y-4">
          {/* Search */}
          <div className="relative">
            <Search
              className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
              size={20}
            />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search questions by description or code..."
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
            />
          </div>

          {/* Category and Subcategory Filters */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-medium text-gray-600 mb-1">
                Filter by Category
              </label>
              <select
                value={filterCategory}
                onChange={(e) => {
                  setFilterCategory(e.target.value);
                  setFilterSubcategory("");
                }}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
              >
                <option value="">All Categories</option>
                {categories.map((category) => (
                  <option key={category.id} value={category.id}>
                    {category.name}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-medium text-gray-600 mb-1">
                Filter by Subcategory
              </label>
              <select
                value={filterSubcategory}
                onChange={(e) => setFilterSubcategory(e.target.value)}
                disabled={!filterCategory}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent disabled:bg-gray-100"
              >
                <option value="">All Subcategories</option>
                {filterCategory &&
                  getSubcategoriesForCategory(filterCategory).map(
                    (subcategory) => (
                      <option key={subcategory.id} value={subcategory.id}>
                        {subcategory.name}
                      </option>
                    ),
                  )}
              </select>
            </div>
          </div>
        </div>

        {/* Questions List */}
        <div className="flex-1 overflow-y-auto p-6">
          {loading ? (
            <div className="text-center py-12">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red-700 mx-auto mb-4"></div>
              <p className="text-gray-600">Loading questions...</p>
            </div>
          ) : filteredQuestions.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-gray-500">No questions found</p>
            </div>
          ) : (
            <div className="space-y-3">
              {filteredQuestions.map((question) => {
                const isSelected = selectedQuestions.find(
                  (q) => q.id === question.id,
                );
                return (
                  <div
                    key={question.id}
                    onClick={() => handleToggleQuestion(question)}
                    className={`p-4 border-2 rounded-lg cursor-pointer transition-all ${
                      isSelected
                        ? "border-red-700 bg-red-50"
                        : "border-gray-200 hover:border-gray-300"
                    }`}
                  >
                    <div className="flex items-start gap-3">
                      <input
                        type="checkbox"
                        checked={isSelected}
                        onChange={() => {}} // Handled by div onClick
                        className="mt-1 w-4 h-4 text-red-700 border-gray-300 rounded focus:ring-red-500"
                      />

                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <span className="text-xs font-semibold text-gray-600 bg-gray-100 px-2 py-1 rounded">
                            {question.code}
                          </span>
                          <span className="text-xs text-gray-500">
                            {question.subcategory.name}
                          </span>
                          <span className="text-xs px-2 py-1 bg-blue-100 text-blue-700 rounded">
                            {question.question_type === "unique_response"
                              ? "Unique"
                              : "Matrix"}
                          </span>
                        </div>
                        <p className="text-sm text-gray-900">
                          {question.description}
                        </p>
                        {question.sub_questions &&
                          question.sub_questions.length > 0 && (
                            <p className="text-xs text-gray-500 mt-1">
                              {question.sub_questions.length} subquestion(s)
                            </p>
                          )}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between p-6 border-t border-gray-200 bg-gray-50">
          <p className="text-sm text-gray-600">
            {selectedQuestions.length} question(s) selected
          </p>
          <div className="flex gap-3">
            <button
              onClick={onClose}
              className="px-4 py-2 text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
            >
              Cancel
            </button>
            <button
              onClick={handleAddSelected}
              disabled={selectedQuestions.length === 0}
              className="px-4 py-2 bg-red-700 text-white rounded-lg hover:bg-red-800 transition-colors disabled:bg-gray-300 disabled:cursor-not-allowed"
            >
              Add Selected Questions
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
