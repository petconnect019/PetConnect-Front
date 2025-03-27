import { createContext, useContext, useState, useEffect } from "react";
import { FetchLogout } from "../../Utils/Fetch/FetchLogout/FetchLogout";

const AuthContext = createContext({ isAuthenticated: false, login: () => {} });

export const AuthProvider = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(() => !!sessionStorage.getItem("accessToken"));

  useEffect(() => {
    // Verificar token en sessionStorage al iniciar
    setIsAuthenticated(!!sessionStorage.getItem("accessToken"));
  }, []);


  const login = (token, userData) => {
    sessionStorage.setItem("accessToken", token);
    sessionStorage.setItem("userData", JSON.stringify(userData));
    setIsAuthenticated(true);
  };

  const logout = () => {
    FetchLogout();
    sessionStorage.removeItem("accessToken");
    sessionStorage.removeItem("hasPets");
    setIsAuthenticated(false);
  };

  return (
    <AuthContext.Provider value={{ isAuthenticated, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
