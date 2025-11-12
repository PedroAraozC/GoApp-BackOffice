import { Navigate } from "react-router-dom";
import { useUser } from "../context/UserContext";
import { CircularProgress } from "@mui/material";

const PrivateRoute = ({ children }) => {
  const { userData, isLoading } = useUser();

  // Mostrar loading mientras se verifica
  if (isLoading) {
    return (
      <div
        style={{
          position: "fixed",
          top: 0,
          left: 0,
          width: "100vw",
          height: "100vh",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          zIndex: 9999,
          pointerEvents: "auto", // permite que no bloquee clics si no querés bloquear
        }}
      >
        <CircularProgress color="primary" />
      </div>
    ); // O tu componente de loading
  }

  // Si no hay usuario logueado, redirigir al login
  if (!userData) {
    return <Navigate to="/" replace />;
  }

  // Si hay usuario, mostrar el componente
  return children;
};

export default PrivateRoute;

// PublicRoute.js - Para rutas que solo deben ser accesibles sin autenticación (como login)
