import React, { useEffect, useState } from 'react'
import { CompactTable } from '@table-library/react-table-library/compact';
import api from '../../api/user.api';
import { useTheme } from '@table-library/react-table-library/theme'; 
import { getTheme } from '@table-library/react-table-library/baseline'; 
import { useRowSelect } from '@table-library/react-table-library/select';
import { useNavigate } from 'react-router';
import Spinner from './Spinner';

const SurveyReport = () => {

  const [data,setData]=useState([]);
   const theme = useTheme(getTheme())
   const navigate=useNavigate()
   const [loading,setLoading]=useState(true);

   const tableData={ nodes: data }

  useEffect(()=>{
    async function get_observer_table(){
      try {

        const res=await api.get('survey/list')

        console.log('data in table survey:',res.data);

        if(res.data ){
          setData(res.data)
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
    label: 'Nombre',
    renderCell: (item) =>item.name
  },
  { label: 'Tema', renderCell: (item) => item.topic },
  {
    label: 'descripcion',
    renderCell: (item) => item.description,
  },
  { label: 'Fecha de Creacion', renderCell: (item) =>new Date(item.uploaded_at).toLocaleDateString() },
  { label: 'Estadisticas', renderCell: (item) =><button  className='text-blue-700 cursor-pointer' onClick={()=>navigate(`/questions-panel/${item.id}`)}>{`Estadisticas ${item.name}`}</button> },
];

const handleRowClick=(item)=>{

  navigate(`report-panel-observers/${item.id}`)
  
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
      <div className='flex flex-col items-center justify-center flex-1 h-[60vh]  flex'>
        <Spinner/>
        
      <span className="text-lg text-slate-600">
        Loading data...
      </span>
      </div>
    );
  }


  return (
  
     
    <div className=''>
      {data.length > 0 ? (
        
       
          <CompactTable columns={COLUMNS} data={tableData} theme={theme} select={select}/>
        
      ) : (
        <div className='text-black'>Cargando datos o no hay observadores...</div>
      )}
    </div>
   
   
    
  )
}

export default SurveyReport