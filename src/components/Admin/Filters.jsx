import React, { useState, useEffect, useMemo } from "react";
import { Search, Calendar } from "lucide-react";

const normalize = (c) =>
  typeof c === "string"
    ? { key: c, label: c, type: "text" }
    : { type: "text", label: c.label ?? c.key, ...c };

const getInitialValue = (type) =>
  type === "dateRange" ? { from: "", to: "" } : "";

const Filters = ({ criteria, data, setFilteredData }) => {
  const normalizedCriteria = useMemo(() => criteria.map(normalize), []);

  const [filterCriteria, setFilterCriteria] = useState(() =>
    normalizedCriteria.reduce((acc, { key, type }) => {
      acc[key] = getInitialValue(type);
      return acc;
    }, {}),
  );

  // Recompute filteredData whenever filters OR the underlying data change
  // (important: after a CRUD create/update/delete, filters get reapplied automatically)
  useEffect(() => {
    const filtered = data.filter((item) =>
      normalizedCriteria.every(({ key, type }) => {
        const value = filterCriteria[key];

        if (type === "dateRange") {
          const { from, to } = value;
          if (!from && !to) return true;
          const itemDate = new Date(item[key]);
          if (from && itemDate < new Date(from)) return false;
          if (to && itemDate > new Date(`${to}T23:59:59`)) return false;
          return true;
        }

        if (type === "date") {
          if (!value) return true;

          const itemDate = new Date(item[key]);
          const [filterYear, filterMonth, filterDay] = value
            .split("-")
            .map(Number);

          return (
            itemDate.getFullYear() === filterYear &&
            itemDate.getMonth() + 1 === filterMonth && // getMonth() is 0-indexed
            itemDate.getDate() === filterDay
          );
        }

        // default: text
        if (!value) return true;
        return String(item[key] ?? "")
          .toLowerCase()
          .includes(String(value).toLowerCase());
      }),
    );
    setFilteredData(filtered);
  }, [filterCriteria, data, normalizedCriteria, setFilteredData]);

  const handleTextOrDateChange = (key) => (e) => {
    const { value } = e.target;
    setFilterCriteria((prev) => ({ ...prev, [key]: value }));
  };

  const handleRangeChange = (key, bound) => (e) => {
    const { value } = e.target;
    setFilterCriteria((prev) => ({
      ...prev,
      [key]: { ...prev[key], [bound]: value },
    }));
  };

  return (
    <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-5 mb-6">
      <div className="flex items-center gap-2 mb-4">
        <Search className="w-4 h-4 text-gray-400" />
        <h3 className="text-sm font-semibold text-gray-700">Filters</h3>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {normalizedCriteria.map(({ key, label, type }, idx) => (
          <div key={idx} className="flex flex-col gap-1.5">
            <label
              htmlFor={key}
              className="text-xs font-medium text-gray-500 uppercase tracking-wide"
            >
              {label}
            </label>

            {type === "dateRange" ? (
              <div className="flex items-center gap-2">
                <div className="relative flex-1">
                  <Calendar className="w-4 h-4 text-gray-400 absolute left-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                  <input
                    id={`${key}-from`}
                    type="date"
                    value={filterCriteria[key].from}
                    onChange={handleRangeChange(key, "from")}
                    className="w-full pl-8 pr-2 py-2 text-sm rounded-lg border border-gray-300 bg-gray-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition"
                  />
                </div>
                <span className="text-xs text-gray-400 shrink-0">to</span>
                <div className="relative flex-1">
                  <Calendar className="w-4 h-4 text-gray-400 absolute left-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                  <input
                    id={`${key}-to`}
                    type="date"
                    value={filterCriteria[key].to}
                    onChange={handleRangeChange(key, "to")}
                    className="w-full pl-8 pr-2 py-2 text-sm rounded-lg border border-gray-300 bg-gray-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition"
                  />
                </div>
              </div>
            ) : (
              <div className="relative">
                {type === "date" && (
                  <Calendar className="w-4 h-4 text-gray-400 absolute left-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                )}
                <input
                  id={key}
                  type={type === "date" ? "date" : "text"}
                  value={filterCriteria[key]}
                  onChange={handleTextOrDateChange(key)}
                  placeholder={
                    type === "text"
                      ? `Search ${label.toLowerCase()}...`
                      : undefined
                  }
                  className={`w-full ${
                    type === "date" ? "pl-8" : "pl-3"
                  } pr-3 py-2 text-sm rounded-lg border border-gray-300 bg-gray-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition placeholder:text-gray-400`}
                />
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default Filters;
