import React, { useEffect, useState } from 'react'
import api from '../../api/user.api'
import useAuthStore from '../../stores/use-auth-store'

const SessionList = ({survey_id}) => {

    const [sessions,setSessions]=useState([])
    
    const [loading,setLoading]=useState(true);

    const {userLogged}=useAuthStore();

    useEffect(()=>{
        async function getSession(){

          
          
          try {
            const res= await api.get(`surveysession/get_survey_session_by_id?survey_id=${survey_id}&email=${userLogged.email}`)
            console.log('esta es la respuesta en sessionlist',res)
            setSessions(res.data)
            
           
            
        }
        catch (error){
            console.log('error in SessionList',error)
        }
        finally{
          setLoading(false)
        }
        }
        getSession();
    },[userLogged])

    

    if (loading){
      return <div className="text-center p-10 text-white">Loading users...</div>;
    }
  return (
    <div className="container mx-auto p-4 sm:p-6 lg:p-8">
      <h1 className="text-2xl sm:text-3xl font-bold mb-6 text-gray-800">
        Lista de Sesiónes
      </h1>
      {/* Wrapper for responsive table */}
      <div className="overflow-x-auto relative shadow-md sm:rounded-lg">
        <table className="w-full text-sm text-left text-gray-500">
          <thead className="text-xs text-gray-700 uppercase bg-gray-50">
            <tr>
              <th scope="col" className="py-3 px-6">ID</th>
              <th scope="col" className="py-3 px-6">Numero de Observador</th>
              <th scope="col" className="py-3 px-6">Numemro de Encuesta</th>
              <th scope="col" className="py-3 px-6">Numero de Zona</th>
              <th scope="col" className="py-3 px-6">Fecha de Inicio</th>
              <th scope="col" className="py-3 px-6">Fecha de Finalizacion</th>
              <th scope="col" className="py-3 px-6">Distancia de Observacion(m)</th>
              <th scope="col" className="py-3 px-6">Fecha de Carga</th>
              <th scope="col" className="py-3 px-6">Url Evidencia</th>
            </tr>
          </thead>
          <tbody>
            {sessions.map((session) => (
              <tr key={session.id} className="bg-white border-b hover:bg-gray-100">
                {/* ID is bolded to make it stand out */}
                <th scope="row" className="py-4 px-6 font-medium text-gray-900 whitespace-nowrap">
                  {session.id}
                </th>
                <td className="py-4 px-6">{session.observer}</td>
                <td className="py-4 px-6">{session.survey}</td>
                <td className="py-4 px-6">{session.zone}</td>
                <td className="py-4 px-6">{session.start_date}</td>
                <td className="py-4 px-6">{session.end_date}</td>
                <td className="py-4 px-6">{session.observational_distance}</td>
                <td className="py-4 px-6">{session.uploaded_at}</td>
                <td className="py-4 px-6">{session.url}</td>
                
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      
    </div>
  )
}

export default SessionList