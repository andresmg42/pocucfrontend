import { useState } from "react";
import Sidebar from "../../components/Admin/Sidebar.jsx";
import AdminToaster from "../../components/Admin/Toaster.jsx";
import CampusPage from "./CampusPage.jsx";
import ZonePage from "./ZonePage.jsx";
import CategoryPage from "./CategoryPage.jsx";
import SubcategoryPage from "./SubcategoryPage.jsx";
import OptionPage from "./OptionPage.jsx";
import ObserverPage from "./ObserverPage.jsx";
import SurveyPage from "./SurveyPage.jsx";
import SurveysessionPage from "./SurveysessionPage.jsx";
import VisitPage from "./VisitPage.jsx";
import ResponsePage from "./ResponsePage.jsx";

const pageMap = {
  campus: CampusPage,
  zone: ZonePage,
  category: CategoryPage,
  subcategory: SubcategoryPage,
  option: OptionPage,
  observer: ObserverPage,
  survey: SurveyPage,
  surveysession: SurveysessionPage,
  visit: VisitPage,
  response: ResponsePage,
};

export default function AdminLayout() {
  const [currentPage, setCurrentPage] = useState("campus");
  const ActivePage = pageMap[currentPage] || CampusPage;

  return (
    <div className="flex min-h-screen w-full bg-gray-50">
      <Sidebar currentPage={currentPage} onNavigate={setCurrentPage} />
      <main className="flex-1 overflow-auto">
        <ActivePage />
      </main>
      <AdminToaster />
    </div>
  );
}
