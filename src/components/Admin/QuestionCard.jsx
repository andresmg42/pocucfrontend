import { useState, useEffect, useRef } from "react";
import {
  Trash2,
  Save,
  Plus,
  X,
  ChevronUp,
  ChevronDown,
  GripVertical,
} from "lucide-react";
import { toast } from "sonner";
import { useDrag, useDrop } from "react-dnd";
import api from "../../services/apiAdmin";

// Draggable subquestion component
function SubQuestion({
  subQuestion,
  index,
  isEditing,
  onChange,
  onRemove,
  onMove,
  parentCode,
}) {
  const displayCode = `${parentCode}.${index + 1}`;
  const subQuestionRef = useRef(null);

  const [{ isDragging }, drag] = useDrag({
    type: "SUBQUESTION",
    item: { index },
    collect: (monitor) => ({
      isDragging: monitor.isDragging(),
    }),
    canDrag: isEditing,
  });

  const [, drop] = useDrop({
    accept: "SUBQUESTION",
    hover: (draggedItem, monitor) => {
      if (!subQuestionRef.current) {
        return;
      }

      const dragIndex = draggedItem.index;
      const hoverIndex = index;

      if (dragIndex === hoverIndex) {
        return;
      }

      const hoverBoundingRect = subQuestionRef.current?.getBoundingClientRect();
      const hoverMiddleY =
        (hoverBoundingRect.bottom - hoverBoundingRect.top) / 2;
      const clientOffset = monitor.getClientOffset();
      const hoverClientY = clientOffset.y - hoverBoundingRect.top;

      if (dragIndex < hoverIndex && hoverClientY < hoverMiddleY) {
        return;
      }

      if (dragIndex > hoverIndex && hoverClientY > hoverMiddleY) {
        return;
      }

      onMove(dragIndex, hoverIndex);
      draggedItem.index = hoverIndex;
    },
    canDrop: () => isEditing,
  });

  return (
    <div
      ref={(node) => {
        subQuestionRef.current = node;
        if (isEditing) {
          drag(drop(node));
        }
      }}
      className={`bg-gray-50 p-3 rounded-lg transition-opacity ${isDragging ? "opacity-50" : "opacity-100"}`}
    >
      {isEditing ? (
        <div className="flex items-center gap-2">
          <div className="cursor-move text-gray-400 hover:text-red-700 transition-colors">
            <GripVertical size={16} />
          </div>
          <input
            type="text"
            value={displayCode}
            readOnly
            className="w-20 px-2 py-1 text-sm border border-gray-300 rounded bg-gray-100 text-gray-500 cursor-not-allowed"
            title="Code is auto-generated based on order"
          />

          <input
            type="text"
            value={subQuestion.description}
            onChange={(e) =>
              onChange(subQuestion.id, "description", e.target.value)
            }
            className="flex-1 px-2 py-1 text-sm border border-gray-300 rounded focus:ring-2 focus:ring-red-500 focus:border-transparent"
            placeholder="Subquestion description"
          />

          <button
            onClick={() => onRemove(subQuestion.id)}
            className="text-red-600 hover:text-red-800"
          >
            <X size={16} />
          </button>
        </div>
      ) : (
        <div className="flex items-center gap-2">
          <span className="text-xs font-semibold text-gray-600">
            {displayCode}
          </span>
          <span className="text-sm text-gray-800">
            {subQuestion.description}
          </span>
        </div>
      )}
    </div>
  );
}

