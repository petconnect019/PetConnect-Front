import { useState } from 'react';
import { isTokenExpired } from '../../Utils/Helpers/IsTokenExpired/IsTokenExpired';
import { FetchRefreshToken } from "../../Utils/Fetch/FetchRefreshToken/FetchRefreshToken";
import { FetchAddPet } from '../../Utils/Fetch/FetchAddPet/FetchAddPet';
import { useIsFetchedPets } from '../../Contexts/IsFetchedPets/IsFetchedPets';

export const useFetchAddPet = () => {
  const [addPetState, setAddPetState] = useState({
    isLoading: false,
    error: null,
    isSuccess: false,
    pet: null
  });

  const { changeIsFetched } = useIsFetchedPets();

  const addPet = async (petData) => {
    setAddPetState((prev)=> ({...prev, isLoading: true}));

    try {
      // Get the token from session storage
      let token = sessionStorage.getItem("accessToken");

      // Check if token is expired and refresh if needed
      if (isTokenExpired(token)) {
        try {
          await FetchRefreshToken();
          token = sessionStorage.getItem("accessToken");
        } catch (refreshError) {
          console.log(refreshError);
          setAddPetState((prev)=> ({...prev, error: refreshError, isLoading: false }))
          return { success: false, error: "Authentication error" };
        }
      }

      // Submit the pet data
      const response = await FetchAddPet(petData, token);
      
      if (response.ok) {
        console.log(response);

        changeIsFetched(false); // Trigger refetch of pets list
        setAddPetState((prev)=>({...prev, isSuccess: true, isLoading: false, pet: response}))
        return { success: true };
      } else {
        setAddPetState((prev)=> ({...prev, error: response.message || "An unexpected error occurred", isLoading: false }))
        return { success: false, error: response.message || "Error adding pet" };
      }
    } catch (error) {
      console.error("Error adding pet:", error);
      setAddPetState((prev)=> ({...prev, error: error.message || "An unexpected error occurred", isLoading: false }))

      return { success: false, error: error.message || "An unexpected error occurred" };
    }
  };

  return {
    ...addPetState,
    addPet
  };
};