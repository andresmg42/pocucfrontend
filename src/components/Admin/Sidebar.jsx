import {
  Database,
  MapPin,
  Tag,
  FileText,
  Users,
  Calendar,
  ClipboardList,
  Building,
  UserCircle,
} from "lucide-react";

import { useTranslation } from "react-i18next";

export default function Sidebar({ currentPage, onNavigate }) {
  const { t } = useTranslation();

  const menuItems = [
    { id: "campus", labelKey: "menu.campus", icon: Building },
    { id: "zone", labelKey: "menu.zone", icon: MapPin },
    { id: "category", labelKey: "menu.category", icon: Tag },
    { id: "subcategory", labelKey: "menu.subcategory", icon: FileText },
    { id: "option", labelKey: "menu.option", icon: ClipboardList },
    { id: "observer", labelKey: "menu.observer", icon: UserCircle },
    { id: "survey", labelKey: "menu.survey", icon: Database },
    { id: "surveysession", labelKey: "menu.surveysession", icon: Users },
    { id: "visit", labelKey: "menu.visit", icon: Calendar },
    { id: "response", labelKey: "menu.response", icon: FileText },
  ];

  return (
    <aside className="w-64 bg-red-700 text-white min-h-screen flex flex-col">
      <div className="p-6 border-b border-red-600">
        <h1 className="text-2xl font-bold">{t("menu.AdminPanel")}</h1>
        <p className="text-red-100 text-sm mt-1">Universidad del Valle</p>
      </div>

      <nav className="flex-1 p-4">
        <ul className="space-y-2">
          {menuItems.map((item) => {
            const Icon = item.icon;
            const isActive = currentPage === item.id;

            return (
              <li key={item.id}>
                <button
                  onClick={() => onNavigate(item.id)}
                  className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
                    isActive
                      ? "bg-white text-red-700 font-semibold"
                      : "text-red-50 hover:bg-red-600"
                  }`}
                >
                  <Icon size={20} />
                  <span>{t(item.labelKey)}</span>
                </button>
              </li>
            );
          })}
        </ul>
      </nav>

      <div className="p-4 border-t border-red-600">
        <p className="text-xs text-red-100 text-center">
          © 2026 Universidad del Valle
        </p>
      </div>
    </aside>
  );
}
