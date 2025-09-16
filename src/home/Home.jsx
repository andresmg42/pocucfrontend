import React, { useEffect } from "react";
import useAuthStore from "../stores/use-auth-store";
import api from "../api/user.api";
import { useState } from "react";
import SurveyList from "../components/survey/SurveyList";
import { useNavigate } from "react-router";

function Home() {
  const navigate = useNavigate();
  const { userLogged } = useAuthStore();

 useEffect(() => {
     console.log('entro a useEffect')
    if (userLogged==null) {
      navigate("login/");
    }
  }, []);

  return (
    <div className="flex items-center justify-center min-h-screen">
      <SurveyList />
    </div>
  );
}

export default Home;
