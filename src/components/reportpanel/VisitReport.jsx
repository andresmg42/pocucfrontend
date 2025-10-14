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
    renderCell: (item) =>item.state===2? 'Completa' : item.state===2? 'En Proceso': 'No Iniciada'
  },
  
  { label: 'Fecha de Inicio', renderCell: (item) =>new Date(item.visit_start_date_time).toLocaleDateString() },
  { label: 'Fecha de Finalizacion', renderCell: (item) =>new Date(item.visit_end_date_time).toLocaleDateString() },
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
  
     
    <>
      {data.length > 0 ? (
        
        <CompactTable columns={COLUMNS} data={tableData} theme={theme} />
      ) : (
        <div className='text-black'>Cargando datos o no hay observadores...</div>
      )}
    </>
   
   
    
  )
}

export default VisitReport