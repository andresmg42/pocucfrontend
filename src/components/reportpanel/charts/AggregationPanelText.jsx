import React from "react";
import { useEffect } from "react";

const AggregationPanelText = ({ data }) => {
//   const name_stats = ["average", "minimum", "maximum", "count", "mode"];

  useEffect(() => {
    console.log("data in aggreate:", data);
  }, []);

  return (
    <div className="rounded-lg shadow-md overflow-hidden border border-gray-200 bg-white">
      <div className="px-6 py-4">
      <h1 className="text-2xl font-bold text-gray-800">Estadisticas Descriptivas Nominales</h1>
    </div>
      <table className="w-full">
        
        <thead className="bg-gray-100">
          <tr>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Descripción
            </th>
            
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Numero Respuestas 
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
  
  {data?.length > 0 &&
    data.map((obj) => (
      <tr
        
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
          
          {obj.count_text}
        </td>
        
       
        <td className="px-6 py-4 whitespace-nowrap text-right text-sm text-gray-600">
          
          {obj.mode_text?.description}
        </td>
        <td className="px-6 py-4 whitespace-nowrap text-right text-sm text-gray-600">
          
          {obj.mode_text?.count}
        </td>
        
        
      </tr>
    ))}
</tbody>
      </table>
    </div>
  );
};

export default AggregationPanelText;