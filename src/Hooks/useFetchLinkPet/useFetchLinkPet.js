import { useState } from 'react';
import { FetchLinkPetQr } from "../../Utils/Fetch/FetchLinkPetQr/FetchLinkPet";
import { isTokenExpired } from "../../Utils/Helpers/IsTokenExpired/IsTokenExpired";
import { FetchRefreshToken } from "../../Utils/Fetch/FetchRefreshToken/FetchRefreshToken";

export const useFetchLinkPet = (_id, petId) => {
  const [linkState, setLinkState] = useState({
    isLoading: false,
    error: null,
    data: null,
    hasPet: false,
    pet: null
  });

  const linkPet = async () => {
    if (!_id || !petId) return;
    
    setLinkState(prev => ({ ...prev, isLoading: true, error: null }));
    
    try {
      let token = sessionStorage.getItem('accessToken');
      
      if (isTokenExpired(token)) {
        try {
          await FetchRefreshToken();
          token = sessionStorage.getItem('accessToken');
        } catch (refreshError) {
          throw new Error("Error al refrescar el token: " + refreshError.message);
        }
      }

      const objectQrPet = { _id, petId };
      const result = await FetchLinkPetQr(objectQrPet, token);
      
      if (!result.ok) {
        throw new Error(result.message || "Error en la respuesta del servidor");
      }
      
      setLinkState({
        isLoading: false,
        error: null,
        data: result.data,
        hasPet: (result.data.qr.pet?'linked':'first'),
        pet: result.data.qr.pet || null,
      });
      
      return result.data;
    } catch (error) {
      setLinkState(prev => ({ 
        ...prev, 
        isLoading: false, 
        error: error.message || "Error desconocido" 
      }));
      return null;
    }
  };

  return {
    ...linkState,
    linkPet
  };
};