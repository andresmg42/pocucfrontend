import { useState } from "react";

const SubQuestionModal = ({ isOpen, onClose, onCreate }) => {
  const [description, setDescription] = useState("");
  const [code, setCode] = useState("");
  const [isSaving, setIsSaving] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = async (event) => {
    event.preventDefault();
    const trimmed = description.trim();
    if (!trimmed) return;

    try {
      setIsSaving(true);
      const created = await onCreate?.({
        description: trimmed,
        code: code.trim(),
        question_type: "matrix_child",
      });
      if (created) {
        setDescription("");
        setCode("");
        onClose?.();
      }
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 p-6">
      <div className="w-full max-w-lg rounded-2xl border border-slate-200 bg-white p-6 shadow-xl">
        <div className="flex items-start justify-between gap-4">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-400">
              Subpreguntas
            </p>
            <h3 className="mt-2 text-xl font-semibold text-slate-900">
              Crear subpregunta
            </h3>
            <p className="mt-1 text-sm text-slate-500">
              Crea una subpregunta vinculada a esta pregunta.
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="rounded-full border border-slate-200 bg-white px-3 py-1 text-xs font-semibold uppercase tracking-[0.2em] text-slate-500"
          >
            Cerrar
          </button>
        </div>

        <form className="mt-5 space-y-4" onSubmit={handleSubmit}>
          <div>
            <label className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-400">
              Descripcion
            </label>
            <input
              value={description}
              onChange={(event) => setDescription(event.target.value)}
              placeholder="Descripcion de la subpregunta"
              className="mt-2 w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm"
            />
          </div>
          <div>
            <label className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-400">
              Codigo (opcional)
            </label>
            <input
              value={code}
              onChange={(event) => setCode(event.target.value)}
              placeholder="Codigo"
              className="mt-2 w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm"
            />
          </div>
          <div className="flex justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              className="rounded-lg border border-slate-200 bg-white px-4 py-2 text-sm font-semibold text-slate-700"
            >
              Cancelar
            </button>
            <button
              type="submit"
              disabled={isSaving}
              className="rounded-lg bg-slate-900 px-4 py-2 text-sm font-semibold text-white disabled:opacity-60"
            >
              {isSaving ? "Creando..." : "Crear"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default SubQuestionModal;
