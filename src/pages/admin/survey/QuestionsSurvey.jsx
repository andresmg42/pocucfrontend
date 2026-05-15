import { useEffect, useMemo, useState } from "react";
import { useParams } from "react-router";
import api from "../../../api/user.api";
import Question from "../../../components/admin/survey/Question";

const INPUT_TYPE_LABELS = {
  NUM: "Numerico",
  STR: "Textual",
};

const QUESTIONS_TYPES = ["unique_response", "matrix_parent", "matrix_child"];

const newQuestionDraft = (category, subcategory) => ({
  id: `new-${Date.now()}-${Math.random().toString(16).slice(2)}`,
  code: "",
  question_type: "unique_response",
  description: "",
  parent_question: null,
  survey: [],
  options: [],
  sub_questions: [],
  is_required: true,
  input_type: "NUM",
  position: 1,
  category,
  subcategory,
});

const QuestionsSurvey = () => {
  const { survey_id } = useParams();
  const [groupedQuestions, setGroupedQuestions] = useState({});
  const [loading, setLoading] = useState(true);
  const [editingField, setEditingField] = useState(null);
  const [dragState, setDragState] = useState(null);
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [showBank, setShowBank] = useState(false);
  const [bankQuestions, setBankQuestions] = useState([]);
  const [bankDraft, setBankDraft] = useState({
    description: "",
    question_type: "unique_response",
    input_type: "NUM",
  });
  const [targetCategory, setTargetCategory] = useState("");
  const [targetSubcategory, setTargetSubcategory] = useState("");
  const [draftQuestion, setDraftQuestion] = useState(null);

  useEffect(() => {
    const fetchQuestions = async () => {
      try {
        const response = await api.get(
          `question/get_questions_by_survey_cpanel?survey_id=${survey_id}`,
        );
        setGroupedQuestions(response.data || {});
        console.log("questions cpanel:", response.data);
      } catch (error) {
        console.error("Error loading questions", error);
      } finally {
        setLoading(false);
      }
    };

    if (survey_id) {
      fetchQuestions();
    }
  }, [survey_id]);

  const categories = useMemo(
    () => Object.keys(groupedQuestions || {}),
    [groupedQuestions],
  );

  useEffect(() => {
    if (!categories.length) return;

    const firstCategory = categories[0];
    const firstSubcategory = Object.keys(
      groupedQuestions[firstCategory] || {},
    )[0];
    setTargetCategory((prev) => prev || firstCategory);
    setTargetSubcategory((prev) => prev || firstSubcategory || "");
  }, [categories, groupedQuestions]);

  const totalQuestions = useMemo(() => {
    return categories.reduce((sum, category) => {
      const subcats = groupedQuestions[category] || {};
      return (
        sum +
        Object.values(subcats).reduce(
          (subSum, list) => subSum + (list?.length || 0),
          0,
        )
      );
    }, 0);
  }, [categories, groupedQuestions]);

  const updateQuestion = (category, subcategory, questionId, updater) => {
    setGroupedQuestions((prev) => {
      const next = {
        ...prev,
        [category]: {
          ...(prev[category] || {}),
        },
      };
      const list = [...(next[category][subcategory] || [])];
      const index = list.findIndex((item) => item.id === questionId);
      if (index === -1) return prev;
      list[index] = updater(list[index]);
      next[category][subcategory] = list;
      return next;
    });
  };

  const handleDragStart = (category, subcategory, index) => {
    setDragState({ category, subcategory, index });
  };

  const handleDrop = (category, subcategory, index) => {
    if (!dragState) return;

    setGroupedQuestions((prev) => {
      const next = {
        ...prev,
        [dragState.category]: {
          ...(prev[dragState.category] || {}),
        },
        [category]: {
          ...(prev[category] || {}),
        },
      };

      const sourceList = [
        ...(next[dragState.category][dragState.subcategory] || []),
      ];
      const [moved] = sourceList.splice(dragState.index, 1);
      if (!moved) return prev;

      next[dragState.category][dragState.subcategory] = sourceList;
      const targetList = [...(next[category][subcategory] || [])];
      const targetIndex = typeof index === "number" ? index : targetList.length;
      targetList.splice(targetIndex, 0, moved);

      next[category][subcategory] = targetList.map((item, idx) => ({
        ...item,
        position: idx + 1,
      }));

      return next;
    });

    setDragState(null);
  };

  const startInlineEdit = (payload, event) => {
    event?.stopPropagation?.();
    setEditingField(payload);
  };

  const applyInlineEdit = (
    category,
    subcategory,
    questionId,
    field,
    value,
    meta,
  ) => {
    updateQuestion(category, subcategory, questionId, (question) => {
      if (meta?.type === "option") {
        const options = question.options.map((option) =>
          option.id === meta.optionId
            ? { ...option, description: value }
            : option,
        );
        return { ...question, options };
      }

      if (meta?.type === "subquestion") {
        const subQuestions = question.sub_questions.map((sub) =>
          sub.id === meta.subId ? { ...sub, description: value } : sub,
        );
        return { ...question, sub_questions: subQuestions };
      }

      return { ...question, [field]: value };
    });
    setEditingField(null);
  };

  const handleAddOption = (category, subcategory, questionId, option) => {
    if (!option) return;

    updateQuestion(category, subcategory, questionId, (question) => {
      const options = question.options || [];
      const exists = options.some((item) => item.id === option.id);
      if (exists) return question;

      return {
        ...question,
        options: [...options, option],
      };
    });
  };

  const handleRemoveOption = (category, subcategory, questionId, optionId) => {
    updateQuestion(category, subcategory, questionId, (question) => ({
      ...question,
      options: (question.options || []).filter((item) => item.id !== optionId),
    }));
  };

  const handleAddSubQuestion = (category, subcategory, questionId) => {
    updateQuestion(category, subcategory, questionId, (question) => ({
      ...question,
      sub_questions: [
        ...(question.sub_questions || []),
        {
          id: `sub-${Date.now()}-${Math.random().toString(16).slice(2)}`,
          description: "",
          code: "",
          input_type: question.input_type,
          is_required: true,
        },
      ],
    }));
  };

  const openCreateForm = () => {
    const nextDraft = newQuestionDraft(targetCategory, targetSubcategory);
    setDraftQuestion(nextDraft);
    setShowCreateForm(true);
  };

  const handleCreateQuestion = (event) => {
    event.preventDefault();
    if (!draftQuestion?.category || !draftQuestion?.subcategory) return;

    setGroupedQuestions((prev) => {
      const next = {
        ...prev,
        [draftQuestion.category]: {
          ...(prev[draftQuestion.category] || {}),
        },
      };
      const list = [
        ...(next[draftQuestion.category][draftQuestion.subcategory] || []),
      ];
      list.push({
        ...draftQuestion,
        id: `draft-${Date.now()}`,
        position: list.length + 1,
      });
      next[draftQuestion.category][draftQuestion.subcategory] = list;
      return next;
    });

    setShowCreateForm(false);
    setDraftQuestion(null);
  };

  const handleAddBankQuestion = (event) => {
    event.preventDefault();
    if (!bankDraft.description.trim()) return;

    const newBankQuestion = {
      id: `bank-${Date.now()}`,
      description: bankDraft.description.trim(),
      question_type: bankDraft.question_type,
      input_type: bankDraft.input_type,
    };

    setBankQuestions((prev) => [...prev, newBankQuestion]);
    setBankDraft({
      description: "",
      question_type: "unique_response",
      input_type: "NUM",
    });
  };

  const handleInsertFromBank = (bankQuestionId) => {
    const bankQuestion = bankQuestions.find(
      (item) => item.id === bankQuestionId,
    );
    if (!bankQuestion) return;

    setGroupedQuestions((prev) => {
      const next = {
        ...prev,
        [targetCategory]: {
          ...(prev[targetCategory] || {}),
        },
      };
      const list = [...(next[targetCategory]?.[targetSubcategory] || [])];
      list.push({
        id: `bank-${Date.now()}`,
        code: "",
        question_type: bankQuestion.question_type,
        description: bankQuestion.description,
        parent_question: null,
        survey: [],
        options: [],
        sub_questions: [],
        is_required: true,
        input_type: bankQuestion.input_type,
        position: list.length + 1,
      });
      next[targetCategory][targetSubcategory] = list;
      return next;
    });
  };

  return (
    <div className="w-full min-w-0 rounded-2xl border border-slate-200 bg-white/90 p-6 shadow-lg shadow-slate-200/60">
      <div className="mb-6 flex flex-wrap items-center justify-between gap-4">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-400">
            Formularios
          </p>
          <h2 className="mt-2 text-2xl font-semibold text-slate-900">
            Preguntas del formulario
          </h2>
          <p className="mt-2 text-sm text-slate-500">
            Organiza las preguntas por categoria, subcategoria y arrastra para
            reordenar.
          </p>
        </div>
        <div className="flex flex-wrap items-center gap-3">
          <button
            type="button"
            onClick={() => setShowBank((prev) => !prev)}
            className="rounded-full border border-slate-200 bg-white px-4 py-2 text-xs font-semibold uppercase tracking-[0.3em] text-slate-600 transition hover:border-slate-300 hover:text-slate-900"
          >
            Banco
          </button>
          <button
            type="button"
            onClick={openCreateForm}
            className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-amber-200 bg-amber-50 text-lg font-semibold text-amber-600 shadow-sm transition hover:border-amber-300 hover:bg-amber-100"
            aria-label="Crear nueva pregunta"
          >
            +
          </button>
          <span className="rounded-full border border-amber-200 bg-amber-50 px-4 py-2 text-xs font-semibold uppercase tracking-[0.3em] text-amber-600">
            {loading ? "Cargando" : `${totalQuestions} items`}
          </span>
        </div>
      </div>

      {showBank && (
        <div className="mb-6 rounded-2xl border border-slate-200 bg-slate-50 p-5">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div>
              <h3 className="text-sm font-semibold uppercase tracking-[0.2em] text-slate-500">
                Banco de preguntas
              </h3>
              <p className="mt-1 text-sm text-slate-500">
                Selecciona una pregunta existente o crea una nueva para el
                banco.
              </p>
            </div>
            <div className="flex flex-wrap items-center gap-3">
              <select
                className="rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm text-slate-700"
                onChange={(event) => handleInsertFromBank(event.target.value)}
                defaultValue=""
              >
                <option value="" disabled>
                  Agregar desde el banco
                </option>
                {bankQuestions.map((item) => (
                  <option key={item.id} value={item.id}>
                    {item.description}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <form
            onSubmit={handleAddBankQuestion}
            className="mt-4 grid gap-3 md:grid-cols-[2fr_1fr_1fr_auto]"
          >
            <input
              type="text"
              value={bankDraft.description}
              onChange={(event) =>
                setBankDraft((prev) => ({
                  ...prev,
                  description: event.target.value,
                }))
              }
              placeholder="Nueva pregunta para el banco"
              className="rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm"
            />
            <select
              className="rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm"
              value={bankDraft.question_type}
              onChange={(event) =>
                setBankDraft((prev) => ({
                  ...prev,
                  question_type: event.target.value,
                }))
              }
            >
              {QUESTIONS_TYPES.map((type) => (
                <option key={type} value={type}>
                  {type}
                </option>
              ))}
            </select>
            <select
              className="rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm"
              value={bankDraft.input_type}
              onChange={(event) =>
                setBankDraft((prev) => ({
                  ...prev,
                  input_type: event.target.value,
                }))
              }
            >
              <option value="NUM">Numerico</option>
              <option value="STR">Textual</option>
            </select>
            <button
              type="submit"
              className="rounded-lg bg-slate-900 px-4 py-2 text-sm font-semibold text-white"
            >
              Guardar
            </button>
          </form>
        </div>
      )}

      {showCreateForm && draftQuestion && (
        <form
          onSubmit={handleCreateQuestion}
          className="mb-8 rounded-2xl border border-slate-200 bg-white p-5"
        >
          <div className="flex flex-wrap items-center justify-between gap-4">
            <h3 className="text-sm font-semibold uppercase tracking-[0.2em] text-slate-500">
              Nueva pregunta
            </h3>
            <button
              type="button"
              onClick={() => setShowCreateForm(false)}
              className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-400"
            >
              Cerrar
            </button>
          </div>
          <div className="mt-4 grid gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <label className="text-xs uppercase tracking-[0.2em] text-slate-400">
                Categoria
              </label>
              <select
                className="w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm"
                value={draftQuestion.category}
                onChange={(event) =>
                  setDraftQuestion((prev) => ({
                    ...prev,
                    category: event.target.value,
                  }))
                }
              >
                {categories.map((category) => (
                  <option key={category} value={category}>
                    {category}
                  </option>
                ))}
              </select>
            </div>
            <div className="space-y-2">
              <label className="text-xs uppercase tracking-[0.2em] text-slate-400">
                Subcategoria
              </label>
              <select
                className="w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm"
                value={draftQuestion.subcategory}
                onChange={(event) =>
                  setDraftQuestion((prev) => ({
                    ...prev,
                    subcategory: event.target.value,
                  }))
                }
              >
                {(groupedQuestions[draftQuestion.category]
                  ? Object.keys(groupedQuestions[draftQuestion.category])
                  : []
                )
                  .filter(Boolean)
                  .map((subcat) => (
                    <option key={subcat} value={subcat}>
                      {subcat}
                    </option>
                  ))}
              </select>
            </div>
            <div className="space-y-2">
              <label className="text-xs uppercase tracking-[0.2em] text-slate-400">
                Codigo
              </label>
              <input
                className="w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm"
                value={draftQuestion.code}
                onChange={(event) =>
                  setDraftQuestion((prev) => ({
                    ...prev,
                    code: event.target.value,
                  }))
                }
              />
            </div>
            <div className="space-y-2">
              <label className="text-xs uppercase tracking-[0.2em] text-slate-400">
                Tipo
              </label>
              <select
                className="w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm"
                value={draftQuestion.question_type}
                onChange={(event) =>
                  setDraftQuestion((prev) => ({
                    ...prev,
                    question_type: event.target.value,
                  }))
                }
              >
                {QUESTIONS_TYPES.map((type) => (
                  <option key={type} value={type}>
                    {type}
                  </option>
                ))}
              </select>
            </div>
            <div className="space-y-2">
              <label className="text-xs uppercase tracking-[0.2em] text-slate-400">
                Input
              </label>
              <select
                className="w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm"
                value={draftQuestion.input_type}
                onChange={(event) =>
                  setDraftQuestion((prev) => ({
                    ...prev,
                    input_type: event.target.value,
                  }))
                }
              >
                <option value="NUM">Numerico</option>
                <option value="STR">Textual</option>
              </select>
            </div>
            <div className="space-y-2">
              <label className="text-xs uppercase tracking-[0.2em] text-slate-400">
                Requerida
              </label>
              <select
                className="w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm"
                value={draftQuestion.is_required ? "yes" : "no"}
                onChange={(event) =>
                  setDraftQuestion((prev) => ({
                    ...prev,
                    is_required: event.target.value === "yes",
                  }))
                }
              >
                <option value="yes">Si</option>
                <option value="no">No</option>
              </select>
            </div>
          </div>
          <div className="mt-4 space-y-2">
            <label className="text-xs uppercase tracking-[0.2em] text-slate-400">
              Descripcion
            </label>
            <textarea
              className="w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm"
              rows={3}
              value={draftQuestion.description}
              onChange={(event) =>
                setDraftQuestion((prev) => ({
                  ...prev,
                  description: event.target.value,
                }))
              }
            />
          </div>
          <div className="mt-4 flex flex-wrap items-center gap-3">
            <button
              type="submit"
              className="rounded-lg bg-slate-900 px-4 py-2 text-sm font-semibold text-white"
            >
              Guardar pregunta
            </button>
            <p className="text-xs text-slate-400">
              Puedes reordenarla con arrastrar y soltar.
            </p>
          </div>
        </form>
      )}

      {loading && (
        <div className="rounded-2xl border border-dashed border-slate-200 bg-slate-50/80 px-6 py-16 text-center text-slate-500">
          Cargando preguntas...
        </div>
      )}

      {!loading && categories.length === 0 && (
        <div className="rounded-2xl border border-dashed border-slate-200 bg-slate-50/80 px-6 py-16 text-center text-slate-500">
          No hay preguntas registradas.
        </div>
      )}

      {!loading &&
        categories.map((category) => (
          <div key={category} className="mb-8">
            <div className="mb-4 flex items-center justify-between">
              <h3 className="text-lg font-semibold text-slate-900">
                {category}
              </h3>
            </div>
            <div className="space-y-6">
              {Object.entries(groupedQuestions[category] || {}).map(
                ([subcategory, list]) => (
                  <div
                    key={subcategory}
                    className="rounded-2xl border border-slate-200 bg-white p-4"
                    onDragOver={(event) => event.preventDefault()}
                    onDrop={() => handleDrop(category, subcategory)}
                  >
                    <div className="mb-3 flex flex-wrap items-center justify-between gap-3">
                      <div>
                        <p className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-400">
                          Subcategoria
                        </p>
                        <h4 className="text-base font-semibold text-slate-800">
                          {subcategory}
                        </h4>
                      </div>
                      <div className="flex items-center gap-2 text-xs text-slate-500">
                        {list.length} preguntas
                      </div>
                    </div>

                    <div className="space-y-3">
                      {list.map((question, index) => (
                        <Question
                          key={question.id}
                          question={question}
                          category={category}
                          subcategory={subcategory}
                          index={index}
                          inputTypeLabels={INPUT_TYPE_LABELS}
                          editingField={editingField}
                          onDragStart={handleDragStart}
                          onDrop={handleDrop}
                          startInlineEdit={startInlineEdit}
                          applyInlineEdit={applyInlineEdit}
                          updateQuestion={updateQuestion}
                          handleAddSubQuestion={handleAddSubQuestion}
                          handleAddOption={handleAddOption}
                          handleRemoveOption={handleRemoveOption}
                        />
                      ))}
                    </div>
                  </div>
                ),
              )}
            </div>
          </div>
        ))}
    </div>
  );
};

export default QuestionsSurvey;
