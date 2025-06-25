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
      const token = sessionStorage.getItem("accessToken");
      
      const response = await fetch(`${import.meta.env.VITE_API_URL}/api/pets/${petId}/photos`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        credentials: 'include'
      });

      const data = await response.json();

      if (response.ok) {
        setPhotosState((prev) => ({
          ...prev,
          isSuccess: true,
          isLoading: false,
          photos: data.photos || [],
          error: null
        }));
        return { success: true, photos: data.photos };
      } else {
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
      const token = sessionStorage.getItem("accessToken");
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

      const data = await response.json();

      if (response.ok) {
        // Recargar todas las fotos después de subir exitosamente
        const photosResponse = await getPetPhotos(petId);
        
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
      const token = sessionStorage.getItem("accessToken");
      
      const response = await fetch(`${import.meta.env.VITE_API_URL}/api/pets/${petId}/photos/${photoId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        credentials: 'include'
      });

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