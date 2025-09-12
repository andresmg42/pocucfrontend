import { useState } from "react";
import api from "../../api/user.api";
import useAuthStore from "../../stores/use-auth-store";
import usePageStore from "../../stores/use-page-store";
import toast from "react-hot-toast";

const CreateSession = ({survey_id}) => {

  const {userLogged}=useAuthStore();
  const {setAddTrigger,addTrigger}=usePageStore();
  const [formData, setFormData] = useState({
    zone: "",
    number_session: "",
    start_date: "",
    end_date: "",
    observational_distance:"",
    url:"",
    email:userLogged.email,
    survey_id:survey_id,
  });

  

  const [loading,setLoading]=useState(false)

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.id]: e.target.value,
    });
  };

 const handleSubmit= async (e)=>{
    e.preventDefault();

    try {
        setLoading(true)
        const res= await api.post('surveysession/create/',formData)

        if (res.status=200){
          
          setAddTrigger(!addTrigger)
          toast.success('Sesión creada exitosamente!')

        }
        console.log('response in handle submit:',res)
        
    } catch (error) {

        console.log('error in handlesubmit of createSession',error)
        
    }finally{
        setLoading(false)
    }



 }

 const handleCloseClick =(e)=>{
  e.preventDefault();
  setAddTrigger(!addTrigger)
 }


  return (
    <div className="min-h-screen flex items-center justify-center  py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8 bg-white p-8 rounded-lg shadow-md">
        <div className="w-full h-10 flex justify-end">
        <button onClick={handleCloseClick}>
          <img src="/surveysession/closebutton.svg" alt="closebutton" className="w-10 h-10"  />
        </button>
        </div>
        <div className="text-center">
          {/* {error && <Error error={error} />} */}
          <h2 className="mt-6 text-3xl font-bold text-gray-900">
            Registro de Sesiónes para Observadores
          </h2>
          <p className="mt-2 text-sm text-gray-600">
            Porfavor llene todos los campos y haga click en enviar
          </p>
        </div>
        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          <div className="space-y-4">
            <div>
              <input
                type="number"
                id="zone"
                required
                className="mt-1 text-black block w-full px-3 py-2 bg-gray-50 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                placeholder="Zona"
                value={formData.zone}
                onChange={handleChange}
              />

              <input
                type="number"
                id="number_session"
                required
                className="mt-1 text-black block w-full px-3 py-2 bg-gray-50 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                placeholder="Numero de Sesion"
                value={formData.number_session}
                onChange={handleChange}
              />

              <input
                type="date"
                id="start_date"
                required
                value={formData.start_date}
                className="mt-1 text-black block w-full px-3 py-2 bg-gray-50 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                placeholder="Fecha de inicio"
                onChange={handleChange}
              />

              <input
                type="date"
                id="end_date"
                required
                value={formData.end_date}
                className="mt-1 text-black block w-full px-3 py-2 bg-gray-50 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                placeholder="Fecha de finalizacion"
                onChange={handleChange}
              />
              
              <input
                type="number"
                id="observational_distance"
                required
                value={formData.observational_distance}
                className="mt-1 text-black block w-full px-3 py-2 bg-gray-50 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                placeholder="Distancia observacional en Metros"
                onChange={handleChange}
              />
              <input
                type="text"
                id="url"
                required
                className="mt-1 text-black block w-full px-3 py-2 bg-gray-50 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                placeholder="Url de carpetra drive de evidencias"
                value={formData.url}
                onChange={handleChange}
              />
            </div>
          </div>

          <button
            disabled={loading}
            type="submit"
            className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2  focus:ring-blue-500"
          >
            {loading ? "loading..." : "Register"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default CreateSession;
