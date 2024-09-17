import { Navigate } from "react-router-dom";

import { useGlobalStore } from "../../store";
import { useAuthStore } from "./store";

const Logout = () => {
  const {
    actions: { logout },
  } = useAuthStore();
  const {
    actions: { clearUser },
  } = useGlobalStore();

  clearUser();
  logout();

  return <Navigate to="/auth/login" replace />;
};

export default Logout;
