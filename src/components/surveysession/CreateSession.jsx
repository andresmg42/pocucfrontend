import { useEffect, useState } from "react";
import api from "../../api/user.api";
import useAuthStore from "../../stores/use-auth-store";
import usePageStore from "../../stores/use-page-store";
import toast from "react-hot-toast";
import { useParams } from "react-router";

const CreateSession = ({ survey_id }) => {
  const { setAddTrigger, addTrigger, session, setSession,update,setUpdate } = usePageStore();
  const { userLogged } = useAuthStore();


  const [formData, setFormData] = useState(
    session && update? 
    {
          zone: session.zone,
          number_session: session.number_session,
          start_date: session.start_date,
          end_date: session.end_date,
          observational_distance: session.observational_distance,
          url: session.url,
          observer: userLogged.email,
          survey: survey_id,
        }
      : {
          zone: "",
          number_session: "",
          start_date: "",
          end_date: "",
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
      
        const res = session && update? await api.put(`surveysession/${session.id}/`, formData): 
        await api.post("surveysession/", formData);
     
       
      

      if ((res.status = 200)) {

        setAddTrigger(!addTrigger);
        setUpdate(false)
        setFormData(
          {
          zone: "",
          number_session: "",
          start_date: "",
          end_date: "",
          observational_distance: "",
          url: "",
          observer: userLogged.email,
          survey: survey_id,
        }
        )
        toast.success("Sesión creada o actualizada exitosamente!");
      }
      // console.log('response in handle submit:',res)
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
    <div className=" flex items-center justify-center  p-4 sm:p-6 lg:p-8">
  
  {/* The form card with a responsive max-width and relative positioning for the close button */}
  <div className="relative w-full max-w-md lg:max-w-2xl space-y-8 bg-white p-6 sm:p-8 rounded-2xl shadow-lg">
    
    {/* Close Button: Styled and positioned for better UX */}
    <div className="absolute top-4 right-4">
      <button 
        onClick={handleCloseClick}
        type="button"
        aria-label="Cerrar formulario"
        className="h-9 w-9 flex items-center justify-center rounded-full text-slate-500 bg-slate-100 hover:bg-slate-200 hover:text-slate-700 transition-colors focus:outline-none focus:ring-2 focus:ring-indigo-500"
      >
        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
        </svg>
      </button>
    </div>

    {/* Header Section */}
    <div className="text-center">
      <h2 className="mt-6 text-2xl sm:text-3xl font-bold tracking-tight text-slate-900">
        Registro de Sesiónes
      </h2>
      <p className="mt-2 text-sm text-slate-600">
        Porfavor llene todos los campos para continuar.
      </p>
    </div>

    {/* Form with improved spacing */}
    <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
      {/* Responsive Grid for Inputs */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-5">
        
        {/* Zona */}
        <div>
          <label htmlFor="zone" className="block text-sm font-medium text-slate-700 mb-1">
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

        {/* Numero de Sesion */}
        <div>
          <label htmlFor="number_session" className="block text-sm font-medium text-slate-700 mb-1">
            Número de Sesión
          </label>
          <input
            type="number"
            id="number_session"
            required
            className="block w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-md text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
            placeholder="Ej: 3"
            value={formData.number_session}
            onChange={handleChange}
          />
        </div>

        {/* Fecha de inicio */}
        <div>
          <label htmlFor="start_date" className="block text-sm font-medium text-slate-700 mb-1">
            Fecha de Inicio
          </label>
          <input
            type="date"
            id="start_date"
            required
            value={formData.start_date}
            className="block w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-md text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
            onChange={handleChange}
          />
        </div>

        {/* Fecha de finalizacion */}
        <div>
          <label htmlFor="end_date" className="block text-sm font-medium text-slate-700 mb-1">
            Fecha de Finalización
          </label>
          <input
            type="date"
            id="end_date"
            required
            value={formData.end_date}
            className="block w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-md text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
            onChange={handleChange}
          />
        </div>

        {/* Distancia observacional - Spanning full width */}
        <div className="sm:col-span-2">
          <label htmlFor="observational_distance" className="block text-sm font-medium text-slate-700 mb-1">
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
          <label htmlFor="url" className="block text-sm font-medium text-slate-700 mb-1">
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
