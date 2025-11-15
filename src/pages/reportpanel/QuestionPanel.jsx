import React, { useEffect } from "react";
import { useState } from "react";
import api from "../../api/user.api";
import { useParams } from "react-router";
import { CompactTable } from "@table-library/react-table-library/compact";
import { useTheme } from "@table-library/react-table-library/theme";
import { getTheme } from "@table-library/react-table-library/baseline";
import { useRowSelect } from "@table-library/react-table-library/select";
import { useNavigate } from "react-router";


const QuestionPanel = () => {

  const {survey_id}=useParams();
 
  const [questions, setQuestions] = useState([]);
  const [tdata, setTData] = useState([]);
  const theme = useTheme(getTheme());
  const tableData = { nodes: tdata };
  const navigate=useNavigate();
  useEffect(() => {
    async function getQuestionsSurvey() {
      try {
        

        const res=await api.get(`question/get_questions_by_survey?survey_id=${survey_id}`)
        console.log("data en questionsTable",res.data)
        setTData(res.data)
      } catch (error) {
        console.error("error", error);
      }
    }

    getQuestionsSurvey();
  }, []);

  const handleRowClick = (clickedItem) => {

    navigate(`stats/${clickedItem.id}`)
    

    
  };

  const select = useRowSelect(tableData, {
    onChange: (action, state) => {
      const clickedItem = tdata.find((item) => item.id === state.id);

      if (clickedItem) {
        handleRowClick(clickedItem);
      }
    },
  });

  const COLUMNS = [
    { label: "id", renderCell: (item) => item.id },
    {
      label: "codigo",
      renderCell: (item) => item.code,
    },
    { label: "descripcion", renderCell: (item) => item.description },
    { label: "subcategoria", renderCell: (item) => item.subcategory },
    

  ];

  return (
    <div className="flex-1 p-5">
      <CompactTable
          columns={COLUMNS}
          data={tableData}
          theme={theme}
          select={select}/>

    </div>
              
  );
};

export default QuestionPanel;