import { useState } from "react";
import { FetchPetById } from "../../Utils/Fetch/FetchGetPet/FetchGetPetId";
import { usePet } from "../../Contexts/PetContext/PetContext";

export const useFetchPetById = () => {
  const [petState, setPetState] = useState({
    isLoading: false,
    error: null,
    isSuccess: false,
    petResult: null,
  });

  const pets = usePet();
  const { addPet } = pets ?? {};

  const getPetById = async (id) => {
    setPetState((prev) => ({ ...prev, isLoading: true }));

    try {
      // Fetch the pet by ID
      const petData = await FetchPetById(id);
      if (petData.ok) {
        // Successfully fetched pet data
        setPetState((prev) => ({
          ...prev,
          isSuccess: true,
          isLoading: false,
          petResult: petData.pet,
        }));
        //add the pet locally
        addPet(petData.pet);

        return { success: true, pet: petData };
      }
      return {success: false}
    } catch (error) {
      console.error("Error fetching pet:", error);
      setPetState((prev) => ({
        ...prev,
        error: error.message || "An unexpected error occurred",
        isLoading: false,
      }));

      return {
        success: false,
        error: error.message || "An unexpected error occurred",
      };
    }
  };

  return {
    ...petState,
    getPetById,
  };
};