export default function QuestionCard({
  question,
  index,
  totalQuestions,
  onSave,
  onDelete,
  onUpdate,
  onMoveUp,
  onMoveDown,
  setRef,
}) {
  const [isEditing, setIsEditing] = useState(question.isNew || false);
  const [editedQuestion, setEditedQuestion] = useState({ ...question });
  const [options, setOptions] = useState([]);
  const [loadingOptions, setLoadingOptions] = useState(true);
  const [showCreateOptionModal, setShowCreateOptionModal] = useState(false);
  const [newOptionName, setNewOptionName] = useState("");
  const [creatingOption, setCreatingOption] = useState(false);

  useEffect(() => {
    loadOptions();
  }, []);

  const loadOptions = async () => {
    try {
      const result = await api.option.list();
      setOptions(result.data);
    } catch (error) {
      console.error("Error loading options:", error);
    } finally {
      setLoadingOptions(false);
    }
  };

  const handleCreateOption = async () => {
    if (!newOptionName.trim()) {
      toast.error("Please enter an option name");
      return;
    }

    try {
      setCreatingOption(true);
      const result = await api.option.create({
        description: newOptionName.trim(),
      });
      const newOption = result.data;
      // Add to options list
      setOptions([...options, newOption]);
      // Automatically select the new option for this question
      const currentOptions = editedQuestion.options || [];
      handleFieldChange("options", [...currentOptions, newOption]);
      toast.success("Option created successfully");
      setShowCreateOptionModal(false);
      setNewOptionName("");
    } catch (error) {
      console.error("Error creating option:", error);
      toast.error("Error creating option");
    } finally {
      setCreatingOption(false);
    }
  };

  const handleFieldChange = (field, value) => {
    const updated = { ...editedQuestion, [field]: value };
    setEditedQuestion(updated);
    onUpdate(updated);
  };

  const handleAddSubQuestion = () => {
    const currentSubQuestions = editedQuestion.sub_questions || [];
    const nextPosition = currentSubQuestions.length + 1;

    const newSubQuestion = {
      id: `temp-sub-${Date.now()}`,
      subcategory: editedQuestion.subcategory,
      code: `${editedQuestion.code}.${nextPosition}`,
      question_type: "matrix_child",
      description: "",
      parent_question: editedQuestion.id,
      survey: [...editedQuestion.survey],
      options: [],
      position: nextPosition,
      is_required: editedQuestion.is_required,
      input_type: editedQuestion.input_type,
      isNew: true,
    };

    handleFieldChange("sub_questions", [
      ...currentSubQuestions,
      newSubQuestion,
    ]);
  };

  const handleMoveSubQuestion = (fromIndex, toIndex) => {
    const updatedSubQuestions = [...editedQuestion.sub_questions];
    const [movedItem] = updatedSubQuestions.splice(fromIndex, 1);
    updatedSubQuestions.splice(toIndex, 0, movedItem);

    // Update positions and codes based on new order
    const reorderedWithPositions = updatedSubQuestions.map((sq, idx) => ({
      ...sq,
      position: idx + 1,
      code: `${editedQuestion.code}.${idx + 1}`,
    }));

    handleFieldChange("sub_questions", reorderedWithPositions);
  };

  const handleRemoveSubQuestion = (subQuestionId) => {
    const filteredSubQuestions = editedQuestion.sub_questions.filter(
      (sq) => sq.id !== subQuestionId,
    );

    // Recalculate positions and codes after removal
    const reorderedWithPositions = filteredSubQuestions.map((sq, idx) => ({
      ...sq,
      position: idx + 1,
      code: `${editedQuestion.code}.${idx + 1}`,
    }));

    handleFieldChange("sub_questions", reorderedWithPositions);
  };

  const handleSubQuestionChange = (subQuestionId, field, value) => {
    const updatedSubQuestions = editedQuestion.sub_questions.map((sq) =>
      sq.id === subQuestionId ? { ...sq, [field]: value } : sq,
    );
    handleFieldChange("sub_questions", updatedSubQuestions);
  };

  const handleToggleOption = (optionId) => {
    const currentOptions = editedQuestion.options || [];
    const optionIds = currentOptions.map((o) => o.id || o);
    if (optionIds.includes(optionId)) {
      handleFieldChange(
        "options",
        currentOptions.filter((o) => (o.id || o) !== optionId),
      );
    } else {
      const option = options.find((o) => o.id === optionId);
      handleFieldChange("options", [...currentOptions, option]);
    }
  };

  const handleSave = () => {
    // Validation
    if (!editedQuestion.code.trim()) {
      alert("Please enter a question code");
      return;
    }
    if (!editedQuestion.description.trim()) {
      alert("Please enter a question description");
      return;
    }

    onSave(editedQuestion);
    setIsEditing(false);
  };

  const getQuestionTypeLabel = (type) => {
    switch (type) {
      case "unique_response":
        return "Unique Response";
      case "matrix_parent":
        return "Matrix (with subquestions)";
      case "matrix_child":
        return "Matrix Child";
      default:
        return type;
    }
  };

  return (
    <div
      ref={setRef}
      className="bg-white rounded-lg border-2 border-gray-200 p-6 hover:border-gray-300 transition-all"
    >
      {/* Question Header */}
      <div className="flex items-start gap-4 mb-4">
        {/* Up/Down Buttons */}
        <div className="flex-shrink-0 flex flex-col gap-1 mt-1">
          <button
            onClick={() => onMoveUp(question.id)}
            disabled={index === 0}
            className={`p-1 rounded transition-colors ${
              index === 0
                ? "text-gray-300 cursor-not-allowed"
                : "text-gray-600 hover:text-red-700 hover:bg-red-50"
            }`}
            title="Move up"
          >
            <ChevronUp size={20} />
          </button>
          <button
            onClick={() => onMoveDown(question.id)}
            disabled={index === totalQuestions - 1}
            className={`p-1 rounded transition-colors ${
              index === totalQuestions - 1
                ? "text-gray-300 cursor-not-allowed"
                : "text-gray-600 hover:text-red-700 hover:bg-red-50"
            }`}
            title="Move down"
          >
            <ChevronDown size={20} />
          </button>
        </div>

        <div className="flex-1">
          {/* Question Number and Type */}
          <div className="flex items-center gap-3 mb-3">
            <span className="text-sm font-semibold text-gray-500">
              Question {index + 1}
            </span>

            {isEditing ? (
              <select
                value={editedQuestion.question_type}
                onChange={(e) => {
                  handleFieldChange("question_type", e.target.value);
                  // Clear subquestions if changing from matrix_parent to other type
                  if (e.target.value !== "matrix_parent") {
                    handleFieldChange("sub_questions", []);
                  }
                }}
                className="text-sm px-3 py-1 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
              >
                <option value="unique_response">Unique Response</option>
                <option value="matrix_parent">
                  Matrix (with subquestions)
                </option>
              </select>
            ) : (
              <span className="text-sm px-3 py-1 bg-gray-100 rounded-lg text-gray-700">
                {getQuestionTypeLabel(editedQuestion.question_type)}
              </span>
            )}
          </div>

          {/* Question Code */}
          <div className="mb-3">
            <label className="block text-xs font-medium text-gray-600 mb-1">
              Code *
            </label>
            {isEditing ? (
              <input
                type="text"
                value={editedQuestion.code}
                onChange={(e) => handleFieldChange("code", e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                placeholder="e.g., A, B, C.1"
              />
            ) : (
              <p className="text-sm font-semibold text-gray-800">
                {editedQuestion.code}
              </p>
            )}
          </div>

          {/* Question Description */}
          <div className="mb-4">
            <label className="block text-xs font-medium text-gray-600 mb-1">
              Question *
            </label>
            {isEditing ? (
              <textarea
                value={editedQuestion.description}
                onChange={(e) =>
                  handleFieldChange("description", e.target.value)
                }
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent resize-none"
                rows={2}
                placeholder="Enter your question here..."
              />
            ) : (
              <p className="text-base text-gray-900">
                {editedQuestion.description}
              </p>
            )}
          </div>

          {/* Options (only for non-matrix_child questions) */}
          {editedQuestion.question_type !== "matrix_child" && (
            <div className="mb-4">
              <label className="block text-xs font-medium text-gray-600 mb-2">
                Options
              </label>
              {isEditing ? (
                <div className="space-y-2 bg-gray-50 p-3 rounded-lg">
                  {loadingOptions ? (
                    <p className="text-sm text-gray-500">Loading options...</p>
                  ) : (
                    options.map((option) => {
                      const currentOptionIds = (
                        editedQuestion.options || []
                      ).map((o) => o.id || o);
                      const isSelected = currentOptionIds.includes(option.id);
                      return (
                        <label
                          key={option.id}
                          className="flex items-center gap-2 cursor-pointer"
                        >
                          <input
                            type="checkbox"
                            checked={isSelected}
                            onChange={() => handleToggleOption(option.id)}
                            className="w-4 h-4 text-red-700 border-gray-300 rounded focus:ring-red-500"
                          />

                          <span className="text-sm text-gray-700">
                            {option.description}
                          </span>
                        </label>
                      );
                    })
                  )}
                  <button
                    onClick={() => setShowCreateOptionModal(true)}
                    className="text-xs flex items-center gap-1 text-red-700 hover:text-red-800"
                  >
                    <Plus size={14} />
                    Add New Option
                  </button>
                </div>
              ) : (
                <div className="space-y-1">
                  {editedQuestion.options &&
                  editedQuestion.options.length > 0 ? (
                    editedQuestion.options.map((option, idx) => (
                      <div
                        key={idx}
                        className="flex items-center gap-2 text-sm text-gray-700"
                      >
                        <div className="w-4 h-4 rounded-full border-2 border-gray-400"></div>
                        {option.description}
                      </div>
                    ))
                  ) : (
                    <p className="text-sm text-gray-500 italic">
                      No options selected
                    </p>
                  )}
                </div>
              )}
            </div>
          )}

          {/* Subquestions (only for matrix_parent) */}
          {editedQuestion.question_type === "matrix_parent" && (
            <div className="mt-4 pl-6 border-l-4 border-gray-200">
              <div className="flex items-center justify-between mb-2">
                <label className="block text-xs font-medium text-gray-600">
                  Subquestions
                </label>
                {isEditing && (
                  <button
                    onClick={handleAddSubQuestion}
                    className="text-xs flex items-center gap-1 text-red-700 hover:text-red-800"
                  >
                    <Plus size={14} />
                    Add Subquestion
                  </button>
                )}
              </div>

              <div className="space-y-2">
                {editedQuestion.sub_questions &&
                editedQuestion.sub_questions.length > 0 ? (
                  editedQuestion.sub_questions.map((subQ, subIdx) => (
                    <SubQuestion
                      key={subQ.id}
                      subQuestion={subQ}
                      index={subIdx}
                      isEditing={isEditing}
                      onChange={handleSubQuestionChange}
                      onRemove={handleRemoveSubQuestion}
                      onMove={handleMoveSubQuestion}
                      parentCode={editedQuestion.code}
                    />
                  ))
                ) : (
                  <p className="text-sm text-gray-500 italic">
                    No subquestions yet
                  </p>
                )}
              </div>
            </div>
          )}

          {/* Additional Settings */}
          {isEditing && (
            <div className="mt-4 pt-4 border-t border-gray-200 grid grid-cols-2 gap-4">
              <div>
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={editedQuestion.is_required}
                    onChange={(e) =>
                      handleFieldChange("is_required", e.target.checked)
                    }
                    className="w-4 h-4 text-red-700 border-gray-300 rounded focus:ring-red-500"
                  />

                  <span className="text-sm text-gray-700">Required</span>
                </label>
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-600 mb-1">
                  Input Type
                </label>
                <select
                  value={editedQuestion.input_type}
                  onChange={(e) =>
                    handleFieldChange("input_type", e.target.value)
                  }
                  className="w-full px-2 py-1 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                >
                  <option value="NUM">Numeric</option>
                  <option value="STR">Text</option>
                </select>
              </div>
            </div>
          )}
        </div>

        {/* Action Buttons */}
        <div className="flex-shrink-0 flex gap-2">
          {isEditing ? (
            <button
              onClick={handleSave}
              className="p-2 text-green-700 hover:bg-green-50 rounded-lg transition-colors"
              title="Save"
            >
              <Save size={20} />
            </button>
          ) : (
            <button
              onClick={() => setIsEditing(true)}
              className="p-2 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
              title="Edit"
            >
              ✏️
            </button>
          )}

          <button
            onClick={() => onDelete(question.id)}
            className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
            title="Delete"
          >
            <Trash2 size={20} />
          </button>
        </div>
      </div>

      {/* Create Option Modal */}
      {showCreateOptionModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-lg shadow-xl max-w-md w-full">
            <div className="flex items-center justify-between p-6 border-b border-gray-200">
              <h3 className="text-lg font-bold text-gray-900">
                Create New Option
              </h3>
              <button
                onClick={() => {
                  setShowCreateOptionModal(false);
                  setNewOptionName("");
                }}
                className="text-gray-400 hover:text-gray-600 transition-colors"
              >
                <X size={20} />
              </button>
            </div>

            <div className="p-6">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Option Name *
              </label>
              <input
                type="text"
                value={newOptionName}
                onChange={(e) => setNewOptionName(e.target.value)}
                onKeyPress={(e) => {
                  if (e.key === "Enter" && !creatingOption) {
                    handleCreateOption();
                  }
                }}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                placeholder="e.g., Excellent, Good, Average"
                autoFocus
              />
            </div>

            <div className="flex justify-end gap-3 p-6 border-t border-gray-200 bg-gray-50">
              <button
                onClick={() => {
                  setShowCreateOptionModal(false);
                  setNewOptionName("");
                }}
                className="px-4 py-2 text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleCreateOption}
                disabled={creatingOption}
                className="px-4 py-2 bg-red-700 text-white rounded-lg hover:bg-red-800 transition-colors disabled:bg-gray-300 disabled:cursor-not-allowed"
              >
                {creatingOption ? "Creating..." : "Create Option"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
