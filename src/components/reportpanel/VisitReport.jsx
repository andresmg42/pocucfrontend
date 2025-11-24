import React, { useEffect, useState } from 'react'
import { CompactTable } from '@table-library/react-table-library/compact';
import api from '../../api/user.api';
import { useTheme } from '@table-library/react-table-library/theme'; 
import { getTheme } from '@table-library/react-table-library/baseline'; 
import { useRowSelect } from '@table-library/react-table-library/select';
import { useNavigate, useParams } from 'react-router';
import Spinner from './Spinner';

const VisitReport = () => {

  const [loading,setLoading]=useState(true);
  const [data,setData]=useState([]);
   const theme = useTheme(getTheme())
   const navigate=useNavigate()
   const {session_id,session_number}=useParams();

   const tableData={ nodes: data }

  useEffect(()=>{
    async function get_observer_table(){
      try {

        const res=await api.get(`visit/sessionvisits/?surveysession_id=${session_id}`)

        console.log('data in table survey:',res.data);

        if(res.data ){
          setData(res.data)
        }

        
      } catch (error) {

        console.error('error in ObserveTable',error)
        setLoading(false);
        }finally{
          setLoading(false);
        }
        
      }

     get_observer_table(); 
    }
  ,[])
  const COLUMNS = [
  { label: 'Id', renderCell: (item) => item.id },
  {
    label: 'Numero de Visita',
    renderCell: (item) =>item.visit_number
  },
  {
    label: 'Estado',
    renderCell: (item) =>item.state===2? 'Completa' : item.state===1? 'En Proceso': 'No Iniciada'
  },
  
  { label: 'Fecha de Inicio', renderCell: (item) =>item.visit_start_date_time? new Date(item.visit_start_date_time).toLocaleDateString() : 'N/A' },
  { label: 'Fecha de Finalizacion', renderCell: (item) =>item.visit_end_date_time? new Date(item.visit_end_date_time).toLocaleDateString() : 'N/A' },
];

const handleRowClick=(item)=>{

  navigate(`report-panel-observers/${item.id}`)
  
}

if(loading){
    return (
      <div className='flex flex-col items-center justify-center flex-1 h-[60vh]'>
        <Spinner/>
        
      <span className="text-lg text-slate-600">
        Loading data...
      </span>
      </div>
    );
  }


  return (

    <div className='flex flex-col items-center justify-center w-full'>

    <div className='flex items-center justify-center bg-black/2 w-full p-5'>

      <h1 className='text-black text-xl font-bold'>Reporte de visitas para la sesión numero {session_number}</h1>

    </div>
    <div className='flex-1 p-5 w-full'>
      {data.length > 0 ? (
        
        <CompactTable columns={COLUMNS} data={tableData} theme={theme} />
      ) : (
        <div className='text-black'>Cargando datos o no hay Visitas...</div>
      )}
    </div>
    </div>
   
   
    
  )
}

export default VisitReport