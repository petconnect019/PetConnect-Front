import { useState } from "react";
import { isTokenExpired } from "../../Utils/Helpers/IsTokenExpired/IsTokenExpired";
import { FetchRefreshToken } from "../../Utils/Fetch/FetchRefreshToken/FetchRefreshToken";
import { FetchUpdatePhotoPet } from "../../Utils/FetchUpdatePhotoPet/FetchUpdatePhotoPet";
import { FetchUpdateUser } from "../../Utils/Fetch/FetchUpdateUser/FetchUpdateUser";
import { useIsFetchedUsers } from "../../Contexts/isFetchedUsers/isFetchedUsers";


export const useFetchUpdateUser = () => {
  const fetched = useIsFetchedUsers();
  const {changeIsFetched} = fetched ?? {};

  const [fetchUpdateUserState, setUpdateUserState] = useState({
    isLoading: false,
    error: null,
    isSuccess: false,
    userFetched: null
    // userPicture: null
  });


  const fetchUpdateUser = async (userData, file) => {
    setUpdateUserState((prev) => ({ ...prev, isLoading: true }));

    try {
      let token = sessionStorage.getItem("accessToken");

      if (isTokenExpired(token)) {
        try {
          await FetchRefreshToken();
          token = sessionStorage.getItem("accessToken");
        } catch (refreshError) {
          console.log(refreshError);
          setUpdateUserState((prev) => ({ ...prev, error: refreshError, isLoading: false }));
          return { success: false, error: "Authentication error" }; 
        }
      }

      const response = await FetchUpdateUser(userData, token);
      if (!response.ok || !response.user) {
        throw new Error(response.message || "Error al actualizar el usuario");
      }

      const updatedUser = response.user;

      if (file) {
        // const responsePhotoUser = await FetchUpdatePhotoUser(userData, file, token);
        // if (!responsePhotoUser.ok) {
        //   throw new Error(responsePhotoUser.message || "Error al actualizar la foto del usuario");
        // }
        // // actualizamos el estado de la foto de la mascota
        // setUpdateUserState((prev)=> ({
        //   ...prev,
        //   userPicture: responsePhotoPet.profile_picture
        // }))
        
      }

       // Actualizar el estado global
       setUpdateUserState((prev) => ({
        ...prev,
        isSuccess: true,
        isLoading: false,
        userFetched: updatedUser,
      }));

      changeIsFetched(false);

      return { success: true };
      
    } catch (error) {
      console.error("Error actualizando usuario:", error);
      setUpdateUserState((prev) => ({
        ...prev,
        error: error.message || "Ocurrió un error inesperado",
        isLoading: false,
      }));

      return { success: false, error: error.message || "Ocurrió un error inesperado" };
    }
  };

  return {
    ...fetchUpdateUserState,
    fetchUpdateUser,
  };
};