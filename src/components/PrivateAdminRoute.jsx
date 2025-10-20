import { Navigate } from "react-router";
import { authStore } from "../stores/authStore";

const PrivateAdminRoute = ({ children }) => {
  const { isAuthenticated, getUserRole } = authStore();

  if (!isAuthenticated()) {
    return <Navigate to="/login" replace />;
  }

  if (getUserRole() !== "ROLE_ADMIN") {
    return <div className="text-center m-5">접근 권한이 없습니다.</div>;
  }

  return children;
};

export default PrivateAdminRoute;
