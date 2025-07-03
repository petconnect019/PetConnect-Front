import { createContext, useContext, useState, useEffect, useMemo } from "react";
import { FetchLogout } from "../../Utils/Fetch/FetchLogout/FetchLogout";

const AuthContext = createContext({ 
  isAuthenticated: false, 
  user: null,
  login: () => {}, 
  logout: () => {} 
});

export const AuthProvider = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(() => {
    const token = localStorage.getItem("accessToken");
    const userData = localStorage.getItem("userData");
    return !!(token && userData);
  });

  const [user, setUser] = useState(() => {
    const userData = localStorage.getItem("userData");
    return userData ? JSON.parse(userData) : null;
  });

  useEffect(() => {
    // Verificar token y datos de usuario en localStorage al iniciar
    const token = localStorage.getItem("accessToken");
    const userData = localStorage.getItem("userData");
    setIsAuthenticated(!!(token && userData));
    if (userData) {
      setUser(JSON.parse(userData));
    }
  }, []);

  const login = (token, userData) => {
    if (!token || !userData) {
      console.error("Token o datos de usuario no proporcionados");
      return;
    }
    
    try {
      localStorage.setItem("accessToken", token);
      localStorage.setItem("userData", JSON.stringify(userData));
      setIsAuthenticated(true);
      setUser(userData);
    } catch (error) {
      console.error("Error al guardar datos de autenticación:", error);
      setIsAuthenticated(false);
      setUser(null);
    }
  };

  const logout = () => {
    try {
      FetchLogout();
      localStorage.removeItem("accessToken");
      localStorage.removeItem("userData");
      localStorage.removeItem("hasPets");
      setIsAuthenticated(false);
      setUser(null);
    } catch (error) {
      console.error("Error al cerrar sesión:", error);
    }
  };

  // Memoizar el valor del contexto
  const contextValue = useMemo(() => ({
    isAuthenticated,
    user,
    login,
    logout
  }), [isAuthenticated, user]);

  return (
    <AuthContext.Provider value={contextValue}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);