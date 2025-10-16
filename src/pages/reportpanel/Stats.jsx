import React, { useEffect } from 'react'
import { useState } from 'react'
import api from '../../api/user.api'
import { useParams } from 'react-router'
import { CompactTable } from '@table-library/react-table-library/compact';
import { useTheme } from '@table-library/react-table-library/theme'; 
import { getTheme } from '@table-library/react-table-library/baseline'; 
import { useRowSelect } from '@table-library/react-table-library/select';
import ChartBar from './charts/ChartBar';

const Stats = () => {
    const {survey_id}=useParams();
    const[questions,setQuestions]=useState([]);
    const [BarChartData,setBarChartData]=useState([]);
    const [charTrigger,setCharTrigger]=useState(false);
    const[tdata,setTData]=useState([]);
    const theme = useTheme(getTheme());
    const tableData={ nodes: tdata }
    useEffect(()=>{
        async function getStats(){
            try {

            const res=await api.get(`pocucstats/descriptive_analisis_by_survey?survey_id=${survey_id}`)
            console.log(res.data)
            setQuestions(res.data)

            setTData(res.data.map((q)=>({
                'id':q.id,
                'question_code':q.question_code,
                'description':q.description})))
            

            // console.log('questions:',data)
            
        } catch (error) {

            console.error('error',error)
            
        }
        }

        getStats()

    },[])

    const handleRowClick=(clickedItem)=>{

        // console.log(clickedItem)
        
        const question=questions.find(q=>q.id==clickedItem.id)
        console.log('question:',question.visualization_type)
        if (question.visualization_type==='stacked_bar_100_percent'){
            setBarChartData(question.data)

        }

        console.log('BarChart Data',BarChartData)
        setCharTrigger(true)

    }

    const select = useRowSelect(tableData, {
        onChange: (action, state) => {
          const clickedItem = tdata.find((item) => item.id === state.id);
    
          
          if (clickedItem) {
            handleRowClick(clickedItem);
          }
        },
      });

    

    
    

    

const COLUMNS = [
  { label: 'id', renderCell: (item) => item.id },
  {
    label: 'codigo',
    renderCell: (item) =>item.question_code
  },
  { label: 'descripcion', renderCell: (item) => item.description },
  
];


  return (<>
  {
    !charTrigger?
    <CompactTable columns={COLUMNS} data={tableData} theme={theme} select={select} />
    : <ChartBar data={BarChartData}/>
  }
  </>
  )  
  
}

export default Stats