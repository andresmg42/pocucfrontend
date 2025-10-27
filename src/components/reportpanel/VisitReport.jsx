import React, { useEffect, useState } from 'react'
import { CompactTable } from '@table-library/react-table-library/compact';
import api from '../../api/user.api';
import { useTheme } from '@table-library/react-table-library/theme'; 
import { getTheme } from '@table-library/react-table-library/baseline'; 
import { useRowSelect } from '@table-library/react-table-library/select';
import { useNavigate, useParams } from 'react-router';

const VisitReport = () => {

  const [data,setData]=useState([]);
   const theme = useTheme(getTheme())
   const navigate=useNavigate()
   const {session_id}=useParams();

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

// const select = useRowSelect(tableData, {
//     onChange: (action, state) => {
//       const clickedItem = data.find((item) => item.id === state.id);

//       console.log('this is the state',state.id)
//       if (clickedItem) {
//         handleRowClick(clickedItem);
//       }
//     },
//   });


  return (
  
     
    <div className='bg-[url("/visitas/visitas.png")] bg-cover bg-center bg-no-repeat flex-1 p-5'>
      {data.length > 0 ? (
        
        <CompactTable columns={COLUMNS} data={tableData} theme={theme} />
      ) : (
        <div className='text-black'>Cargando datos o no hay observadores...</div>
      )}
    </div>
   
   
    
  )
}

export default VisitReport