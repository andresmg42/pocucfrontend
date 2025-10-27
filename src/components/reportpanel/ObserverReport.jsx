import React, { useEffect, useState } from 'react'
import { CompactTable } from '@table-library/react-table-library/compact';
import api from '../../api/user.api';
import { useTheme } from '@table-library/react-table-library/theme'; 
import { getTheme } from '@table-library/react-table-library/baseline'; 
import { useRowSelect } from '@table-library/react-table-library/select';
import { useNavigate, useParams } from 'react-router';


const ObserverReport = () => {
  const {survey_id}=useParams();
  const [data,setData]=useState([]);
   const theme = useTheme(getTheme())
   const navigate=useNavigate()

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


  return (
  
     
   <div className="flex-1 p-5 bg-[url('/inicio-sesion/login.png')] bg-cover bg-center bg-no-repeat">
      {data.length > 0 ? (
        
        <CompactTable columns={COLUMNS} data={tableData} theme={theme} select={select}/>
      ) : (
        <div className='text-black'>Cargando datos o no hay observadores...</div>
      )}
    </div>
   
   
    
  )
}

export default ObserverReport