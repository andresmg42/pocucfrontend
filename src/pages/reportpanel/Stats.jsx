import React, { useEffect } from "react";
import { useState } from "react";
import api from "../../api/user.api";
import { useParams } from "react-router";
import { CompactTable } from "@table-library/react-table-library/compact";
import { useTheme } from "@table-library/react-table-library/theme";
import { getTheme } from "@table-library/react-table-library/baseline";
import { useRowSelect } from "@table-library/react-table-library/select";
import ChartBarMatrixR from "../../components/reportpanel/charts/ChartBarMatrixR";
import ChartBarUniqueR from "../../components/reportpanel/charts/ChartBarUniqueR";
import ZonaTable from "../../components/reportpanel/charts/ZonaTable";
import { useNavigate } from "react-router";
import AggregationPanel from "../../components/reportpanel/charts/AggregationPanel";

const Stats = () => {
  const { question_id,survey_id } = useParams();
  const [question, setQuestion] = useState(null);
  const [BarChartDataMR, setBarChartDataMR] = useState([]);
  const [BarChartDataUR, setBarChartDataUR] = useState([]);
  const [charTriggerUR, setCharTriggerUR] = useState(false);
  const [idZone, setIdZone] = useState(0);
  const [loading,setLoading]=useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    async function getStats() {
      
      try {
        if (!question_id) return;

        let res;

        if (idZone === 0) {
          res = await api.get(
            `pocucstats/descriptive_analisis_by_question?question_id=${question_id}&survey_id=${survey_id}`
          );
          console.log("respuesta en la zona 0", res.data);
        } else {
          res = await api.get(
            `pocucstats/descriptive_analisis_by_question?question_id=${question_id}&zone_id=${idZone}&survey_id=${survey_id}`
          );
          console.log("respueta en la zona diferente de 0", res.data);
        }

        setQuestion(res.data);
      } catch (error) {
        setQuestion(null);
        setLoading(false);
        console.error("error", error);
      }
      finally{
        setLoading(false)
      }
    }

    getStats();
  }, [idZone, question_id]);

  useEffect(() => {
    if (!question) {
      setBarChartDataMR([]);
      setBarChartDataUR([]);
      setCharTriggerUR(false);
      return;
    }

    if (question.visualization_type === "stacked_bar_100_percent") {
      setBarChartDataMR(question.data);
      setCharTriggerUR(false);
    } else {
      console.log("question_bar_chart", question.data);

      setBarChartDataUR(question.data);
      console.log("barchar_data_UR", BarChartDataUR);

      setCharTriggerUR(true);
    }
  }, [question]);

  if(loading) return (
    <div class="flex items-center justify-center p-12">
  <div class="flex flex-col items-center gap-4">
    <div 
      class="h-12 w-12 animate-spin rounded-full border-4 border-solid border-blue-500 border-t-transparent"
    ></div>
    
    <p class="text-lg font-medium text-gray-600">
      Loading your data...
    </p>
  </div>
</div>

  )

 

  return (
    <div className="flex flex-1 bg-[url('/visitas/visitas.png')] bg-cover bg-center bg-no-repeat p-10 flex-col  ">
      {charTriggerUR ? (
        <div className="flex items-center justify-center">
          <div className="flex flex-col items-center">
            <div className="h-[50vh] w-[140vh] bg-gray-200 rounded-lg">
              <ChartBarUniqueR data={BarChartDataUR} />
            </div>
          </div>
        </div>
      ) : (
        <div className="flex items-center justify-center">
          <div className="flex flex-col items-center">
            <div className="h-[50vh] w-[140vh] bg-gray-200 rounded-lg">
              <ChartBarMatrixR data={BarChartDataMR} />
            </div>
          </div>
        </div>
      )}

      <div className=" flex flex-col md:flex-row items-center justify-center">
        <div >
        <ZonaTable setIdZone={setIdZone} />
      </div>
      <div ><AggregationPanel data={question?.aggregate_stats}/></div>

      </div>
      
    </div>
  );
};

export default Stats;
