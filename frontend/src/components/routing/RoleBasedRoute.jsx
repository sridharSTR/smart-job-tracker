import { Navigate, Outlet, useLocation } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";

export default function RoleBasedRoute({ allowedRoles = [] }) {
  const { user } = useAuth();
  const location = useLocation();

  if (!allowedRoles.includes(user?.role)) {
    return <Navigate to="/unauthorized" replace state={{ from: location.pathname }} />;
  }

  return <Outlet />;
}
