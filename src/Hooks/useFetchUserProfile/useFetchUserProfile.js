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

  const normalizeUserData = (data) => {
    // Si los datos vienen de Google, están en _doc
    if (data._doc) {
      return {
        _id: data._doc._id,
        name: data.name || data._doc.name,
        email: data.email || data._doc.email,
        phone: data._doc.phone || "",
        gender: data.gender || data._doc.gender || "",
        country: data._doc.country || "Colombia",
        state: data._doc.state || "",
        city: data._doc.city || "",
        address: data._doc.address || "",
        profile_picture: data.profile_picture || data._doc.profile_picture,
        role: data._doc.role,
        is_active: data._doc.is_active,
        is_profile_public: data._doc.is_profile_public,
        show_contact: data._doc.show_contact,
        google_id: data._doc.google_id,
        createdAt: data._doc.createdAt,
        updatedAt: data._doc.updatedAt,
        __v: data._doc.__v
      };
    }
    // Para usuarios normales, asegurarnos de que todos los campos existan
    return {
      _id: data._id,
      name: data.name || "",
      email: data.email || "",
      phone: data.phone || "",
      gender: data.gender || "",
      country: data.country || "Colombia",
      state: data.state || "",
      city: data.city || "",
      address: data.address || "",
      profile_picture: data.profile_picture,
      role: data.role,
      is_active: data.is_active,
      is_profile_public: data.is_profile_public,
      show_contact: data.show_contact,
      createdAt: data.createdAt,
      updatedAt: data.updatedAt,
      __v: data.__v
    };
  };

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
            const normalizedData = normalizeUserData(parsedData);
            console.log("Datos normalizados:", normalizedData);
            setUserState({
              isLoading: false,
              isSuccess: true,
              error: null,
              userData: normalizedData
            });
            isFetching.current = false;
            return { success: true, userData: normalizedData };
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

      // Normalizamos los datos antes de guardarlos
      const normalizedData = normalizeUserData(userData);
      console.log("Datos normalizados de la API:", normalizedData);

      // Guardamos los datos normalizados en sessionStorage
      sessionStorage.setItem("userData", JSON.stringify(normalizedData));

      setUserState({
        isLoading: false,
        isSuccess: true,
        error: null,
        userData: normalizedData
      });
      isFetching.current = false;
      return { success: true, userData: normalizedData };
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