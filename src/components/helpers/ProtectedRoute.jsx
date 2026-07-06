import { Navigate, Outlet, useLocation } from "react-router";
import useAuthStore from "../../stores/use-auth-store";
import { useEffect, useState } from "react";
import DeniedAccessPlaceholder from "../placeholders/DeniedAccessPlaceholder";

function ProtectedRoute() {
  const { userLogged, isLoading, role } = useAuthStore();
  const location = useLocation();

  // useEffect(() => {
  //   console.log("userLogged:", userLogged);
  // }, [userLogged]);

  if (isLoading) return <div>Loading...</div>;

  return role?.is_admin ? <Outlet /> : <DeniedAccessPlaceholder />;
}

export default ProtectedRoute;
