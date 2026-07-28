import { useEffect, useState } from "react";
import SurveyCard from "./SurveyCard";
import api from "../../api/user.api";
import SurveyCardPlaceholder from "./SurveyCardPlaceholder";
import useAuthStore from "../../stores/use-auth-store";

const SurveyList = () => {
  const [surveys, setSurveys] = useState([]);
  const [loading, setLoading] = useState(true);

  const { token, isLoading } = useAuthStore();

  useEffect(() => {
    async function getSurveys() {
      try {
        const surveys = await api.get("survey/list/");

        setSurveys(surveys.data);
      } catch (error) {
        setLoading(false);
      } finally {
        setLoading(false);
      }
    }

    if (isLoading || !token) return;

    getSurveys();
  }, [token, isLoading]);

  return (
    <div className=" bg-[url('/formulario/formulario.png')] bg-cover bg-center bg-no-repeat flex-1 flex flex-col">
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
};

export default SurveyList;
