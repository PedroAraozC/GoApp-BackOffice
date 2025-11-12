import { createContext, useContext, useEffect, useState } from "react";
// import jwtDecode from "jwt-decode";

const UserContext = createContext(null);

export const UserProvider = ({ children }) => {
  const [userData, setUserData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  // Cargar datos del usuario desde localStorage al inicializar
  useEffect(() => {
    const storedUser = localStorage.getItem("userData");
    if (storedUser) {
      try {
        setUserData(JSON.parse(storedUser));
      } catch (error) {
        console.error("Error parsing stored user data:", error);
        localStorage.removeItem("userData"); // Limpiar datos corruptos
      }
    }
    setIsLoading(false); // Terminar loading
  }, []);

  // Función personalizada para actualizar userData y guardarlo en localStorage
  const updateUserData = (newUserData) => {
    setUserData(newUserData);

    if (newUserData) {
      // Guardar en localStorage
      localStorage.setItem("userData", JSON.stringify(newUserData));
    } else {
      // Si es null/undefined, remover del localStorage (logout)
      localStorage.removeItem("userData");
    }
  };

  // Función para hacer logout
  const logout = () => {
    setUserData(null);
    localStorage.removeItem("userData");
  };

  return (
    <UserContext.Provider
      value={{
        userData,
        setUserData: updateUserData, // Usar la función personalizada
        logout,
        isLoading,
      }}
    >
      {children}
    </UserContext.Provider>
  );
};

export const useUser = () => useContext(UserContext);
