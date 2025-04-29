import { useState } from "react";
import { FetchUpdateUser } from "../../Utils/Fetch/FetchUpdateUser/FetchUpdateUser";
import { FetchUpdatePhotoU } from "../../Utils/Fetch/FetchUpdatePhotoU/FetchUpdatePhotoU";
import { isTokenExpired } from "../../Utils/Helpers/IsTokenExpired/IsTokenExpired";
import { FetchRefreshToken } from "../../Utils/Fetch/FetchRefreshToken/FetchRefreshToken";
import DefaultProfile from '../../assets/images/DefaultProfile.png';

export const useFetchUpdateUser = () => {
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState(null);
    const [userFetched, setUserFetched] = useState(null);

    const updateUser = async (formData, filePfp = null) => {
        setIsLoading(true);
        setError(null);

        try {
            let token = sessionStorage.getItem('accessToken');

            if (!token || isTokenExpired(token)) {
                try {
                    await FetchRefreshToken();
                    token = sessionStorage.getItem('accessToken');
                } catch (error) {
                    console.log("Error al refrescar el token:", error);
                    setError("Error al refrescar el token");
                    setIsLoading(false);
                    return;
                }
            }

            const responseUser = await FetchUpdateUser(formData, token);
            
            if (responseUser.ok) {
                const currentUserData = JSON.parse(sessionStorage.getItem("userData")) || {};
                
                const updatedUserData = {
                    ...currentUserData,
                    name: formData.get('name'),
                    phone: formData.get('phone'),
                    gender: formData.get('gender'),
                    country: formData.get('country'),
                    state: formData.get('state'),
                    city: formData.get('city'),
                    address: formData.get('address'),
                    profile_picture: DefaultProfile
                };
                
                console.log("Datos del usuario a guardar:", updatedUserData);
                sessionStorage.setItem("userData", JSON.stringify(updatedUserData));

                const formDataPhoto = new FormData();
                if (filePfp) {
                    formDataPhoto.append("profile_picture", filePfp);
                } else {
                    const response = await fetch(DefaultProfile);
                    const blob = await response.blob();
                    formDataPhoto.append("profile_picture", blob, "default-profile.png");
                }

                const responsePhoto = await FetchUpdatePhotoU(formDataPhoto, token);
                if (responsePhoto.ok) {
                    const finalUserData = {
                        ...updatedUserData,
                        profile_picture: responsePhoto.profilePicture || DefaultProfile
                    };
                    console.log("Datos finales del usuario:", finalUserData);
                    sessionStorage.setItem("userData", JSON.stringify(finalUserData));
                    setUserFetched(finalUserData);
                } else {
                    console.error("No se pudo actualizar la foto:", responsePhoto.message);
                    setError("No se pudo actualizar la foto de perfil");
                }
            } else {
                console.error("Error al actualizar usuario:", responseUser.message);
                setError(responseUser.message || "Error al actualizar el usuario");
            }
        } catch (error) {
            console.error("Error al actualizar usuario:", error);
            setError(error.message || "Error al actualizar el usuario");
        } finally {
            setIsLoading(false);
        }
    };

    return {
        updateUser,
        isLoading,
        error,
        userFetched
    };
};