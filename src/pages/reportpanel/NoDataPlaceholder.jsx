import React from 'react';
import { useNavigate } from 'react-router';

/**
 * This is the main component that renders the empty dashboard placeholder.
 * It's designed to be centered on the page.
 */
const NoDataPlaceholder = () => {

  const navigate=useNavigate();
  const handleAddItem = () => {
    // This is a placeholder function.
    // In a real app, this might open a modal or navigate to a "create" page.
    navigate(-1)
  };

  return (
    // Full-screen container with a light gray background
    <div className="flex items-center  justify-center">
      {/* Card container for the placeholder content */}
      <div className="w-full max-w-md p-8 text-center bg-white rounded-xl shadow-lg sm:p-12">
        {/* Icon */}
        <div className="flex items-center justify-center w-20 h-20 mx-auto mb-6 bg-indigo-100 rounded-full">
          {/* Inlined SVG Icon */}
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="w-10 h-10 text-indigo-600"
          >
            <line x1="12" y1="20" x2="12" y2="10" />
            <line x1="18" y1="20" x2="18" y2="4" />
            <line x1="6" y1="20" x2="6" y2="16" />
          </svg>
        </div>

        {/* Main Heading */}
        <h2 className="text-2xl font-semibold text-gray-800 mb-2">
          No Hay Datos Para Mostrar
        </h2>

        {/* Subheading / Helper Text */}
        <p className="text-gray-500 mb-8">
          Parece que no hay datos disponibles todavía.
          <br />
         Vuelve atrás y sigue explorando otras opciones
        </p>

        {/* Call-to-action Button */}
        <button
          onClick={handleAddItem}
          className="px-5 py-3 font-medium text-white bg-indigo-600 rounded-lg shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 transition-all duration-200 ease-in-out"
        >
          Ir Atras
        </button>
      </div>
    </div>
  );
};

export default NoDataPlaceholder;

