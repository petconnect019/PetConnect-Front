import { createContext, useContext, useState, useEffect } from "react";
import { FetchLogout } from "../../Utils/Fetch/FetchLogout/FetchLogout";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(() => !!sessionStorage.getItem("accessToken"));
  const [fetchLogout, setFetchLogout] = useState(false);

  useEffect(() => {
    // Verificar token en sessionStorage al iniciar
    setIsAuthenticated(!!sessionStorage.getItem("accessToken"));
  }, []);

  useEffect(()=> {
    // Realizar logout si se activa fetchLogout
    if (fetchLogout) {
      FetchLogout().then((response)=> {
        if (!response.ok) {
          console.log(response.message);
          
        }
        setFetchLogout(false);
      })
    }
  }, [fetchLogout])

  const login = (token) => {
    sessionStorage.setItem("accessToken", token);
    setIsAuthenticated(true);
  };

  const logout = () => {
    setFetchLogout(true);
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
