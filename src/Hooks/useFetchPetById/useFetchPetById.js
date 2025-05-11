import { useState } from "react";
import { FetchPetById } from "../../Utils/Fetch/FetchGetPet/FetchGetPetId";
import { usePet } from "../../Contexts/PetContext/PetContext";

export const useFetchPetById = () => {
  const [petState, setPetState] = useState({
    isLoading: false,
    error: null,
    isSuccess: false,
    petResult: null,
    redirect: null
  });

  const pets = usePet();
  const { addPet } = pets ?? {};

  const getPetById = async (id) => {
    setPetState((prev) => ({ ...prev, isLoading: true, redirect: null }));

    try {
      const response = await FetchPetById(id);
      
      // Handle redirect case
      if (response.redirect) {
        setPetState((prev) => ({
          ...prev,
          isSuccess: false,
          isLoading: false,
          error: response.message,
          redirect: response.redirect
        }));
        return { success: false, redirect: response.redirect };
      }

      // Handle successful pet data
      if (response.ok && response.pet) {
        setPetState((prev) => ({
          ...prev,
          isSuccess: true,
          isLoading: false,
          petResult: response.pet,
          redirect: null
        }));
        // Add the pet locally
        addPet(response.pet);
        return { success: true, pet: response.pet };
      }

      // Handle error case
      setPetState((prev) => ({
        ...prev,
        error: response.message || "Error al obtener la mascota",
        isLoading: false,
        redirect: null
      }));
      return { success: false, error: response.message };

    } catch (error) {
      console.error("Error fetching pet:", error);
      setPetState((prev) => ({
        ...prev,
        error: error.message || "Error al obtener la mascota",
        isLoading: false,
        redirect: null
      }));
      return { success: false, error: error.message };
    }
  };

  return {
    ...petState,
    getPetById,
  };
};
