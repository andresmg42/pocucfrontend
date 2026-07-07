import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import api from "../../../api/user.api";

const emptyForm = {
  name: "",
  topic: "",
  version: "",
  description: "",
  image_url: "",
};

const Forms = ({ onBack, setCreated, edit, editPayload = {}, setEdit }) => {
  const [formData, setFormData] = useState(emptyForm);
  const [createdSurveyId, setCreatedSurveyId] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (edit && editPayload?.id) {
      setFormData({
        name: editPayload.name || "",
        topic: editPayload.topic || "",
        version: editPayload.version || "",
        description: editPayload.description || "",
        image_url: editPayload.image_url || "",
      });
    } else {
      setFormData(emptyForm);
    }
  }, [edit, editPayload]);

  const handleChange = (event) => {
    const { id, value } = event.target;

    setFormData((prev) => ({
      ...prev,
      [id]: value,
    }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    try {
      setLoading(true);
      setCreatedSurveyId(null);

      const payload = {
        name: formData.name.trim(),
        topic: formData.topic.trim(),
        version: formData.version.trim(),
        description: formData.description.trim(),
        image_url: formData.image_url.trim() || null,
      };
      const isEditing = edit && editPayload?.id;
      const response = !isEditing
        ? await api.post("survey/surveys/", payload)
        : await api.put(`survey/surveys/${editPayload.id}/`, payload);
      const newSurveyId = response?.data?.id ?? null;
      onBack();
      setCreated();
      if (typeof setEdit === "function") {
        setEdit(false);
      }

      if (response.status === 200 || response.status === 201) {
        setFormData(emptyForm);
        setCreatedSurveyId(newSurveyId);
        toast.success("Encuesta creada correctamente");
      }
    } catch (error) {
      console.error("Error creating survey", error);
      toast.error("No se pudo crear la encuesta");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full max-w-none rounded-2xl border border-slate-200 bg-white/90 p-6 shadow-lg shadow-slate-200/60">
      <div className="mb-6 flex flex-wrap items-center justify-between gap-4">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-400">
            Formularios
          </p>
          <h2 className="mt-2 text-2xl font-semibold text-slate-900">
            Crear encuesta
          </h2>
          <p className="mt-2 text-sm text-slate-500">
            Completa los datos basicos para registrar una nueva encuesta.
          </p>
        </div>
        <div className="flex flex-wrap items-center gap-3">
          {typeof onBack === "function" && (
            <button
              type="button"
              onClick={onBack}
              className="rounded-full border border-slate-200 bg-white px-4 py-2 text-xs font-semibold uppercase tracking-[0.3em] text-slate-600 transition hover:border-slate-300 hover:text-slate-900"
            >
              Volver
            </button>
          )}
          {createdSurveyId && (
            <span className="rounded-full border border-emerald-200 bg-emerald-50 px-4 py-2 text-xs font-semibold uppercase tracking-[0.3em] text-emerald-600">
              ID {createdSurveyId}
            </span>
          )}
        </div>
      </div>

      <form className="space-y-5" onSubmit={handleSubmit}>
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
          <div>
            <label
              htmlFor="name"
              className="block text-sm font-medium text-slate-700"
            >
              Nombre
            </label>
            <input
              id="name"
              type="text"
              required
              value={formData.name}
              onChange={handleChange}
              placeholder="Ej: Encuesta de Seguridad"
              className="mt-1 w-full rounded-lg border border-slate-300 bg-slate-50 px-3 py-2 text-sm text-slate-900 focus:border-slate-900 focus:outline-none focus:ring-2 focus:ring-slate-900/20"
            />
          </div>

          <div>
            <label
              htmlFor="topic"
              className="block text-sm font-medium text-slate-700"
            >
              Tema
            </label>
            <input
              id="topic"
              type="text"
              required
              value={formData.topic}
              onChange={handleChange}
              placeholder="Ej: Seguridad"
              className="mt-1 w-full rounded-lg border border-slate-300 bg-slate-50 px-3 py-2 text-sm text-slate-900 focus:border-slate-900 focus:outline-none focus:ring-2 focus:ring-slate-900/20"
            />
          </div>

          <div>
            <label
              htmlFor="version"
              className="block text-sm font-medium text-slate-700"
            >
              Version
            </label>
            <input
              id="version"
              type="text"
              required
              value={formData.version}
              onChange={handleChange}
              placeholder="Ej: v1.0"
              className="mt-1 w-full rounded-lg border border-slate-300 bg-slate-50 px-3 py-2 text-sm text-slate-900 focus:border-slate-900 focus:outline-none focus:ring-2 focus:ring-slate-900/20"
            />
          </div>

          <div>
            <label
              htmlFor="image_url"
              className="block text-sm font-medium text-slate-700"
            >
              URL de imagen (opcional)
            </label>
            <input
              id="image_url"
              type="url"
              value={formData.image_url}
              onChange={handleChange}
              placeholder="https://"
              className="mt-1 w-full rounded-lg border border-slate-300 bg-slate-50 px-3 py-2 text-sm text-slate-900 focus:border-slate-900 focus:outline-none focus:ring-2 focus:ring-slate-900/20"
            />
          </div>
        </div>

        <div>
          <label
            htmlFor="description"
            className="block text-sm font-medium text-slate-700"
          >
            Descripcion
          </label>
          <textarea
            id="description"
            required
            rows={4}
            value={formData.description}
            onChange={handleChange}
            placeholder="Describe el proposito de la encuesta"
            className="mt-1 w-full resize-none rounded-lg border border-slate-300 bg-slate-50 px-3 py-2 text-sm text-slate-900 focus:border-slate-900 focus:outline-none focus:ring-2 focus:ring-slate-900/20"
          />
        </div>

        <div className="flex flex-wrap items-center gap-4">
          <button
            type="submit"
            disabled={loading}
            className="inline-flex items-center justify-center rounded-xl bg-slate-900 px-6 py-3 text-sm font-semibold text-white shadow-lg shadow-slate-900/20 transition hover:bg-slate-800 disabled:cursor-not-allowed disabled:bg-slate-400"
          >
            {!edit
              ? loading
                ? "Creando..."
                : "Crear"
              : loading
                ? "Actualizando..."
                : "Actualizar"}
          </button>
          <p className="text-xs text-slate-400">
            El ID de la encuesta se mostrara cuando se cree correctamente.
          </p>
        </div>
      </form>
    </div>
  );
};

export default Forms;
