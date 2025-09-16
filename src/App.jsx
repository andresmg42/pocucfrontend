import { useState } from "react";
import reactLogo from "./assets/react.svg";
import viteLogo from "/vite.svg";
import "./App.css";
import { BrowserRouter, Route, Routes } from "react-router";
import Home from "./home/Home.jsx";
import Login from "./session/Login.jsx";
import Layout from "./layout/Layout.jsx";
import SurveySession from "./pages/survey_sessions/SurveySession.jsx";
import { Toaster } from "react-hot-toast";
import Visits from "./pages/visits/Visits.jsx";
function App() {
  return (
    <BrowserRouter>
      <Toaster/>
      <Layout>
        <Routes>
          <Route index path="/" element={<Home />}></Route>
          <Route index path="login/" element={<Login />}></Route>
          <Route index path="surveysession/:id" element={<SurveySession />}></Route>
          <Route index path="surveysession/:id/visits/:id" element={<Visits />}></Route>
          
        </Routes>
      </Layout>
    </BrowserRouter>
  );
}

export default App;
