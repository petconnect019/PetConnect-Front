import { useState, useCallback } from "react";

export const useFetchPetPhotos = () => {
  const [photosState, setPhotosState] = useState({
    isLoading: false,
    error: null,
    isSuccess: false,
    photos: [],
    uploadProgress: 0
  });

  // Función para obtener las fotos de una mascota
  const getPetPhotos = useCallback(async (petId) => {
    setPhotosState((prev) => ({ ...prev, isLoading: true, error: null }));

    try {
      const token = localStorage.getItem("accessToken");
      
      const response = await fetch(`${import.meta.env.VITE_API_URL}/api/pets/${petId}/photos`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        credentials: 'include'
      });

      // Verificar si la respuesta es JSON antes de parsear
      const contentType = response.headers.get('content-type');
      
      if (!contentType || !contentType.includes('application/json')) {
        // Si no es JSON, probablemente es HTML de error
        console.error('Respuesta no es JSON:', response.status, response.statusText);
        
        // Tratar como sin fotos si es un error relacionado con fotos faltantes
        if (response.status === 404) {
          setPhotosState((prev) => ({
            ...prev,
            isSuccess: true,
            isLoading: false,
            photos: [],
            error: null
          }));
          return { success: true, photos: [] };
        }
        
        throw new Error(`Error del servidor: ${response.status} ${response.statusText}`);
      }

      const data = await response.json();

      if (response.ok) {
        // Asegurar que photos sea siempre un array
        const photos = Array.isArray(data.photos) ? data.photos : [];
        
        setPhotosState((prev) => ({
          ...prev,
          isSuccess: true,
          isLoading: false,
          photos: photos,
          error: null
        }));
        return { success: true, photos: photos };
      } else {
        // Si es un error 404, tratarlo como sin fotos
        if (response.status === 404) {
          setPhotosState((prev) => ({
            ...prev,
            isSuccess: true,
            isLoading: false,
            photos: [],
            error: null
          }));
          return { success: true, photos: [] };
        }
        
        setPhotosState((prev) => ({
          ...prev,
          error: data.message || "Error al obtener las fotos",
          isLoading: false,
          isSuccess: false
        }));
        return { success: false, error: data.message };
      }
    } catch (error) {
      console.error("Error fetching pet photos:", error);
      
      // Si el error contiene referencias a JSON o 404, tratar como sin fotos
      if (error.message.includes('JSON') || 
          error.message.includes('404') || 
          error.message.includes('no tiene fotos')) {
        setPhotosState((prev) => ({
          ...prev,
          isSuccess: true,
          isLoading: false,
          photos: [],
          error: null
        }));
        return { success: true, photos: [] };
      }
      
      setPhotosState((prev) => ({
        ...prev,
        error: error.message || "Error al obtener las fotos",
        isLoading: false,
        isSuccess: false
      }));
      return { success: false, error: error.message };
    }
  }, []);

  // Función para subir fotos de una mascota
  const uploadPetPhotos = useCallback(async (petId, files) => {
    setPhotosState((prev) => ({ 
      ...prev, 
      isLoading: true, 
      error: null, 
      uploadProgress: 0 
    }));

    try {
      const token = localStorage.getItem("accessToken");
      const formData = new FormData();
      
      // Agregar cada archivo al FormData
      Array.from(files).forEach((file) => {
        formData.append('photos', file);
      });

      const response = await fetch(`${import.meta.env.VITE_API_URL}/api/pets/${petId}/photos`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`
        },
        credentials: 'include',
        body: formData
      });

      // Verificar si la respuesta es JSON
      const contentType = response.headers.get('content-type');
      if (!contentType || !contentType.includes('application/json')) {
        throw new Error(`Error del servidor: ${response.status} ${response.statusText}`);
      }

      const data = await response.json();

      if (response.ok) {
        // Recargar todas las fotos después de subir exitosamente
        await getPetPhotos(petId);
        
        setPhotosState((prev) => ({
          ...prev,
          isSuccess: true,
          isLoading: false,
          uploadProgress: 100,
          error: null
        }));
        return { success: true, photos: data.photos };
      } else {
        setPhotosState((prev) => ({
          ...prev,
          error: data.message || "Error al subir las fotos",
          isLoading: false,
          uploadProgress: 0,
          isSuccess: false
        }));
        return { success: false, error: data.message };
      }
    } catch (error) {
      console.error("Error uploading pet photos:", error);
      setPhotosState((prev) => ({
        ...prev,
        error: error.message || "Error al subir las fotos",
        isLoading: false,
        uploadProgress: 0,
        isSuccess: false
      }));
      return { success: false, error: error.message };
    }
  }, [getPetPhotos]);

  // Función para eliminar una foto específica
  const deletePetPhoto = useCallback(async (petId, photoId) => {
    setPhotosState((prev) => ({ ...prev, isLoading: true, error: null }));

    try {
      const token = localStorage.getItem("accessToken");
      
      const response = await fetch(`${import.meta.env.VITE_API_URL}/api/pets/${petId}/photos/${photoId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        credentials: 'include'
      });

      // Verificar si la respuesta es JSON
      const contentType = response.headers.get('content-type');
      if (!contentType || !contentType.includes('application/json')) {
        throw new Error(`Error del servidor: ${response.status} ${response.statusText}`);
      }

      const data = await response.json();

      if (response.ok) {
        // Recargar todas las fotos después de eliminar exitosamente
        await getPetPhotos(petId);
        
        setPhotosState((prev) => ({
          ...prev,
          isSuccess: true,
          isLoading: false,
          error: null
        }));
        return { success: true };
      } else {
        setPhotosState((prev) => ({
          ...prev,
          error: data.message || "Error al eliminar la foto",
          isLoading: false,
          isSuccess: false
        }));
        return { success: false, error: data.message };
      }
    } catch (error) {
      console.error("Error deleting pet photo:", error);
      setPhotosState((prev) => ({
        ...prev,
        error: error.message || "Error al eliminar la foto",
        isLoading: false,
        isSuccess: false
      }));
      return { success: false, error: error.message };
    }
  }, [getPetPhotos]);

  // Función para limpiar el estado
  const clearPhotosState = useCallback(() => {
    setPhotosState({
      isLoading: false,
      error: null,
      isSuccess: false,
      photos: [],
      uploadProgress: 0
    });
  }, []);

  return {
    ...photosState,
    getPetPhotos,
    uploadPetPhotos,
    deletePetPhoto,
    clearPhotosState
  };
}; 