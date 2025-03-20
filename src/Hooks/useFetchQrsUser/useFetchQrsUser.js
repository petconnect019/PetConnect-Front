import { useState } from "react";
import { FetchQrsUser } from "../../Utils/Fetch/FetchQrsUser/FetchQrsUser";
import { isTokenExpired } from "../../Utils/Helpers/IsTokenExpired/IsTokenExpired";

export const useFetchQrsUser = () => {
  const [qrsState, setQrsState] = useState({
    isLoading: false,
    error: null,
    isSuccess: false,
    qrsResult: null,
  });

  const getQrsById = async () => {
    setQrsState((prev) => ({ ...prev, isLoading: true }));

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

      // Fetch the qrs by ID
      const qrsData = await FetchQrsUser(token);
      if (qrsData.ok) {
        // Successfully fetched qrs data
        setQrsState((prev) => ({
          ...prev,
          isSuccess: true,
          isLoading: false,
          qrsResult: qrsData.data.qrs,
        }));

        return { success: true, qrs: qrsData };
      }
      return {success: false}
    } catch (error) {
      console.error("Error fetching qrs:", error);
      setQrsState((prev) => ({
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
    ...qrsState,
    getQrsById,
  };
};
