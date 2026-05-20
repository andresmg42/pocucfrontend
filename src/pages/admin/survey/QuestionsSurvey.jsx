import { useEffect, useMemo, useRef, useState } from "react";
import toast from "react-hot-toast";
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
  const [movedIds, setMovedIds] = useState([]);
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
  const moveTimeoutRef = useRef(null);
  const reorderTimeoutRef = useRef(null);
  const pendingReorderRef = useRef(null);

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

  const visibleCategory = targetCategory || categories[0] || "";
  const subcategoriesForVisible = useMemo(() => {
    if (!visibleCategory) return [];
    return Object.keys(groupedQuestions[visibleCategory] || {}).filter(Boolean);
  }, [groupedQuestions, visibleCategory]);

  const visibleSubcategory =
    targetSubcategory || subcategoriesForVisible[0] || "";

  const normalizeSubcategoryKey = (subcategory) => {
    if (!subcategory) return "";
    if (typeof subcategory === "string") return subcategory;
    return subcategory.name || "";
  };

  const updateQuestion = (category, subcategory, questionId, updater) => {
    setGroupedQuestions((prev) => {
      const subcategoryKey = normalizeSubcategoryKey(subcategory);
      const next = {
        ...prev,
        [category]: {
          ...(prev[category] || {}),
        },
      };
      const list = [...(next[category][subcategoryKey] || [])];
      const index = list.findIndex((item) => item.id === questionId);
      if (index === -1) return prev;
      list[index] = updater(list[index]);
      next[category][subcategoryKey] = list;
      return next;
    });
  };

  const getCategoryIdByName = (categoryName) => {
    const categoryGroups = groupedQuestions[categoryName] || {};
    const firstList = Object.values(categoryGroups)[0] || [];
    const firstItem = firstList[0];
    return firstItem?.category?.id ?? firstItem?.category_id ?? null;
  };

  const getSubcategoryIdByName = (categoryName, subcategoryName) => {
    const categoryGroups = groupedQuestions[categoryName] || {};
    const list = categoryGroups[subcategoryName] || [];
    const firstItem = list[0];
    return firstItem?.subcategory?.id ?? firstItem?.subcategory_id ?? null;
  };

  const resolveCategoryValue = (question, fallbackValue) => {
    if (question?.category?.id) return question.category.id;
    if (question?.category_id) return question.category_id;
    if (fallbackValue?.id) return fallbackValue.id;
    if (typeof fallbackValue === "string") {
      return getCategoryIdByName(fallbackValue);
    }
    return null;
  };

  const resolveSubcategoryValue = (question, category, fallbackValue) => {
    if (question?.subcategory?.id) return question.subcategory.id;
    if (question?.subcategory_id) return question.subcategory_id;
    if (fallbackValue?.id) return fallbackValue.id;
    if (typeof fallbackValue === "string") {
      return getSubcategoryIdByName(category, fallbackValue);
    }
    return null;
  };

  const resolveSurveyValue = (question) => {
    if (Array.isArray(question?.survey) && question.survey.length) {
      return question.survey.map((item) => (item?.id ? item.id : item));
    }
    if (survey_id) {
      const parsedSurveyId = Number(survey_id);
      return [Number.isFinite(parsedSurveyId) ? parsedSurveyId : survey_id];
    }
    return [];
  };

  const buildQuestionPayload = (question, category, subcategory) => {
    const options = Array.isArray(question?.options)
      ? question.options.map((option) => (option?.id ? option.id : option))
      : [];

    return {
      category: resolveCategoryValue(question, category),
      subcategory: resolveSubcategoryValue(question, category, subcategory),
      options,
      code: question?.code || "",
      question_type: question?.question_type || "unique_response",
      description: question?.description || "",
      parent_question: question?.parent_question?.id
        ? question.parent_question.id
        : question?.parent_question || null,
      survey: resolveSurveyValue(question),
      is_required: Boolean(question?.is_required),
      input_type: question?.input_type || "NUM",
      position: question?.position ?? 1,
    };
  };

  const removeQuestionFromList = (category, subcategory, questionId) => {
    setGroupedQuestions((prev) => {
      const subcategoryKey = normalizeSubcategoryKey(subcategory);
      const next = {
        ...prev,
        [category]: {
          ...(prev[category] || {}),
        },
      };
      next[category][subcategoryKey] = (
        next[category][subcategoryKey] || []
      ).filter((item) => item.id !== questionId);
      return next;
    });
  };

  const moveQuestion = (category, subcategory, index, direction) => {
    let moved = [];
    let updatedList = [];

    setGroupedQuestions((prev) => {
      const subcategoryKey = normalizeSubcategoryKey(subcategory);
      const next = {
        ...prev,
        [category]: {
          ...(prev[category] || {}),
        },
      };
      const list = [...(next[category][subcategoryKey] || [])];
      const targetIndex = direction === "up" ? index - 1 : index + 1;

      if (targetIndex < 0 || targetIndex >= list.length) {
        return prev;
      }

      const temp = list[index];
      list[index] = list[targetIndex];
      list[targetIndex] = temp;
      moved = [list[index].id, list[targetIndex].id];

      updatedList = list.map((item, idx) => ({
        ...item,
        position: idx + 1,
      }));

      next[category][subcategoryKey] = updatedList;

      return next;
    });

    if (moved.length) {
      if (moveTimeoutRef.current) {
        clearTimeout(moveTimeoutRef.current);
      }
      setMovedIds(moved);
      moveTimeoutRef.current = setTimeout(() => {
        setMovedIds([]);
      }, 350);
    }

    if (updatedList.length) {
      pendingReorderRef.current = { category, subcategory, list: updatedList };
      if (reorderTimeoutRef.current) {
        clearTimeout(reorderTimeoutRef.current);
      }
      reorderTimeoutRef.current = setTimeout(async () => {
        const pending = pendingReorderRef.current;
        if (!pending) return;

        const updates = pending.list
          .filter((item) => {
            const idValue = String(item?.id || "");
            return (
              idValue &&
              !idValue.startsWith("draft-") &&
              !idValue.startsWith("new-") &&
              !idValue.startsWith("bank-")
            );
          })
          .map((item) => {
            const payload = buildQuestionPayload(
              item,
              pending.category,
              pending.subcategory,
            );
            return api.put(`question/${item.id}/`, payload);
          });

        if (!updates.length) return;

        try {
          await Promise.all(updates);
        } catch (error) {
          console.error("Error updating question order", error);
          toast.error("Error actualizando el orden de preguntas");
        }
      }, 600);
    }
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

  const getOptionId = (option) => {
    if (option && typeof option === "object") return option.id;
    return option;
  };

  const handleRemoveOption = (category, subcategory, questionId, optionId) => {
    updateQuestion(category, subcategory, questionId, (question) => ({
      ...question,
      options: (question.options || []).filter(
        (item) => getOptionId(item) !== optionId,
      ),
    }));
  };

  const handleRemoveSubQuestion = async (
    category,
    subcategory,
    questionId,
    subQuestionId,
  ) => {
    const idValue = String(subQuestionId || "");
    if (!idValue || idValue.startsWith("sub-")) {
      updateQuestion(category, subcategory, questionId, (question) => ({
        ...question,
        sub_questions: (question.sub_questions || []).filter(
          (item) => item.id !== subQuestionId,
        ),
      }));
      return;
    }

    try {
      await api.delete(`question/${subQuestionId}/`);
      updateQuestion(category, subcategory, questionId, (question) => ({
        ...question,
        sub_questions: (question.sub_questions || []).filter(
          (item) => item.id !== subQuestionId,
        ),
      }));
    } catch (error) {
      console.error("Error deleting subquestion", error);
    }
  };

  const handleAddSubQuestion = async (
    category,
    subcategory,
    question,
    data,
  ) => {
    const rawSubcategoryId =
      question?.subcategory?.id ??
      question?.subcategory_id ??
      subcategory?.id ??
      null;
    const parsedSubcategoryId = Number(rawSubcategoryId);
    const subcategoryId = Number.isFinite(parsedSubcategoryId)
      ? parsedSubcategoryId
      : null;
    if (!subcategoryId) {
      toast.error("Subcategoria requerida para crear subpregunta.");
      return null;
    }

    const payload = buildQuestionPayload(
      {
        ...question,
        parent_question: question.id,
        description: data?.description || "",
        question_type: data?.question_type,
        code: data?.code || "",
        options: [],
        position: (question.sub_questions || []).length + 1,
      },
      category,
      subcategoryId,
    );

    payload.subcategory = subcategoryId;

    console.log("payload from subquestions:", payload);

    try {
      const response = await api.post("question/", payload);
      const created = response?.data || {
        ...payload,
        id: `sub-${Date.now()}-${Math.random().toString(16).slice(2)}`,
      };
      updateQuestion(category, subcategory, question.id, (item) => ({
        ...item,
        sub_questions: [...(item.sub_questions || []), created],
      }));
      return created;
    } catch (error) {
      console.error("Error creating subquestion", error);
      return null;
    }
  };

  const handleUpdateQuestion = async (category, subcategory, question) => {
    const idValue = String(question?.id || "");
    if (!idValue) return;

    const payload = buildQuestionPayload(question, category, subcategory);

    if (idValue.startsWith("draft-") || idValue.startsWith("new-")) {
      try {
        const response = await api.post("question/", payload);
        const created = response?.data || payload;
        updateQuestion(category, subcategory, question.id, (item) => ({
          ...created,
          id: created.id ?? item.id,
          sub_questions: item.sub_questions || [],
        }));
        toast.success("Pregunta actualizada exitosamente");
      } catch (error) {
        console.error("Error creating question", error);
      }
      return;
    }

    const shouldKeepOptions = (incoming) => {
      if (!Array.isArray(incoming)) return true;
      if (incoming.length === 0) return false;
      return typeof incoming[0] !== "object";
    };

    try {
      const response = await api.put(`question/${question.id}/`, payload);
      const updated = response?.data || payload;
      updateQuestion(category, subcategory, question.id, (item) => ({
        ...item,
        ...updated,
        options: shouldKeepOptions(updated.options)
          ? item.options
          : updated.options,
      }));
      toast.success("Pregunta actualizada exitosamente");
    } catch (error) {
      console.error("Error updating question", error);
    }
  };

  const handleDeleteQuestion = async (category, subcategory, questionId) => {
    const idValue = String(questionId || "");
    if (
      !idValue ||
      idValue.startsWith("draft-") ||
      idValue.startsWith("new-")
    ) {
      removeQuestionFromList(category, subcategory, questionId);
      return;
    }

    try {
      await api.delete(`question/${questionId}/`);
      removeQuestionFromList(category, subcategory, questionId);
    } catch (error) {
      console.error("Error deleting question", error);
    }
  };

  const openCreateForm = () => {
    const nextDraft = newQuestionDraft(targetCategory, targetSubcategory);
    setDraftQuestion(nextDraft);
    setShowCreateForm(true);
  };

  const handleCreateQuestion = (event) => {
    event.preventDefault();
    if (!draftQuestion?.category || !draftQuestion?.subcategory) return;

    const subcategoryKey = normalizeSubcategoryKey(draftQuestion.subcategory);

    const payload = buildQuestionPayload(
      draftQuestion,
      draftQuestion.category,
      draftQuestion.subcategory,
    );

    const persistQuestion = async () => {
      try {
        const response = await api.post("question/", payload);
        const created = response?.data || payload;
        setGroupedQuestions((prev) => {
          const next = {
            ...prev,
            [draftQuestion.category]: {
              ...(prev[draftQuestion.category] || {}),
            },
          };
          const list = [
            ...(next[draftQuestion.category][subcategoryKey] || []),
          ];
          list.push({
            ...created,
            id: created.id ?? `draft-${Date.now()}`,
            position: created.position ?? list.length + 1,
          });
          next[draftQuestion.category][subcategoryKey] = list;
          return next;
        });
        setShowCreateForm(false);
        setDraftQuestion(null);
      } catch (error) {
        console.error("Error creating question", error);
      }
    };

    persistQuestion();
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

    const subcategoryKey = normalizeSubcategoryKey(targetSubcategory);
    const payload = buildQuestionPayload(
      {
        code: "",
        question_type: bankQuestion.question_type,
        description: bankQuestion.description,
        parent_question: null,
        survey: [],
        options: [],
        is_required: true,
        input_type: bankQuestion.input_type,
        position:
          (groupedQuestions[targetCategory]?.[subcategoryKey] || []).length + 1,
      },
      targetCategory,
      targetSubcategory,
    );

    const persistQuestion = async () => {
      try {
        const response = await api.post("question/", payload);
        const created = response?.data || payload;
        setGroupedQuestions((prev) => {
          const next = {
            ...prev,
            [targetCategory]: {
              ...(prev[targetCategory] || {}),
            },
          };
          const list = [...(next[targetCategory]?.[subcategoryKey] || [])];
          list.push({
            ...created,
            id: created.id ?? `bank-${Date.now()}`,
            position: created.position ?? list.length + 1,
          });
          next[targetCategory][subcategoryKey] = list;
          return next;
        });
      } catch (error) {
        console.error("Error creating question from bank", error);
      }
    };

    persistQuestion();
  };

  return (
    <div className="w-full min-w-0 rounded-2xl border border-slate-200 bg-white/90 p-6 shadow-lg shadow-slate-200/60">
      <style>{`
        @keyframes questionMoveFlash {
          0% { transform: translateY(0); box-shadow: 0 0 0 0 rgba(251, 191, 36, 0.45); }
          40% { transform: translateY(-2px); box-shadow: 0 0 0 6px rgba(251, 191, 36, 0.12); }
          100% { transform: translateY(0); box-shadow: 0 0 0 0 rgba(251, 191, 36, 0); }
        }

        .question-move-flash {
          animation: questionMoveFlash 220ms ease-out;
        }
      `}</style>
      <div className="mb-6 flex flex-wrap items-center justify-between gap-4">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-400">
            Formularios
          </p>
          <h2 className="mt-2 text-2xl font-semibold text-slate-900">
            Preguntas del formulario
          </h2>
          <p className="mt-2 text-sm text-slate-500">
            Organiza las preguntas por categoria, subcategoria y ajusta la
            posicion con los controles.
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

      {!loading && visibleCategory && (
        <div className="mb-8">
          <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
            <h3 className="text-lg font-semibold text-slate-900">
              {visibleCategory}
            </h3>
            <div className="flex flex-wrap items-center gap-3">
              <select
                className="rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm text-slate-700"
                value={visibleCategory}
                onChange={(event) => {
                  const nextCategory = event.target.value;
                  const nextSubcategory = Object.keys(
                    groupedQuestions[nextCategory] || {},
                  )[0];
                  setTargetCategory(nextCategory);
                  setTargetSubcategory(nextSubcategory || "");
                }}
              >
                {categories.map((category) => (
                  <option key={category} value={category}>
                    {category}
                  </option>
                ))}
              </select>
              <select
                className="rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm text-slate-700"
                value={visibleSubcategory}
                onChange={(event) => setTargetSubcategory(event.target.value)}
                disabled={!subcategoriesForVisible.length}
              >
                {subcategoriesForVisible.map((subcategory) => (
                  <option key={subcategory} value={subcategory}>
                    {subcategory}
                  </option>
                ))}
              </select>
            </div>
          </div>
          <div className="space-y-6">
            {(groupedQuestions[visibleCategory]?.[visibleSubcategory] || [])
              .length === 0 ? (
              <div className="rounded-2xl border border-dashed border-slate-200 bg-slate-50/80 px-6 py-8 text-center text-slate-500">
                No hay preguntas para esta subcategoria.
              </div>
            ) : (
              (() => {
                const list =
                  groupedQuestions[visibleCategory]?.[visibleSubcategory] || [];
                const subcategoryMeta = list?.[0]?.subcategory ?? {
                  name: visibleSubcategory,
                };

                return (
                  <div className="rounded-2xl border border-slate-200 bg-white p-4">
                    <div className="mb-3 flex flex-wrap items-center justify-between gap-3">
                      <div>
                        <p className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-400">
                          Subcategoria
                        </p>
                        <h4 className="text-base font-semibold text-slate-800">
                          {normalizeSubcategoryKey(subcategoryMeta)}
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
                          category={visibleCategory}
                          subcategory={subcategoryMeta}
                          index={index}
                          inputTypeLabels={INPUT_TYPE_LABELS}
                          editingField={editingField}
                          isMoved={movedIds.includes(question.id)}
                          startInlineEdit={startInlineEdit}
                          applyInlineEdit={applyInlineEdit}
                          updateQuestion={updateQuestion}
                          handleAddSubQuestion={handleAddSubQuestion}
                          handleAddOption={handleAddOption}
                          handleRemoveOption={handleRemoveOption}
                          handleRemoveSubQuestion={handleRemoveSubQuestion}
                          handleUpdateQuestion={handleUpdateQuestion}
                          handleDeleteQuestion={handleDeleteQuestion}
                          onMove={moveQuestion}
                          isFirst={index === 0}
                          isLast={index === list.length - 1}
                        />
                      ))}
                    </div>
                  </div>
                );
              })()
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default QuestionsSurvey;
