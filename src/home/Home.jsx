import React, { useEffect } from "react";
import useAuthStore from "../stores/use-auth-store";
import api from "../api/user.api";
import { useState } from "react";
import SurveyList from "../components/survey/SurveyList";
import { useNavigate } from "react-router";

function Home() {
  const navigate = useNavigate();
  const { userLogged,isLoading } = useAuthStore();

 useEffect(() => {


  if (isLoading) return;


     
    if (!userLogged) {
      navigate("login/");
    }
  }, [userLogged,isLoading,navigate]);

  return (
    <div className="">
      <SurveyList />
    </div>
  );
}

export default Home;
