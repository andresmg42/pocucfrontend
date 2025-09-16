import { useState } from "react";
import api from "../../api/user.api";
import useAuthStore from "../../stores/use-auth-store";
import usePageStore from "../../stores/use-page-store";
import toast from "react-hot-toast";

const CreateVisit = ({surveysession_id}) => {

    const {addTriggerVisit,setAddTriggerVisit}=usePageStore();
    const [loading,setLoading]=useState(false)
    const [formData,setFormData]=useState({
        surveysession:surveysession_id,
        visit_number:"",
        visit_date:"",
        start_time:"",
        end_time:"",
        complete:false        
    })

    const handleChange=(e)=>{
        setFormData({
            ...formData,
            [e.target.id]:e.target.value,
        });
    };

    const handleSubmit=async (e)=>{
        e.preventDefault();
        try {
            setLoading(true)

            const res=await api.post('visit/create/',formData)
            if(res.status=200){
                setAddTriggerVisit(!addTriggerVisit)
                toast.success('Visita Registrada exitosamente')
            }
            console.log('response in handle sumbmit de visita',res)
            
        } catch (error) {

            console.log('error in handlesubmit of CreateVisit',error)
            
        }finally{
            setLoading(false)
        }
    }

    const handleCloseClick= (e)=>{
        e.preventDefault();
        setAddTriggerVisit(!addTriggerVisit)
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
            Registro de visitas para Observadores
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
                id="visit_number"
                required
                className="mt-1 text-black block w-full px-3 py-2 bg-gray-50 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                placeholder="Numero de Visita"
                value={formData.visit_number}
                onChange={handleChange}
              />

              <input
                type="date"
                id="visit_date"
                required
                value={formData.visit_date}
                className="mt-1 text-black block w-full px-3 py-2 bg-gray-50 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                placeholder="Fecha de visita"
                onChange={handleChange}
              />

              <input
                type="time"
                id="start_time"
                required
                value={formData.start_time}
                className="mt-1 text-black block w-full px-3 py-2 bg-gray-50 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                placeholder="Hora de Inicio"
                onChange={handleChange}
              />
              
              <input
                type="time"
                id="end_time"
                required
                value={formData.end_time}
                className="mt-1 text-black block w-full px-3 py-2 bg-gray-50 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                placeholder="Hora de Finalizacion"
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

export default CreateVisit