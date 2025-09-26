import { useState } from "react";
import useAuthStore from "../../stores/use-auth-store";
import { useEffect } from "react";
import api from "../../api/user.api";
import { useNavigate } from "react-router";
import toast from "react-hot-toast";

const VisitsList = ({surveysession_id}) => {

    const [visits,setVisits]=useState([])
    
    const [loading,setLoading]=useState(true);

    const {userLogged}=useAuthStore();

    const [visitedIsDeleted,setVisitIsDeleted]=useState(false)

    const navigate=useNavigate();

    useEffect(()=>{
        async function getVisits(){

          try {
            const res= await api.get(`visit/sessionvisits?surveysession_id=${surveysession_id}`)
            console.log('esta es la respuesta en visit',res)
            setVisits(res.data)
            
             
        }
        catch (error){
            console.log('error in SessionList',error)
        }
        finally{
          setLoading(false)
        }
        }
        getVisits();
    },[userLogged,visitedIsDeleted])

    

    if (loading){
      return <div className="text-center p-10 text-white">Loading users...</div>;
    }

    const handleClickStart= (visit_id)=>{
       console.log('este es el surveysession_id',surveysession_id)
        navigate(`categories/${visit_id}`)
    }

    const handleClickDelete=async (visit_id)=>{
      try {

        const res=await api.delete(`visit/delete/${visit_id}`)

        setVisitIsDeleted(prev=>!prev)

        toast.success('Visita Eliminada Exitosamente')

        
        
      } catch (error) {

        console.log('error deleting visit',error)
        
      }
    }

  return (
    <div className="container mx-auto p-4 sm:p-6 lg:p-8">
      <h1 className="text-2xl sm:text-3xl font-bold mb-6 text-gray-800">
        Lista de Visitas
      </h1>
      {/* Wrapper for responsive table */}
      <div className="overflow-x-auto relative shadow-md sm:rounded-lg">
        <table className="w-full text-sm text-left text-gray-500">
          <thead className="text-xs text-gray-700 uppercase bg-gray-50">
            <tr>
              <th scope="col" className="py-3 px-6">ID</th>
              <th scope="col" className="py-3 px-6">Numero de Sesion</th>
              <th scope="col" className="py-3 px-6">Numemro de Visita</th>
              <th scope="col" className="py-3 px-6">Fecha de Visita</th>
              <th scope="col" className="py-3 px-6">Hora de Inicio</th>
              <th scope="col" className="py-3 px-6">Hora de Finalizacion</th>
              <th scope="col" className="py-3 px-6">Estado</th>
            </tr>
          </thead>
          <tbody>
            {visits.map((visit) => (
              <tr 
              
              key={visit.id} className="bg-white border-b hover:bg-gray-100">
                {/* ID is bolded to make it stand out */}
                <th   scope="row" className="py-4 px-6 font-medium text-gray-900 whitespace-nowrap">
                  {visit.id}
                </th>
                <td className="py-4 px-6">{visit.surveysession}</td>
                <td className="py-4 px-6">{visit.visit_number}</td>
                <td className="py-4 px-6">{visit.visit_date}</td>
                <td className="py-4 px-6">{visit.start_time}</td>
                <td className="py-4 px-6">{visit.end_time}</td>
                <td className="py-4 px-6">{visit.complete? "Completada":
                
                <div>
                  <button
                
                type="button" 
                class="focus:outline-none text-white bg-green-700 hover:bg-green-800 focus:ring-4 focus:ring-green-300 font-medium rounded-lg text-sm px-5 py-2.5 me-2 mb-2 dark:bg-green-600 dark:hover:bg-green-700 dark:focus:ring-green-800"
                onClick={()=>handleClickStart(visit.id)}
                >Iniciar</button>

                <button
                
                type="button" 
                class="focus:outline-none text-white bg-red-700 hover:bg-red-800 focus:ring-4 focus:ring-red-300 font-medium rounded-lg text-sm px-5 py-2.5 me-2 mb-2 dark:bg-red-600 dark:hover:bg-red-700 dark:focus:ring-red-800"
                onClick={()=>handleClickDelete(visit.id)}
                >Eliminar</button>
                </div>
                  
                
}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      
    </div>
  )
}

export default VisitsList;