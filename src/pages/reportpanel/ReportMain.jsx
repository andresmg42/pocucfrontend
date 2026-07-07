import React, { useEffect, useState } from "react";
import useAuthStore from "../../stores/use-auth-store";
import api from "../../api/user.api";
import { useNavigate } from "react-router";
import SurveyReport from "../../components/reportpanel/SurveyReport";
import DeniedAccessPlaceholder from "../../components/placeholders/DeniedAccessPlaceholder";

const ReportMain = () => {
  const { userLogged, role } = useAuthStore();
  const [usertoken, setUserToken] = useState();
  const navigate = useNavigate();

  const isAdmin = role?.is_admin || false;

  return (
    <div className="flex-1  pl-5 pr-5">
      {!isAdmin ? <DeniedAccessPlaceholder /> : <SurveyReport />}
    </div>
  );
};

export default ReportMain;
