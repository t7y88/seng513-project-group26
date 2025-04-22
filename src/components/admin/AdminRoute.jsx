// components/admin/AdminRoute.jsx
import { useUserData } from "../../contexts/userDataContext";
import { Navigate } from "react-router-dom";

/**
 * Renders children only if the user is an admin.
 */
export default function AdminRoute({ children }) {
  const { userData, loading } = useUserData();

  if (loading) {
    return <div className="p-4 text-center">Checking permissions...</div>;
  }

  if (!userData || userData.admin !== true) {
    return <Navigate to="/home" />;
  }

  return children;
}
