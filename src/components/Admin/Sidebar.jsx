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

export default function Sidebar({ currentPage, onNavigate }) {
  const menuItems = [
    { id: "campus", label: "Campus", icon: Building },
    { id: "zone", label: "Zones", icon: MapPin },
    { id: "category", label: "Categories", icon: Tag },
    { id: "subcategory", label: "Subcategories", icon: FileText },
    { id: "option", label: "Options", icon: ClipboardList },
    { id: "observer", label: "Observers", icon: UserCircle },
    { id: "survey", label: "Surveys", icon: Database },
    { id: "surveysession", label: "Survey Sessions", icon: Users },
    { id: "visit", label: "Visits", icon: Calendar },
    { id: "response", label: "Responses", icon: FileText },
  ];

  return (
    <aside className="w-64 bg-red-700 text-white min-h-screen flex flex-col">
      <div className="p-6 border-b border-red-600">
        <h1 className="text-2xl font-bold">Admin Panel</h1>
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
                  <span>{item.label}</span>
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
