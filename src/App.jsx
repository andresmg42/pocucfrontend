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
import ObserverReport from "./components/reportpanel/ObserverReport.jsx";
import SessionsReport from "./components/reportpanel/SessionsReport.jsx";
import VisitReport from "./components/reportpanel/VisitReport.jsx";
import ReportMain from "./pages/reportpanel/ReportMain.jsx";
import Stats from "./pages/reportpanel/Stats.jsx";
import QuestionPanel from "./pages/reportpanel/QuestionPanel.jsx";
function App() {
  return (
    <BrowserRouter>
      <Toaster />
      <Layout>
        <Routes>
          <Route index path="/" element={<Home />}></Route>
          <Route path="login/" element={<Login />}></Route>
          <Route
            path="surveysession/:survey_id"
            element={<SurveySession />}
          ></Route>
          <Route
            path="surveysession/:survey_id/visits/:surveysession_id/:visit_number"
            element={<Visits />}
          ></Route>
          <Route
            path="surveysession/:survey_id/visits/:surveysession_id/:visit_number/:categories/:visit_id"
            element={<Category />}
          ></Route>
          <Route
            path="surveysession/:survey_id/visits/:surveysession_id/:visit_number/categories/:visit_id/form/:category_id/:category_name/"
            element={<Form />}
          ></Route>
          <Route path="report-panel-surveys/" element={<ReportMain />}></Route>
          {/* <Route  path="report-panel-surveys/" element={<SurveyReport/>}></Route> */}
          <Route
            path="report-panel-surveys/report-panel-observers/:survey_id/:survey_name"
            element={<ObserverReport />}
          ></Route>
          <Route
            path="report-panel-surveys/report-panel-observers/:survey_id/:survey_name/report-panel-sessions/:observer_id/:observer_name"
            element={<SessionsReport />}
          ></Route>
          <Route
            path="report-panel-surveys/report-panel-observers/:survey_id/:survey_name/report-panel-sessions/:observer_id/:observer_name/report-panel-visits/:session_id/:session_number"
            element={<VisitReport />}
          ></Route>
          <Route
            path="questions-panel/:survey_id/:survey_name"
            element={<QuestionPanel />}
          />
          <Route
            path="questions-panel/:survey_id/:survey_name/stats/:question_id/:description/:code"
            element={<Stats />}
          />
        </Routes>
      </Layout>
    </BrowserRouter>
  );
}

export default App;
