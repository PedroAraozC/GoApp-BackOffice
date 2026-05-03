import { createContext, useContext, useEffect, useState } from "react";
import io from "socket.io-client";
import axiosTaxi from "../config/axiosTaxi";

const AuthContext = createContext();

let socket = null;

export const AuthProvider = ({ children }) => {
  const [usuario, setUsuario] = useState(null);
  const [token, setToken] = useState(null);
  const [loading, setLoading] = useState(true);

  // 🔹 Cargar sesión al iniciar (como SharedPreferences en Flutter)
  useEffect(() => {
    const storedToken = localStorage.getItem("token");
    const storedUser = localStorage.getItem("usuario");

    if (storedToken && storedUser) {
      setToken(storedToken);
      setUsuario(JSON.parse(storedUser));
      connectSocket(JSON.parse(storedUser));
    }

    setLoading(false);
  }, []);

  const connectSocket = (user) => {
    if (!user) return;

    socket = io(axiosTaxi.defaults.baseURL, {
      transports: ["websocket"],
    });

    socket.emit("usuario_conectado", {
      id_usuario: user.id_usuario,
      tipo: user.tipo || "admin", // ajustalo según tu backoffice
    });
  };

  const login = (data) => {
    localStorage.setItem("token", data.token);
    localStorage.setItem("usuario", JSON.stringify(data.usuario));

    setToken(data.token);
    setUsuario(data.usuario);

    connectSocket(data.usuario);
  };

  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("usuario");

    setToken(null);
    setUsuario(null);

    if (socket) {
      socket.disconnect();
      socket = null;
    }

    window.location.href = "/login";
  };

  return (
    <AuthContext.Provider
      value={{
        usuario,
        token,
        login,
        logout,
        loading,
        socket,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
