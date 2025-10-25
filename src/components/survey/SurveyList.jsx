import { useEffect, useState } from "react";
import SurveyCard from "./SurveyCard";
import api from "../../api/user.api";

const SurveyList = () => {
  const [surveys, setSurveys] = useState([]);

  useEffect(() => {
    async function getSurveys() {
      try {
        const surveys = await api.get("survey/list/");
        console.log(surveys);
        setSurveys(surveys.data);
      } catch (error) {
        console.log(error);
      }
    }

    getSurveys();
  }, []);

  return (
    <div className="flex-1 flex bg-[url('/home/home.png')] bg-no-repeat bg-cover bg-center">
      <div className="bt-green-700 md:w-1/2"></div>

      <div className="md:w-1/2">
        <div className="grid grid-cols-1 m-10 md:grid-cols-2 gap-3 pt-10">
          {surveys.map((survey) => (
            <SurveyCard key={survey.id} survey={survey} />
          ))}
        </div>
      </div>
    </div>
  );
};

export default SurveyList;
