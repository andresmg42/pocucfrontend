import React, { useEffect, useState } from 'react'
import { CompactTable } from '@table-library/react-table-library/compact';
import api from '../../api/user.api';
import { useTheme } from '@table-library/react-table-library/theme'; // <-- 1. IMPORT THIS
import { getTheme } from '@table-library/react-table-library/baseline'; // <-- 2. IMPORT THIS

const OberverTable = () => {

  const [data,setData]=useState([]);
   const theme = useTheme(getTheme())

  useEffect(()=>{
    async function get_observer_table(){
      try {

        const res=await api.get('observer/get_table_observer_info')

        console.log('data in table oberver:',res.data.data);

        if(res.data && res.data.data){
          setData(res.data.data)
        }

        
        

        
      } catch (error) {

        console.error('error in ObserveTable',error)
        }
        
      }

     get_observer_table(); 
    }
  ,[])
  const COLUMNS = [
  { label: 'Id', renderCell: (item) => item.id },
  {
    label: 'Observador',
    renderCell: (item) =>item.name
  },
  { label: 'Email', renderCell: (item) => item.email },
  {
    label: 'Sesiones Completadas',
    renderCell: (item) => item.sessions,
  },
  { label: 'Tasa de Completacion', renderCell: (item) => item.completed_rate },
  { label: 'Fecha de Registro', renderCell: (item) =>new Date(item.register_date).toLocaleDateString() },
];
  return (
  
     
    <>
      {data.length > 0 ? (
        // 4. PASS THE THEME TO THE TABLE COMPONENT
        <CompactTable columns={COLUMNS} data={{ nodes: data }} theme={theme} />
      ) : (
        <div className='text-black'>Cargando datos o no hay observadores...</div>
      )}
    </>
   
   
    
  )
}

export default OberverTable