import React, { useEffect, useState } from "react";
import useAuthStore from "../../stores/use-auth-store";
import api from "../../api/user.api";
import { useNavigate } from "react-router";
import SurveyReport from "../../components/reportpanel/SurveyReport";


const ReportMain = () => {
  const { userLogged } = useAuthStore();
  const [usertoken, setUserToken] = useState();
  const [isAdmin, setIsAdmin] = useState(false);
   const [loading, setLoading] = useState(true);
  const navigate=useNavigate();

  useEffect(() => {
    async function getUserToken() {
      if (userLogged) {
        
        try {
          const idToken = await userLogged.getIdToken();
          // console.log('token',idToken)
          setUserToken(idToken);
          

          const response = await api.post("survey/check-admin-status/", null, {
            headers: {
              Authorization: `Bearer ${idToken}`,
            },
          });

          if (response.data) {
            setIsAdmin(response.data.isAdmin);
          }
        } catch (error) {
          console.error("an unexpected error ocurred in", error);
          setLoading(false)
        }finally{
          setLoading(false)
        }

      }
    }

    getUserToken();
  }, [userLogged]);

  if(loading){
    return (
      <div className="flex items-center justify-center w-full h-full p-8">
    <div className="text-xl font-semibold text-gray-700">
      Verifying permissions...
    </div>
  </div>
    );
  }

  
  return (
    <div className="flex-1  pl-5 pr-5">
      {!isAdmin? (
        <div className="flex items-center justify-center w-full h-full p-4  rounded-lg">
          <div className="w-full max-w-lg p-8 text-center bg-white border-2 border-dashed border-gray-300 rounded-xl shadow-sm">
            <div className="inline-flex items-center justify-center w-16 h-16 mb-4 text-red-500 bg-red-100 rounded-full">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                stroke-width="1.5"
                stroke="currentColor"
                className="w-8 h-8"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  d="M9 12.75L11.25 15 15 9.75m-3-7.036A11.959 11.959 0 013.598 6 11.99 11.99 0 003 9.749c0 5.592 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.571-.598-3.751h-.152c-3.196 0-6.1-1.248-8.25-3.286zm0 13.036h.008v.008h-.008v-.008z"
                />
              </svg>
            </div>

            <h2 className="text-2xl font-bold text-gray-800">Acceso Denegado</h2>

            <p className="mt-2 text-gray-600">
              Usted no tiene los permisos necesarios para ver este contenido.
              Por Favor contacte a soporte técnico si cree que hay algún error.

            </p>

            <div className="px-4 py-3 mt-6 text-sm text-yellow-800 bg-yellow-100 border border-yellow-300 rounded-lg">
              <span className="font-semibold">Nota:</span> Solamente los usuarios con un{" "}
              rol de <span className="font-semibold">Administrador</span> Pueden acceder
              a este reporte.
            </div>
          </div>
        </div>
      ):
      <SurveyReport/>
      }
    </div>
  );
};

export default ReportMain;
