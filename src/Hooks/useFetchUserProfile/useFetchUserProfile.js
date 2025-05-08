import { useState, useRef } from "react";
import { FetchRefreshToken } from "../../Utils/Fetch/FetchRefreshToken/FetchRefreshToken";
import { isTokenExpired } from "../../Utils/Helpers/IsTokenExpired/IsTokenExpired";

export const useFetchUserProfile = () => {
  const [userState, setUserState] = useState({
    isLoading: false,
    error: null,
    isSuccess: false,
    userData: null
  });

  const isFetching = useRef(false);

  const fetchUserProfile = async () => {
    if (isFetching.current) {
      return { success: true, userData: userState.userData };
    }

    isFetching.current = true;
    setUserState(prev => ({ ...prev, isLoading: true }));

    try {
      // Primero intentamos obtener los datos del sessionStorage
      const storedUserData = sessionStorage.getItem("userData");
      if (storedUserData) {
        try {
          const parsedData = JSON.parse(storedUserData);
          console.log("Datos del usuario obtenidos del sessionStorage:", parsedData);
          if (parsedData && typeof parsedData === 'object') {
            setUserState({
              isLoading: false,
              isSuccess: true,
              error: null,
              userData: parsedData
            });
            isFetching.current = false;
            return { success: true, userData: parsedData };
          }
        } catch (parseError) {
          console.error("Error al parsear datos del usuario:", parseError);
        }
      }

      // Si no hay datos en sessionStorage o hubo error al parsear, hacemos la llamada a la API
      let token = sessionStorage.getItem("accessToken");
      
      if (!token) {
        throw new Error("No hay token de acceso disponible");
      }

      if (isTokenExpired(token)) {
        try {
          await FetchRefreshToken();
          token = sessionStorage.getItem("accessToken");
        } catch (refreshError) {
          throw new Error("Error de autenticación");
        }
      }

      const response = await fetch(`${import.meta.env.VITE_API_URL}/api/users/profile`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      const data = await response.json();
      console.log("Respuesta de la API:", data);

      if (!response.ok) {
        throw new Error(data.message || 'Error al obtener el perfil del usuario');
      }

      // Verificamos si los datos del usuario están en la respuesta
      const userData = data.user || data;
      if (!userData) {
        throw new Error('Datos de usuario no disponibles');
      }

      // Guardamos los datos en sessionStorage
      sessionStorage.setItem("userData", JSON.stringify(userData));

      setUserState({
        isLoading: false,
        isSuccess: true,
        error: null,
        userData: userData
      });
      isFetching.current = false;
      return { success: true, userData: userData };
    } catch (error) {
      console.error("Error en fetchUserProfile:", error);
      setUserState({
        isLoading: false,
        isSuccess: false,
        error: error.message,
        userData: null
      });
      isFetching.current = false;
      return { success: false, error: error.message };
    }
  };

  return {
    ...userState,
    fetchUserProfile
  };
}; 