import { useState } from "react";
import { fetchRegister } from "../../Utils/Fetch/FetchRegister/FetchRegister";

export const useFetchRegister = () => {
  const [registerState, setRegisterState] = useState({
    isLoading: false,
    error: null,
    isSuccess: false,
    accessTokenResult: null,
  });

  const handleRegister = async (userData) => {
    // Reset state to initial loading state
    setRegisterState((prev) => ({ 
      ...prev, 
      isLoading: true,
    }));

    try {
      const response = await fetchRegister(userData);

      if (response.ok) {

        setRegisterState({
          isLoading: false,
          isSuccess: true,
          error: null,
          accessTokenResult: response.accessToken,
        });
        
        return { 
          success: true, 
          userResult: response.user 
        };
      } else {
        // Handle unsuccessful registration
        setRegisterState((prev) => ({
          ...prev,
          isLoading: false,
          error: response.message || "Error en el registro",
        }));

        return { 
          success: false, 
          error: response.message 
        };
      }
    } catch (error) {
      // Handle network or unexpected errors
      setRegisterState(prev => ({ 
        ...prev, 
        isLoading: false, 
        error: error.message || "Error desconocido" 
      }));

      return { 
        success: false, 
        error: error.message 
      };
    }
  };

  return {
    ...registerState,
    handleRegister,
  };
};