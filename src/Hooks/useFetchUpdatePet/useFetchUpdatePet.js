import { useState } from "react";
import { isTokenExpired } from "../../Utils/Helpers/IsTokenExpired/IsTokenExpired";
import { FetchRefreshToken } from "../../Utils/Fetch/FetchRefreshToken/FetchRefreshToken";
import { usePet } from "../../Contexts/PetContext/PetContext";
import { FetchUpdatePet } from "../../Utils/Fetch/FetchUpdatePet/FetchUpdatePet";
import { FetchUpdatePhotoPet } from "../../Utils/FetchUpdatePhotoPet/FetchUpdatePhotoPet";
import { useIsFetchedPets } from "../../Contexts/IsFetchedPets/IsFetchedPets";


export const useFetchUpdatePet = () => {
  const fetched = useIsFetchedPets();
  const {changeIsFetched} = fetched ?? {};

  const [fetchUpdatePetState, setUpdatePetState] = useState({
    isLoading: false,
    error: null,
    isSuccess: false,
    petFetched: null,
    petPicture: null
  });

  const { updatePet } = usePet() || {}; 

  const fetchUpdatePet = async (petData, file) => {
    setUpdatePetState((prev) => ({ ...prev, isLoading: true }));

    try {
      let token = sessionStorage.getItem("accessToken");

      if (isTokenExpired(token)) {
        try {
          await FetchRefreshToken();
          token = sessionStorage.getItem("accessToken");
        } catch (refreshError) {
          console.log(refreshError);
          setUpdatePetState((prev) => ({ ...prev, error: refreshError, isLoading: false }));
          return { success: false, error: "Authentication error" }; 
        }
      }

      const response = await FetchUpdatePet(petData, token);
      if (!response.ok || !response.pet) {
        throw new Error(response.message || "Error al actualizar la mascota");
      }

      let updatedPet = response.pet;

      if (file) {
        const responsePhotoPet = await FetchUpdatePhotoPet(petData, file, token);
        if (!responsePhotoPet.ok) {
          throw new Error(responsePhotoPet.message || "Error al actualizar la foto de la mascota");
        }
        // actualizamos el estado de la foto de la mascota
        setUpdatePetState((prev)=> ({
          ...prev,
          petPicture: responsePhotoPet.profile_picture
        }))
        
      }

       // Actualizar el estado global
       setUpdatePetState((prev) => ({
        ...prev,
        isSuccess: true,
        isLoading: false,
        petFetched: updatedPet,
      }));

      changeIsFetched(false);

      return { success: true };
      
    } catch (error) {
      console.error("Error actualizando mascota:", error);
      setUpdatePetState((prev) => ({
        ...prev,
        error: error.message || "Ocurrió un error inesperado",
        isLoading: false,
      }));

      return { success: false, error: error.message || "Ocurrió un error inesperado" };
    }
  };

  return {
    ...fetchUpdatePetState,
    fetchUpdatePet,
  };
};