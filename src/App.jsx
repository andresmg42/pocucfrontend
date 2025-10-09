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
import Form from "./pages/survey/Form.jsx";
import Category from "./pages/categories/Category.jsx";
import CreateSession from "./components/surveysession/CreateSession.jsx";
import OberverTable from "./components/reportpanel/ObserverTable.jsx";
// src/App.js (or wherever your main component is)
import { getTheme } from '@table-library/react-table-library/baseline';
function App() {
  return (
    <BrowserRouter>
      <Toaster/>
      <Layout>
        <Routes>
          <Route index path="/" element={<Home />}></Route>
          <Route  path="login/" element={<Login />}></Route>
          <Route  path="surveysession/:survey_id" element={<SurveySession />}></Route>
          <Route  path="surveysession/:survey_id/visits/:surveysession_id/:visit_number" element={<Visits />}></Route>
          <Route  path="surveysession/:survey_id/visits/:surveysession_id/:visit_number/:categories/:visit_id" element={<Category />}></Route>
          <Route  path="surveysession/:survey_id/visits/:surveysession_id/:visit_number/categories/:visit_id/form/:category_id/:category_name/" element={<Form />}></Route> 
          <Route  path="reportPanel/" element={<OberverTable/>}></Route>
        </Routes>
      </Layout>
    </BrowserRouter>
  );
}

export default App;
