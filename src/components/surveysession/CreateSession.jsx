import { useEffect, useState } from "react";
import api from "../../api/user.api";
import useAuthStore from "../../stores/use-auth-store";
import usePageStore from "../../stores/use-page-store";
import toast from "react-hot-toast";
import { useParams } from "react-router";

const CreateSession = ({ survey_id }) => {
  const { setAddTrigger, addTrigger, session, setSession, update, setUpdate } =
    usePageStore();
  const { userLogged } = useAuthStore();

  const [formData, setFormData] = useState(
    session && update
      ? {
          zone: session.zone,
          // number_session: session.number_session,
          // start_date: session.start_date,
          // end_date: session.end_date,
          visit_number: session.visit_number,
          observational_distance: session.observational_distance,
          url: session.url,
          observer: userLogged.email,
          survey: survey_id,
        }
      : {
          zone: "",
          // number_session: "",
          // start_date: "",
          // end_date: "",
          visit_number: "",
          observational_distance: "",
          url: "",
          observer: userLogged.email,
          survey: survey_id,
        }
  );

  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.id]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      setLoading(true);

      let res

      if(session && update){
        if(session.visits_created>formData.visit_number){
          toast.error('Hay más visitas creadas que las actualizadas, borra algunas visitas para disminuir el número de visitas actual')
          return

        }
        res=await api.put(`surveysession/${session.id}/`, formData)
      }else{
        res=await api.post("surveysession/", formData);
      }
    

      // const res =
      //   session && update
      //     ? await api.put(`surveysession/${session.id}/`, formData)
      //     : await api.post("surveysession/", formData);

      if (res.status === 200 || res.status === 201) {
        setAddTrigger(!addTrigger);
        setUpdate(false);
        setFormData({
          zone: "",
          visit_number: "",
          observational_distance: "",
          url: "",
          observer: userLogged.email,
          survey: survey_id,
        });
        toast.success("Sesión creada o actualizada exitosamente!");
      }
    } catch (error) {
      console.error("error in handlesubmit of createSession", error);
      toast.error("Datos incorrectos, el numero de  sesion no se debe repetir");
    } finally {
      setLoading(false);
    }
  };

  const handleCloseClick = (e) => {
    e.preventDefault();
    setAddTrigger(!addTrigger);
  };

  return (
    <div className=" flex mx-auto m-5 items-center justify-center z-10">
      <div className="relative w-full max-w-md lg:max-w-2xl space-y-8 bg-white p-6 sm:p-8 rounded-2xl shadow-lg">
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

        <div className="text-center">
          <h2 className="mt-6 text-2xl sm:text-3xl font-bold tracking-tight text-slate-900">
            Registro de Sesiónes
          </h2>
          <p className="mt-2 text-sm text-slate-600">
            Porfavor llene todos los campos para continuar.
          </p>
        </div>

        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-5">
            <div>
              <label
                htmlFor="zone"
                className="block text-sm font-medium text-slate-700 mb-1"
              >
                Zona
              </label>
              <input
                type="number"
                id="zone"
                required
                className="block w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-md text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                placeholder="Ej: 14"
                value={formData.zone}
                onChange={handleChange}
              />
            </div>

            <div>
              <label
                htmlFor="visit_number"
                className="block text-sm font-medium text-slate-700 mb-1"
              >
                Numero de Visitas
              </label>
              <input
                type="number"
                id="visit_number"
                required
                className="block w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-md text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                placeholder="Ej: 3"
                value={formData.visit_number}
                onChange={handleChange}
              />
            </div>

            {/* Distancia observacional - Spanning full width */}
            <div className="sm:col-span-2">
              <label
                htmlFor="observational_distance"
                className="block text-sm font-medium text-slate-700 mb-1"
              >
                Distancia Observacional (Metros)
              </label>
              <input
                type="number"
                id="observational_distance"
                required
                value={formData.observational_distance}
                className="block w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-md text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                placeholder="Ej: 100"
                onChange={handleChange}
              />
            </div>

            {/* URL de carpeta drive - Spanning full width */}
            <div className="sm:col-span-2">
              <label
                htmlFor="url"
                className="block text-sm font-medium text-slate-700 mb-1"
              >
                URL de Carpeta Drive
              </label>
              <input
                type="text"
                id="url"
                required
                className="block w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-md text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                placeholder="https://drive.google.com/..."
                value={formData.url}
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

export default CreateSession;
