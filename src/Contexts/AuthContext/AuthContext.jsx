import { createContext, useContext, useState, useEffect } from "react";
import { FetchLogout } from "../../Utils/Fetch/FetchLogout/FetchLogout";

const AuthContext = createContext({ isAuthenticated: false, login: () => {} });

export const AuthProvider = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(() => {
    const token = sessionStorage.getItem("accessToken");
    const userData = sessionStorage.getItem("userData");
    return !!(token && userData);
  });

  useEffect(() => {
    // Verificar token y datos de usuario en sessionStorage al iniciar
    const token = sessionStorage.getItem("accessToken");
    const userData = sessionStorage.getItem("userData");
    setIsAuthenticated(!!(token && userData));
  }, []);

  const login = (token, userData) => {
    if (!token || !userData) {
      console.error("Token o datos de usuario no proporcionados");
      return;
    }
    
    try {
      sessionStorage.setItem("accessToken", token);
      sessionStorage.setItem("userData", JSON.stringify(userData));
      setIsAuthenticated(true);
    } catch (error) {
      console.error("Error al guardar datos de autenticación:", error);
      setIsAuthenticated(false);
    }
  };

  const logout = () => {
    try {
      FetchLogout();
      sessionStorage.removeItem("accessToken");
      sessionStorage.removeItem("userData");
      sessionStorage.removeItem("hasPets");
      setIsAuthenticated(false);
    } catch (error) {
      console.error("Error al cerrar sesión:", error);
    }
  };

  return (
    <AuthContext.Provider value={{ isAuthenticated, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);