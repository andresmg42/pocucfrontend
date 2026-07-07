import { useLayoutEffect, useRef, useState } from "react";
import ConfirmationModal from "../../auxiliarcomponents/ConfirmationModal";
import OptionQuestions from "./OptionQuestions";
import SubQuestionModal from "./SubQuestionModal";

const Question = ({
  question,
  category,
  subcategory,
  index,
  inputTypeLabels,
  editingField,
  isMoved,
  shouldScroll,
  startInlineEdit,
  applyInlineEdit,
  updateQuestion,
  handleAddSubQuestion,
  handleAddOption,
  handleRemoveOption,
  handleRemoveSubQuestion,
  handleUpdateQuestion,
  handleDeleteQuestion,
  onMove,
  isFirst,
  isLast,
}) => {
  const [isOptionOpen, setIsOptionOpen] = useState(false);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [isSubQuestionOpen, setIsSubQuestionOpen] = useState(false);
  const containerRef = useRef(null);

  useLayoutEffect(() => {
    if (!shouldScroll) return;
    const node = containerRef.current;
    if (!node) return;

    const rect = node.getBoundingClientRect();
    const targetTop =
      window.scrollY + rect.top - (window.innerHeight / 2 - rect.height / 2);
    const clampedTop = Math.max(0, targetTop);
    window.scrollTo({ top: clampedTop, behavior: "auto" });
  }, [shouldScroll]);

  return (
    <div
      ref={containerRef}
      className="rounded-2xl border border-slate-200 bg-slate-50/60 p-4 shadow-sm transition-all duration-200"
    >
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div className="flex items-center gap-3">
          <span className="rounded-full border border-slate-200 bg-white px-3 py-1 text-xs font-semibold text-slate-500">
            {question.position}
          </span>
          <div className="flex flex-col">
            <button
              type="button"
              disabled={isFirst}
              className="rounded-t cursor-pointer border border-slate-200 bg-white px-2 py-1 text-[10px] font-semibold text-slate-600 transition hover:border-slate-300 hover:text-slate-900 disabled:cursor-not-allowed disabled:text-slate-300"
              onClick={(event) => {
                event.stopPropagation();
                onMove(category, subcategory, index, "up");
              }}
            >
              ▲
            </button>
            <button
              type="button"
              disabled={isLast}
              className="rounded-b cursor-pointer border border-t-0 border-slate-200 bg-white px-2 py-1 text-[10px] font-semibold text-slate-600 transition hover:border-slate-300 hover:text-slate-900 disabled:cursor-not-allowed disabled:text-slate-300"
              onClick={(event) => {
                event.stopPropagation();
                onMove(category, subcategory, index, "down");
              }}
            >
              ▼
            </button>
          </div>
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
        <div className="flex items-center gap-3">
          <button
            type="button"
            className="inline-flex h-8 w-8 items-center justify-center rounded-full border border-slate-200 bg-white text-slate-500 transition hover:border-slate-300 hover:text-slate-900 cursor-pointer"
            aria-label="Actualizar pregunta"
            onClick={(event) => {
              event.stopPropagation();
              handleUpdateQuestion(category, subcategory, question);
            }}
          >
            <svg
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="h-4 w-4"
              aria-hidden="true"
            >
              <path d="M21 2v6h-6" />
              <path d="M3 12a9 9 0 0 1 15-6l3 3" />
              <path d="M3 22v-6h6" />
              <path d="M21 12a9 9 0 0 1-15 6l-3-3" />
            </svg>
          </button>
          <button
            type="button"
            className="inline-flex cursor-pointer h-8 w-8 items-center justify-center rounded-full border border-rose-200 bg-rose-50 text-rose-500 transition hover:border-rose-300 hover:text-rose-700"
            aria-label="Eliminar pregunta"
            onClick={(event) => {
              event.stopPropagation();
              setIsDeleteOpen(true);
            }}
          >
            <svg
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="h-4 w-4"
              aria-hidden="true"
            >
              <path d="M3 6h18" />
              <path d="M8 6V4h8v2" />
              <path d="M19 6l-1 14H6L5 6" />
              <path d="M10 11v6" />
              <path d="M14 11v6" />
            </svg>
          </button>
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
            {question.options.map((option, optionIndex) => {
              const optionId =
                option && typeof option === "object" ? option.id : option;
              const optionLabel =
                option && typeof option === "object"
                  ? option.description
                  : String(option ?? "");

              return (
                <div
                  key={optionId ?? `option-${optionIndex}`}
                  className="flex items-center justify-between rounded-lg border border-slate-100 bg-slate-50 px-3 py-2 text-sm"
                >
                  <span className="text-slate-700">{optionLabel}</span>
                  <button
                    type="button"
                    className="text-xs font-semibold uppercase tracking-[0.2em] text-rose-500"
                    onClick={(event) => {
                      event.stopPropagation();
                      handleRemoveOption(
                        category,
                        subcategory,
                        question.id,
                        optionId,
                      );
                    }}
                  >
                    Quitar
                  </button>
                </div>
              );
            })}
          </div>
        )}
        <div className="mt-3 flex">
          <button
            type="button"
            className="rounded-full cursor-pointer border border-slate-200 bg-white px-3 py-1 text-xs font-semibold text-slate-600"
            onClick={(event) => {
              event.stopPropagation();
              setIsOptionOpen(true);
            }}
          >
            +
          </button>
        </div>
      </div>

      {question.question_type !== "unique_response" && (
        <div className="mt-4 rounded-xl border border-slate-200 bg-white p-3">
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-400">
            Subpreguntas
          </p>
          {(question.sub_questions || []).length === 0 ? (
            <p className="mt-2 text-sm text-slate-400">Sin subpreguntas.</p>
          ) : (
            <div className="mt-2 space-y-2">
              {question.sub_questions.map((sub, subIndex) => (
                <div
                  key={sub.id ?? `sub-${subIndex}`}
                  className="rounded-lg border border-slate-100 bg-slate-50 px-3 py-2 text-sm"
                >
                  <div className="flex items-start gap-3">
                    <button
                      type="button"
                      className="text-xs font-semibold uppercase tracking-[0.2em] text-rose-500"
                      onClick={(event) => {
                        event.stopPropagation();
                        handleRemoveSubQuestion(
                          category,
                          subcategory,
                          question.id,
                          sub.id,
                        );
                      }}
                    >
                      QUITAR
                    </button>
                    <div className="flex-1">
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
                  </div>
                </div>
              ))}
            </div>
          )}
          <div className="mt-3 flex">
            <button
              type="button"
              className="rounded-full cursor-pointer border border-slate-200 bg-white px-3 py-1 text-xs font-semibold text-slate-600"
              onClick={(event) => {
                event.stopPropagation();
                setIsSubQuestionOpen(true);
              }}
            >
              +
            </button>
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
      <ConfirmationModal
        isOpen={isDeleteOpen}
        onClose={() => setIsDeleteOpen(false)}
        onConfirm={() => {
          setIsDeleteOpen(false);
          handleDeleteQuestion(category, subcategory, question.id);
        }}
        title="Eliminar pregunta"
        message="Esta accion eliminara la pregunta y sus subpreguntas."
      />
      <SubQuestionModal
        isOpen={isSubQuestionOpen}
        onClose={() => setIsSubQuestionOpen(false)}
        onCreate={(data) =>
          handleAddSubQuestion(category, subcategory, question, data)
        }
      />
    </div>
  );
};

export default Question;
