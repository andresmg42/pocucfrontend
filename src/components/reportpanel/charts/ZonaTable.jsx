import React, { useEffect, useState } from 'react'
import api from '../../../api/user.api'



const ZonaTable = ({setIdZone}) => {

    const [zones,setZones]=useState([]);
    // const [selectedZone,setSelectedZone]=useState(0);

    useEffect(()=>{
        async function getZones(){
        try {
            const res=await api.get('zone/')
            
            setZones(res.data)

        } catch (error) {
            console.error('error',error)
            
        }
        }

        getZones();
    },[])

  return (
    <div className="max-w-4xl mx-auto p-4 sm:p-6 lg:p-8">
  <div className="bg-white shadow-md rounded-lg overflow-hidden">
    <div className="px-6 py-4">
      <h1 className="text-2xl font-bold text-gray-800">Zonas</h1>
    </div>
    
    <div className="overflow-x-auto">
      <table className="w-full text-left">
        <thead className="bg-gray-50 border-b border-gray-200">
          <tr>
            <th className="px-6 py-3 text-xs font-semibold text-gray-600 uppercase tracking-wider">
              Nombre Zona
            </th>
            <th className="px-6 py-3 text-xs font-semibold text-gray-600 uppercase tracking-wider">
             Numero Zona
            </th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-200">
          {zones.map((zone) => (
            <tr 
            onClick={()=>setIdZone(zone.id)}
            key={zone.id} className="hover:bg-gray-100 transition-colors duration-200 cursor-pointer">
              <td className="px-6 py-4 whitespace-nowrap text-gray-700">
                {zone.name}
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-gray-500">
                {zone.number}
              </td>
            </tr>
          ))}
           <tr 
           onClick={()=>setIdZone(0)}
           className="hover:bg-gray-100 transition-colors duration-200 cursor-pointer">
              <td className="px-6 py-4 whitespace-nowrap text-gray-700">
                General
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-gray-500">
                0
              </td>
            </tr>
        </tbody>
      </table>
    </div>
  </div>
</div>
  )
}

export default ZonaTable