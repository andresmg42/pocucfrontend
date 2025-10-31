import React from "react";
import { useEffect } from "react";

const AggregationPanel = ({ data }) => {
  const name_stats = ["average", "minimum", "maximum", "count", "mode"];

  useEffect(() => {
    console.log("data in aggreate:", data);
  }, []);

  return (
    <div className="rounded-lg shadow-md overflow-hidden border border-gray-200 bg-white">
      <div className="px-6 py-4">
      <h1 className="text-2xl font-bold text-gray-800">Estadisticas Descriptivas</h1>
    </div>
      <table className="w-full">
        {/* HEADER: Light gray background, smaller uppercase text */}
        <thead className="bg-gray-100">
          <tr>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Descripción
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Media
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Minimo
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Maximo
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Numero Respuestas Numericas
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Numero Respuestas Textuales
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Moda
            </th>
             <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Frecuencia Moda
            </th>

          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
  {/*
    FIX 1: Use a safer check (data?.length > 0)
    FIX 2: Removed the extra "({ ... })" wrapper
  */}
  {data?.length > 0 &&
    data.map((obj) => (
      <tr
        // FIX 3: Key should match the unique data, likely 'description' or an 'id'
        key={obj.description} 
        className="hover:bg-gray-50 transition-colors duration-150"
      >
        <th
          scope="row"
          className="px-6 py-4 whitespace-nowrap text-left text-sm font-medium text-gray-900"
        >
          {obj.description}
        </th>
        <td className="px-6 py-4 whitespace-nowrap text-right text-sm text-gray-600">
          {/* You might want to format this, e.g., obj.average.toFixed(2) */}
          {obj.average?.toFixed(2)}
        </td>
        <td className="px-6 py-4 whitespace-nowrap text-right text-sm text-gray-600">
          {obj.minimum}
        </td>
        <td className="px-6 py-4 whitespace-nowrap text-right text-sm text-gray-600">
          {obj.maximum}
        </td>
        <td className="px-6 py-4 whitespace-nowrap text-right text-sm text-gray-600">
          { obj.count}
        </td>
        <td className="px-6 py-4 whitespace-nowrap text-right text-sm text-gray-600">
          {  obj.count_text}
        </td>
        <td className="px-6 py-4 whitespace-nowrap text-right text-sm text-gray-600">
          {/* FIX 4: Use optional chaining for safe access */}
          {obj.mode?.numeric_value? obj.mode?.numeric_value : obj.mode.text_value}
        </td>
        <td className="px-6 py-4 whitespace-nowrap text-right text-sm text-gray-600">
          {/* FIX 4: Use optional chaining for safe access */}
          {obj.mode?.count}
        </td>
      </tr>
    ))}
</tbody>
      </table>
    </div>
  );
};

export default AggregationPanel;
