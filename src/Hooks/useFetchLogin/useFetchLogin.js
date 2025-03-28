import { useState } from "react";
import { fetchLogin } from "../../Utils/Fetch/FetchLogin/FetchLogin";

export const useFetchLogin = () => {
  const [loginState, setLoginState] = useState({
    isLoading: false,
    error: null,
    isSuccess: false,
    userResult: null,
    accessTokenResult: null,
    hasPets: false,
    isNewUser: false,
  });

  const handleLogin = async (userData) => {
    setLoginState((prev) => ({ ...prev, isLoading: true }));

    try {

        const response = await fetchLogin(userData);

        if (response.ok) {

            setLoginState({
              isLoading: false,
              isSuccess: true,
              error: null,
              userResult: response.user,
              accessTokenResult: response.accessToken,
              hasPets: response.hasPets,
              isNewUser: response.isNewUser,
            });
      
            return { success: true, userResult: response.user };
          } else {
            setLoginState((prev) => ({
              ...prev,
              isLoading: false,
              error: response.message || "Error en la autenticación",
            }));
      
            return { success: false, error: response.message };
          }

    } catch (error) {
        setLoginState(prev => ({ 
            ...prev, 
            isLoading: false, 
            error: error.message || "Error desconocido" 
          }));
          return null;
    }
  };

  return {
    ...loginState,
    handleLogin,
  };
};
