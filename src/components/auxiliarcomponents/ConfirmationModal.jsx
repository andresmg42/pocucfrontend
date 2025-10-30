import { useEffect } from "react";

const ConfirmationModal = ({ isOpen, onClose, onConfirm, title, message }) => {
  useEffect(() => {
    const handleEsc = (event) => {
      if (event.key === 'Escape') {
        onClose();
      }
    };
    window.addEventListener('keydown', handleEsc);
    return () => {
      window.removeEventListener('keydown', handleEsc);
    };
  }, [onClose]);

  if (!isOpen) return null;

  return (
    <div 
      className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-60 backdrop-blur-sm"
      onClick={onClose}
    >
      <div
        className="relative bg-white w-full max-w-md m-4 rounded-2xl shadow-2xl p-8 transform transition-all duration-300 ease-in-out animate-fade-in-scale"
        onClick={(e) => e.stopPropagation()} // Prevent closing modal when clicking inside
      >
        <div className="flex flex-col items-center text-center">
          {/* Icon */}
          <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mb-4 border-4 border-red-200">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-red-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
            </svg>
          </div>

          <h2 className="text-2xl font-bold text-gray-800 mb-2">{title}</h2>
          <p className="text-gray-600 mb-8">{message}</p>
          
          <div className="flex justify-center gap-4 w-full">
            <button
              onClick={onClose}
              className="w-full bg-gray-100 text-gray-700 font-semibold py-3 px-6 rounded-lg border border-gray-300 hover:bg-gray-200 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-gray-400"
            >
              No, Cancel
            </button>
            <button
              onClick={onConfirm}
              className="w-full bg-red-600 text-white font-semibold py-3 px-6 rounded-lg shadow-md hover:bg-red-700 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-red-400"
            >
              Yes, Delete
            </button>
          </div>
        </div>
      </div>
      <style jsx global>{`
        @keyframes fadeInScale {
          from {
            opacity: 0;
            transform: scale(0.95);
          }
          to {
            opacity: 1;
            transform: scale(1);
          }
        }
        .animate-fade-in-scale {
          animation: fadeInScale 0.3s ease-out forwards;
        }
      `}</style>
    </div>
  );
};

export default ConfirmationModal