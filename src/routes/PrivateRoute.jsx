import { Navigate } from "react-router-dom";
import { useUser } from "../context/UserContext";
import { useAuth } from "../context/AuthContext";
import { CircularProgress } from "@mui/material";

const PrivateRoute = ({ children }) => {
  const { token, loading } = useAuth();

  // Mostrar loading mientras se verifica
  if (loading) {
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
    );
  }
  return token ? children : <Navigate to="/" replace />;
};
export default PrivateRoute;
