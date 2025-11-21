import { useEffect, useState } from "react";
import SurveyCard from "./SurveyCard";
import api from "../../api/user.api";
import SurveyCardPlaceholder from "./SurveyCardPlaceholder";

const SurveyList = () => {
  const [surveys, setSurveys] = useState([]);
  const [loading,setLoading]=useState(true);

  useEffect(() => {
    async function getSurveys() {
      try {
        const surveys = await api.get("survey/list/");
        console.log(surveys);
        setSurveys(surveys.data);
      } catch (error) {
        console.log(error);
        setLoading(false);
      }
      finally{
        setLoading(false);
      }
    }

    getSurveys();
  }, []);

 

  return (
    <div className="flex-1 flex flex-col">
      {!loading ? (
        <div className="w-full p-4">
          <div className="grid grid-cols-1 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 w-full items-stretch">
            {surveys.map((survey) => (
              <SurveyCard key={survey.id} survey={survey} />
            ))}
          </div>
        </div>
      ) : (
        <div className="w-full p-4">
          <div className="grid grid-cols-1 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 w-full items-stretch">
            <SurveyCardPlaceholder />
            <SurveyCardPlaceholder />
            <SurveyCardPlaceholder />
            <SurveyCardPlaceholder />
          </div>
        </div>
      )}
    </div>
  );
}

export default SurveyList;
