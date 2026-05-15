import { useEffect, useState } from "react";
import api from "../../../api/user.api";

const OptionQuestions = ({ isOpen, onClose, onSelectOption }) => {
  const [options, setOptions] = useState([]);
  const [loading, setLoading] = useState(false);
  const [selectedOptionId, setSelectedOptionId] = useState("");
  const [newOptionText, setNewOptionText] = useState("");
  const [creating, setCreating] = useState(false);

  useEffect(() => {
    if (!isOpen) return;

    const fetchOptions = async () => {
      try {
        setLoading(true);
        const response = await api.get("options/");
        setOptions(response.data || []);
      } catch (error) {
        console.error("Error loading options", error);
      } finally {
        setLoading(false);
      }
    };

    fetchOptions();
  }, [isOpen]);

  const handleCreateOption = async () => {
    const trimmed = newOptionText.trim();
    if (!trimmed) return;

    try {
      setCreating(true);
      const response = await api.post("options/", { description: trimmed });
      const createdOption = response?.data || {
        id: `opt-${Date.now()}`,
        description: trimmed,
      };

      setNewOptionText("");
      setOptions((prev) => [...prev, createdOption]);
      onSelectOption?.(createdOption);
      onClose?.();
    } catch (error) {
      console.error("Error creating option", error);
    } finally {
      setCreating(false);
    }
  };

  const handleSelectOption = () => {
    const selected = options.find((option) => option.id === selectedOptionId);
    if (!selected) return;

    onSelectOption?.(selected);
    onClose?.();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 p-6">
      <div className="w-full max-w-lg rounded-2xl border border-slate-200 bg-white p-6 shadow-xl">
        <div className="flex items-start justify-between gap-4">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-400">
              Opciones
            </p>
            <h3 className="mt-2 text-xl font-semibold text-slate-900">
              Agregar opcion
            </h3>
            <p className="mt-1 text-sm text-slate-500">
              Crea una opcion nueva o selecciona una existente.
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

        <div className="mt-5 space-y-4">
          <div className="rounded-xl border border-slate-200 bg-slate-50 p-4">
            <label className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-400">
              Nueva opcion
            </label>
            <div className="mt-2 flex flex-wrap items-center gap-3">
              <input
                value={newOptionText}
                onChange={(event) => setNewOptionText(event.target.value)}
                placeholder="Nueva opcion"
                className="flex-1 rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm"
              />
              <button
                type="button"
                onClick={handleCreateOption}
                disabled={creating}
                className="rounded-lg bg-slate-900 px-4 py-2 text-sm font-semibold text-white disabled:opacity-60"
              >
                {creating ? "Creando..." : "Crear"}
              </button>
            </div>
          </div>

          <div className="rounded-xl border border-slate-200 bg-slate-50 p-4">
            <label className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-400">
              Banco de opciones
            </label>
            <div className="mt-2 flex flex-wrap items-center gap-3">
              <select
                className="flex-1 rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm"
                value={selectedOptionId}
                onChange={(event) => setSelectedOptionId(event.target.value)}
              >
                <option value="">
                  {loading ? "Cargando opciones..." : "Selecciona una opcion"}
                </option>
                {options.map((option) => (
                  <option key={option.id} value={option.id}>
                    {option.description}
                  </option>
                ))}
              </select>
              <button
                type="button"
                onClick={handleSelectOption}
                className="rounded-lg bg-white px-4 py-2 text-sm font-semibold text-slate-700 border border-slate-200"
              >
                Seleccionar
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OptionQuestions;
