import { useState } from "react";
import OptionQuestions from "./OptionQuestions";

const Question = ({
  question,
  category,
  subcategory,
  index,
  inputTypeLabels,
  editingField,
  onDragStart,
  onDrop,
  startInlineEdit,
  applyInlineEdit,
  updateQuestion,
  handleAddSubQuestion,
  handleAddOption,
  handleRemoveOption,
}) => {
  const [isOptionOpen, setIsOptionOpen] = useState(false);

  return (
    <div
      draggable
      onDragStart={() => onDragStart(category, subcategory, index)}
      onDrop={(event) => {
        event.preventDefault();
        onDrop(category, subcategory, index);
      }}
      className="rounded-2xl border border-slate-200 bg-slate-50/60 p-4 shadow-sm"
    >
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div className="flex items-center gap-3">
          <span className="rounded-full border border-slate-200 bg-white px-3 py-1 text-xs font-semibold text-slate-500">
            {question.position}
          </span>
          <button
            type="button"
            className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-500"
            onClick={(event) =>
              startInlineEdit(
                {
                  type: "question",
                  id: question.id,
                  field: "code",
                  category,
                  subcategory,
                },
                event,
              )
            }
          >
            {question.code || "Codigo"}
          </button>
        </div>
        <div className="flex items-center gap-2">
          <span className="rounded-full border border-amber-200 bg-amber-50 px-3 py-1 text-xs font-semibold text-amber-600">
            {question.question_type}
          </span>
          <span className="rounded-full border border-slate-200 bg-white px-3 py-1 text-xs font-semibold text-slate-500">
            {inputTypeLabels[question.input_type] || question.input_type}
          </span>
        </div>
      </div>

      <div className="mt-3">
        {editingField?.id === question.id &&
        editingField?.field === "description" ? (
          <input
            autoFocus
            className="w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm"
            defaultValue={question.description}
            onBlur={(event) =>
              applyInlineEdit(
                category,
                subcategory,
                question.id,
                "description",
                event.target.value,
              )
            }
          />
        ) : (
          <button
            type="button"
            className="text-left text-sm text-slate-700"
            onClick={(event) =>
              startInlineEdit(
                {
                  type: "question",
                  id: question.id,
                  field: "description",
                  category,
                  subcategory,
                },
                event,
              )
            }
          >
            {question.description || "Descripcion"}
          </button>
        )}
      </div>

      <div className="mt-4 flex flex-wrap items-center gap-3 text-xs text-slate-500">
        <span>Requerida: {question.is_required ? "Si" : "No"}</span>
        <button
          type="button"
          className="rounded-full border border-slate-200 bg-white px-3 py-1 text-xs font-semibold text-slate-600"
          onClick={(event) => {
            event.stopPropagation();
            updateQuestion(category, subcategory, question.id, (item) => ({
              ...item,
              is_required: !item.is_required,
            }));
          }}
        >
          Cambiar requerido
        </button>
        {question.question_type !== "unique_response" && (
          <button
            type="button"
            className="rounded-full border border-slate-200 bg-white px-3 py-1 text-xs font-semibold text-slate-600"
            onClick={(event) => {
              event.stopPropagation();
              handleAddSubQuestion(category, subcategory, question.id);
            }}
          >
            + Subpregunta
          </button>
        )}
      </div>

      <div className="mt-4 rounded-xl border border-slate-200 bg-white p-3">
        <div className="flex items-center justify-between">
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-400">
            Opciones
          </p>
        </div>
        {(question.options || []).length === 0 ? (
          <p className="mt-2 text-sm text-slate-400">Sin opciones.</p>
        ) : (
          <div className="mt-2 space-y-2">
            {question.options.map((option) => (
              <div
                key={option.id}
                className="flex items-center justify-between rounded-lg border border-slate-100 bg-slate-50 px-3 py-2 text-sm"
              >
                <span className="text-slate-700">{option.description}</span>
                <button
                  type="button"
                  className="text-xs font-semibold uppercase tracking-[0.2em] text-rose-500"
                  onClick={(event) => {
                    event.stopPropagation();
                    handleRemoveOption(
                      category,
                      subcategory,
                      question.id,
                      option.id,
                    );
                  }}
                >
                  Quitar
                </button>
              </div>
            ))}
          </div>
        )}
        <div className="mt-3 flex">
          <button
            type="button"
            className="rounded-full border border-slate-200 bg-white px-3 py-1 text-xs font-semibold text-slate-600"
            onClick={(event) => {
              event.stopPropagation();
              setIsOptionOpen(true);
            }}
          >
            +
          </button>
        </div>
      </div>

      {question.question_type !== "unique_response" &&
        (question.sub_questions || []).length > 0 && (
          <div className="mt-4 rounded-xl border border-slate-200 bg-white p-3">
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-400">
              Subpreguntas
            </p>
            <div className="mt-2 space-y-2">
              {question.sub_questions.map((sub) => (
                <div
                  key={sub.id}
                  className="rounded-lg border border-slate-100 bg-slate-50 px-3 py-2 text-sm"
                >
                  {editingField?.type === "subquestion" &&
                  editingField?.subId === sub.id ? (
                    <input
                      autoFocus
                      className="w-full rounded-md border border-slate-200 bg-white px-2 py-1 text-sm"
                      defaultValue={sub.description}
                      onBlur={(event) =>
                        applyInlineEdit(
                          category,
                          subcategory,
                          question.id,
                          "sub_question",
                          event.target.value,
                          {
                            type: "subquestion",
                            subId: sub.id,
                          },
                        )
                      }
                    />
                  ) : (
                    <button
                      type="button"
                      className="text-left text-sm text-slate-700"
                      onClick={(event) =>
                        startInlineEdit(
                          {
                            type: "subquestion",
                            subId: sub.id,
                            id: question.id,
                            category,
                            subcategory,
                          },
                          event,
                        )
                      }
                    >
                      {sub.description || "Nueva subpregunta"}
                    </button>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

      <OptionQuestions
        isOpen={isOptionOpen}
        onClose={() => setIsOptionOpen(false)}
        onSelectOption={(option) =>
          handleAddOption(category, subcategory, question.id, option)
        }
      />
    </div>
  );
};

export default Question;
