import { Navigate, Outlet, useLocation } from "react-router";
import useAuthStore from "../../stores/use-auth-store";
import { useEffect, useState } from "react";
import DeniedAccessPlaceholder from "../placeholders/DeniedAccessPlaceholder";

function ProtectedRoute() {
  const { userLogged, isLoading, role } = useAuthStore();
  const location = useLocation();

  if (isLoading) return <div>Loading...</div>;

  return role?.is_admin || role?.is_staff ? (
    <Outlet />
  ) : (
    <DeniedAccessPlaceholder />
  );
}

export default ProtectedRoute;
