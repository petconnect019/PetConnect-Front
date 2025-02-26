import { createContext, useContext, useState, useEffect } from "react";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(() => !!sessionStorage.getItem("accessToken"));

  useEffect(() => {
    // Verificar token en sessionStorage al iniciar
    setIsAuthenticated(!!sessionStorage.getItem("accessToken"));
  }, []);

  const login = (token) => {
    sessionStorage.setItem("accessToken", token);
    setIsAuthenticated(true);
  };

  const logout = () => {
    sessionStorage.removeItem("accessToken");
    setIsAuthenticated(false);
  };

  return (
    <AuthContext.Provider value={{ isAuthenticated, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
