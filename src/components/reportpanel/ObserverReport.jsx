import React, { useEffect, useState } from 'react'
import { CompactTable } from '@table-library/react-table-library/compact';
import api from '../../api/user.api';
import { useTheme } from '@table-library/react-table-library/theme'; 
import { getTheme } from '@table-library/react-table-library/baseline'; 
import { useRowSelect } from '@table-library/react-table-library/select';
import { useNavigate, useParams } from 'react-router';
import Spinner from './Spinner';


const ObserverReport = () => {
  const {survey_id}=useParams();
  const [data,setData]=useState([]);
   const theme = useTheme(getTheme())
   const navigate=useNavigate()
   const [loading,setLoading]=useState(true);

   const tableData={ nodes: data }

  useEffect(()=>{
    async function get_observer_table(){
      try {

        const res=await api.get(`observer/get_table_observer_info?survey_id=${survey_id}`)

        console.log('data in table oberver:',res.data.data);

        if(res.data && res.data.data){
          setData(res.data.data)
        }

        
      } catch (error) {

        console.error('error in ObserveTable',error)
        setLoading(false)
        }finally{
          setLoading(false)
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
  { label: 'Tasa de Completacion', renderCell: (item) => `${item.completed_rate} %` },
  { label: 'Fecha de Registro', renderCell: (item) =>new Date(item.register_date).toLocaleDateString() },
];

const handleRowClick=(item)=>{

  navigate(`report-panel-sessions/${item.id}`)
  
}

const select = useRowSelect(tableData, {
    onChange: (action, state) => {
      const clickedItem = data.find((item) => item.id === state.id);

      console.log('this is the state',state.id)
      if (clickedItem) {
        handleRowClick(clickedItem);
      }
    },
  });

  if(loading){
    return (
      <div className="flex flex-col items-center justify-center flex-1 h-[60vh]   ">
        <Spinner/>
        
      <span className="text-lg text-slate-600">
        Loading data...
      </span>
      </div>
    );
  }


  return (
  
     
   <div className="flex-1 p-5 ">
      {data.length > 0 ? (
        
        <CompactTable columns={COLUMNS} data={tableData} theme={theme} select={select}/>
      ) : (
        <div className='text-black'>Cargando datos o no hay observadores...</div>
      )}
    </div>
   
   
    
  )
}

export default ObserverReport