import React from "react";

function Home() {
  console.log("Home print");
  return (
    <div className="flex items-center justify-center min-h-screen">
      <div className="w-[400px] h-[400px] mx-auto bg-white  p-8 rounded-lg shadow-md">
        4
        <h2 className="text-lg font-semibold text-black text-center mb-4">
          Sign In
        </h2>
        <button
          type="button"
          title="Iniciar sesión con Google"
          className="flex mx-auto items-center justify-center px-6 py-2 bg-red-600 text-white font-medium rounded-md hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 transition-all duration-200"
        >
          <img src="logo/google.svg" alt="Google" className="w-5 h-5 mr-2" />
          Iniciar secion con Google
        </button>
      </div>
    </div>
  );
}

export default Home;
