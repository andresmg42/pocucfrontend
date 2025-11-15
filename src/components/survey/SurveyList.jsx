import { useEffect, useState } from "react";
import SurveyCard from "./SurveyCard";
import api from "../../api/user.api";
import SurveyCardPlaceholder from "./SurveyCardPlaceholder";

const SurveyList = () => {
  const [surveys, setSurveys] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function getSurveys() {
      try {
        const surveys = await api.get("survey/list/");
        console.log(surveys);
        setSurveys(surveys.data);
      } catch (error) {
        console.log(error);
        setLoading(false);
      } finally {
        setLoading(false);
      }
    }

    getSurveys();
  }, []);

  return (
    <div className="flex-1 flex flex-col md:flex-row">
      <div className="md:w-1/2">
        {!loading ? (
          <div className="grid grid-cols-1 m-5 md:grid-cols-2 gap-3 ">
            {surveys.map((survey) => (
              <SurveyCard key={survey.id} survey={survey} />
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 m-5   md:grid-cols-2 gap-3 ">
            <SurveyCardPlaceholder />
            <SurveyCardPlaceholder />
            <SurveyCardPlaceholder />
            <SurveyCardPlaceholder />
          </div>
        )}
      </div>

      <div className="bt-green-700 md:w-1/2 "></div>
      
    </div>
  );
};

export default SurveyList;
