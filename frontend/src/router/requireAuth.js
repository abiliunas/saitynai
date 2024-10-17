import { Navigate, Outlet, useLocation } from "react-router-dom";
import { toast } from "react-toastify";
import { useAuth } from "../context/authContext";

export default function RequireAuth({ roles }) {
  const { user } = useAuth();

  const location = useLocation();

  if (!user) {
    return <Navigate to="/login" state={{ from: location }} />;
  }

  if (roles && !roles.some((r) => user.userRoles?.includes(r))) {
    toast.error("Neturite prieigos prie šio turinio");
    return <Navigate to="/" />;
  }

  return <Outlet />;
}
