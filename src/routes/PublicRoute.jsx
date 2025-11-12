import { Navigate } from "react-router-dom";
import { useUser } from "../context/UserContext";

const PublicRoute = ({ children }) => {
  const { userData } = useUser();

  // Si ya hay usuario logueado, redirigir al portal
  if (userData) {
    return <Navigate to="/" replace />;
  }

  // Si no hay usuario, mostrar el componente (login, etc.)
  return children;
};
export default PublicRoute;
