import { useState, useRef, useEffect } from "react";
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
      id: data._id,
      name: data.name || "",
      email: data.email || "",
      phone: data.phone || "",
      gender: data.gender || "",
      country: data.country || "Colombia",
      state: data.state || "",
      city: data.city || "",
      address: data.address || "",
      profile_picture: data.profile_picture || "",
      role: data.role,
      is_active: data.is_active,
      is_profile_public: data.is_profile_public,
      show_contact: data.show_contact,
      createdAt: data.createdAt,
      updatedAt: data.updatedAt,
      __v: data.__v
    };
  };
  

  // Función para emitir el evento personalizado cuando los datos cambian
  const notifyUserDataChange = () => {
    console.log("Notificando cambio en datos de usuario...");
    const event = new CustomEvent('userDataUpdated');
    window.dispatchEvent(event);
  };

  // Función para guardar datos en localStorage y sessionStorage
  const saveUserData = (userData) => {
    try {
      const normalizedData = normalizeUserData(userData);
      
      console.log(normalizedData);
      
      // Asegurarnos de que la imagen de perfil esté incluida en los datos normalizados
      if (userData.profile_picture && !normalizedData.profile_picture) {
        normalizedData.profile_picture = userData.profile_picture;
      }
      
      console.log("Guardando datos normalizados:", normalizedData);
      
      // Guardar en ambos almacenamientos
      localStorage.setItem("userData", JSON.stringify(normalizedData));
      sessionStorage.setItem("userData", JSON.stringify(normalizedData));
      
      // Notificar que los datos han cambiado
      notifyUserDataChange();
      
      console.log(normalizedData);
      
      return normalizedData;
    } catch (error) {
      console.error("Error al guardar datos del usuario:", error);
      return null;
    }
  };

  // Función para obtener datos del almacenamiento
  const getStoredUserData = () => {
    try {
      // Primero intentamos obtener de sessionStorage
      let storedData = sessionStorage.getItem("userData");
      
      // Si no hay datos en sessionStorage, intentamos con localStorage
      if (!storedData) {
        storedData = localStorage.getItem("userData");
        
        // Si encontramos datos en localStorage, los restauramos en sessionStorage
        if (storedData) {
          sessionStorage.setItem("userData", storedData);
        }
      }
      
      if (storedData) {
        const parsedData = JSON.parse(storedData);
        if (parsedData && typeof parsedData === 'object') {
          const normalizedData = normalizeUserData(parsedData);
          
          // Asegurarnos de mantener la imagen de perfil si ya existe en los datos almacenados
          if (parsedData.profile_picture && !normalizedData.profile_picture) {
            normalizedData.profile_picture = parsedData.profile_picture;
          }
          
          return normalizedData;
        }
      }
      return null;
    } catch (error) {
      console.error("Error al obtener datos almacenados:", error);
      return null;
    }
  };

  // Efecto para sincronizar los datos al iniciar
  useEffect(() => {
    const storedData = getStoredUserData();
    if (storedData) {
      setUserState({
        isLoading: false,
        isSuccess: true,
        error: null,
        userData: storedData
      });
    }
    
    // Escuchar cambios de almacenamiento entre pestañas
    const handleStorageChange = (event) => {
      if (event.key === 'userData') {
        console.log("Cambio detectado en localStorage userData");
        const storedData = getStoredUserData();
        if (storedData) {
          setUserState(prev => ({
            ...prev,
            userData: storedData,
            isSuccess: true
          }));
        }
      }
    };
    
    window.addEventListener('storage', handleStorageChange);
    
    // Escuchar evento personalizado para cambios en los datos del usuario
    const handleUserDataUpdated = () => {
      console.log("Evento userDataUpdated recibido en useFetchUserProfile");
      const storedData = getStoredUserData();
      if (storedData) {
        setUserState(prev => ({
          ...prev,
          userData: storedData,
          isSuccess: true
        }));
      }
    };
    
    window.addEventListener('userDataUpdated', handleUserDataUpdated);
    
    return () => {
      window.removeEventListener('storage', handleStorageChange);
      window.removeEventListener('userDataUpdated', handleUserDataUpdated);
    };
  }, []);

  const fetchUserProfile = async (forceRefresh = false) => {
    if (isFetching.current && !forceRefresh) {
      return { success: true, userData: userState.userData };
    }

    isFetching.current = true;
    setUserState(prev => ({ ...prev, isLoading: true }));

    try {
      // Si no es una actualización forzada, primero intentamos obtener los datos almacenados
      if (!forceRefresh) {
        const storedData = getStoredUserData();
        if (storedData) {
          setUserState({
            isLoading: false,
            isSuccess: true,
            error: null,
            userData: storedData
          });
          isFetching.current = false;
          return { success: true, userData: storedData };
        }
      }

      // Si no hay datos almacenados o es una actualización forzada, hacemos la llamada a la API
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
        },
        // Prevenir el cacheo de la respuesta
        cache: 'no-store'
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

      // Guardamos los datos normalizados
      const normalizedData = saveUserData(userData);

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

  // Función para actualizar datos específicos del usuario en el almacenamiento
  const updateStoredUserData = (updatedData) => {
    try {
      const currentData = getStoredUserData();
      if (currentData) {
        const newData = { ...currentData, ...updatedData };
        
        // Asegurarnos de que la imagen de perfil se mantenga si no está en los datos actualizados
        if (currentData.profile_picture && !newData.profile_picture) {
          newData.profile_picture = currentData.profile_picture;
        }
        
        console.log("Actualizando datos del usuario:", newData);
        
        // Guardar los datos actualizados
        const savedData = saveUserData(newData);
        
        // Actualizar el estado local
        setUserState(prev => ({
          ...prev,
          userData: savedData,
          isSuccess: true
        }));
        
        return { success: true, userData: savedData };
      }
      return { success: false, error: "No hay datos de usuario para actualizar" };
    } catch (error) {
      console.error("Error al actualizar datos almacenados:", error);
      return { success: false, error: error.message };
    }
  };

  return {
    ...userState,
    fetchUserProfile,
    updateStoredUserData,
    saveUserData
  };
};