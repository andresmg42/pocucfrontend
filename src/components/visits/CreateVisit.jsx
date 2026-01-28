import { useState } from "react";
import api from "../../api/user.api";
import useAuthStore from "../../stores/use-auth-store";
import usePageStore from "../../stores/use-page-store";
import toast from "react-hot-toast";

const CreateVisit = ({ surveysession_id }) => {
  const {
    addTriggerVisit,
    setAddTriggerVisit,
    updateVisit,
    visit,
    setUpdateVisit,
  } = usePageStore();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState(
    visit && updateVisit
      ? {
          surveysession: surveysession_id,
          visit_number: visit.visit_number,
        }
      : {
          surveysession: surveysession_id,
          visit_number: "",
        },
  );

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.id]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log("start Time", formData.start_time);
    try {
      setLoading(true);

      const res =
        visit && updateVisit
          ? await api.put(`visit/${visit.id}/`, formData)
          : await api.post("visit/", formData);
      if ((res.status = 200)) {
        setUpdateVisit(false);

        setAddTriggerVisit(!addTriggerVisit);
        toast.success("Visita Registrada exitosamente");
      }

      console.log("response in handle sumbmit de visita", res);
    } catch (error) {
      console.log("error in handlesubmit of CreateVisit", error);
      toast.error(
        "No puedes crear una visita con un numero de visita que ya existe",
      );
    } finally {
      setLoading(false);
    }
  };

  const handleCloseClick = (e) => {
    e.preventDefault();
    setAddTriggerVisit(!addTriggerVisit);
  };

  return (
    <div className="flex items-center justify-center  p-4 sm:p-6 lg:p-8">
      {/* The form card with a responsive max-width and relative positioning for the close button */}
      <div className="relative w-full max-w-md lg:max-w-xl space-y-8 bg-white p-6 sm:p-8 rounded-2xl shadow-lg">
        {/* Close Button: Styled and positioned for better UX */}
        <div className="absolute top-4 right-4">
          <button
            onClick={handleCloseClick}
            type="button"
            aria-label="Cerrar formulario"
            className="h-9 w-9 flex items-center justify-center rounded-full text-slate-500 bg-slate-100 hover:bg-slate-200 hover:text-slate-700 transition-colors focus:outline-none focus:ring-2 focus:ring-indigo-500"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-6 w-6"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={2}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>
        </div>

        {/* Header Section */}
        <div className="text-center">
          <h2 className="mt-6 text-2xl sm:text-3xl font-bold tracking-tight text-slate-900">
            Registro de Visitas
          </h2>
          <p className="mt-2 text-sm text-slate-600">
            Porfavor llene todos los campos para continuar.
          </p>
        </div>

        {/* Form with improved spacing */}
        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          {/* Responsive Grid for Inputs */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-5">
            {/* Numero de Visita */}
            <div>
              <label
                htmlFor="visit_number"
                className="block text-sm font-medium text-slate-700 mb-1"
              >
                Número de Visita
              </label>
              <input
                type="number"
                id="visit_number"
                required
                className="block w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-md text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                placeholder="Ej: 1"
                value={formData.visit_number}
                onChange={handleChange}
              />
            </div>
          </div>

          {/* Submit Button */}
          <div>
            <button
              disabled={loading}
              type="submit"
              className="w-full flex justify-center py-3 px-4 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:bg-indigo-400 disabled:cursor-not-allowed transition-colors"
            >
              {loading ? "Registrando..." : "Registrar"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreateVisit;
