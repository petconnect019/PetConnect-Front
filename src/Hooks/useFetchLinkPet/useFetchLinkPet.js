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
    if (!_id || !petId) {
      console.log('=== linkPet NO EJECUTADO ===');
      console.log('_id:', _id);
      console.log('petId:', petId);
      return;
    }
    
    console.log('=== DEBUG FRONTEND linkPet ===');
    console.log('QR ID (_id):', _id);
    console.log('Pet ID (petId):', petId);
    console.log('Iniciando vinculación...');
    
    setLinkState(prev => ({ ...prev, isLoading: true, error: null }));
    
    try {
      let token = localStorage.getItem('accessToken');
      console.log('Token obtenido:', token ? 'SÍ' : 'NO');
      
      if (isTokenExpired(token)) {
        console.log('Token expirado, refrescando...');
        try {
          await FetchRefreshToken();
          token = localStorage.getItem('accessToken');
          console.log('Token refrescado:', token ? 'SÍ' : 'NO');
        } catch (refreshError) {
          throw new Error("Error al refrescar el token: " + refreshError.message);
        }
      }

      const objectQrPet = { _id, petId };
      console.log('Objeto a enviar:', objectQrPet);
      const result = await FetchLinkPetQr(objectQrPet, token);
      
      console.log('Resultado de FetchLinkPetQr:', result);
      
      if (!result.ok) {
        console.log('Error en la respuesta:', result.message);
        throw new Error(result.message || "Error en la respuesta del servidor");
      }
      
      console.log('Vinculación exitosa, actualizando estado...');
      setLinkState({
        isLoading: false,
        error: null,
        data: result.data,
        hasPet: (result.data.qr.pet?'linked':'first'),
        pet: result.data.qr.pet || null,
      });
      
      return result.data;
    } catch (error) {
      console.log('Error capturado en linkPet:', error.message);
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