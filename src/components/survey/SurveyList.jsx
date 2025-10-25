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
    <div className="md:flex min-h-screen flex-row-reverse bg-[url('home/home.png')] bg-cover bg-center ">
      <div className="w-full md:w-1/2   flex justify-end">
        <div className="grid grid-cols-1 m-10 md:grid-cols-2 gap-3 pt-20">
          {surveys.map((survey) => (
            <SurveyCard key={survey.id} survey={survey} />
          ))}
        </div>
      </div>
      <div className="w-full md:w-1/2  p-8 flex justify-start items-center"></div>
    </div>
  );
};

export default SurveyList;
