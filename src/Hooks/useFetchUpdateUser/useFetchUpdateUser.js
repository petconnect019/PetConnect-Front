import { useState } from "react";
import { FetchUpdateUser } from "../../Utils/Fetch/FetchUpdateUser/FetchUpdateUser";
import { FetchUpdatePhotoU } from "../../Utils/Fetch/FetchUpdatePhotoU/FetchUpdatePhotoU";
import { isTokenExpired } from "../../Utils/Helpers/IsTokenExpired/IsTokenExpired";
import { FetchRefreshToken } from "../../Utils/Fetch/FetchRefreshToken/FetchRefreshToken";
// Import for local reference only, don't use in stored data
import DefaultProfile from '../../assets/images/DefaultProfile.png';

export const useFetchUpdateUser = () => {
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState(null);
    const [userFetched, setUserFetched] = useState(null);
    const [isSuccess, setIsSuccess] = useState(false);

    const updateUser = async (formData, filePfp = null) => {
        setIsLoading(true);
        setError(null);
        setIsSuccess(false);

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
                    return { success: false, error: "Error al refrescar el token" };
                }
            }

            // Obtener los datos actuales del usuario desde sessionStorage sin modificarlos
            const currentUserData = JSON.parse(sessionStorage.getItem('userData')) || {};
            
            const responseUser = await FetchUpdateUser(formData, token);
            console.log("Respuesta del backend en hook:", responseUser);
            
            if (responseUser.ok) {
                // Crear un objeto con los datos actualizados manteniendo la estructura original
                const updatedUserData = {
                    ...currentUserData, // Mantener todos los datos actuales
                    name: formData.get('name'),
                    phone: formData.get('phone'),
                    gender: formData.get('gender'),
                    country: formData.get('country'),
                    state: formData.get('state'),
                    city: formData.get('city'),
                    address: formData.get('address'),
                    // Mantener la URL de la imagen existente, no usar DefaultProfile aquí
                    profile_picture: currentUserData.profile_picture 
                };

                // Solo actualizamos la foto si se proporciona una nueva
                if (filePfp) {
                    const formDataPhoto = new FormData();
                    formDataPhoto.append("profile_picture", filePfp);
                    
                    const responsePhoto = await FetchUpdatePhotoU(formDataPhoto, token);
                    if (responsePhoto.ok) {
                        // Asegurarse de que la respuesta del backend contenga la URL completa de la imagen
                        updatedUserData.profile_picture = responsePhoto.profilePicture;
                        console.log("Foto actualizada con URL:", responsePhoto.profilePicture);
                    } else {
                        console.error("No se pudo actualizar la foto:", responsePhoto.message);
                        setError("No se pudo actualizar la foto de perfil");
                        return { success: false, error: "No se pudo actualizar la foto de perfil" };
                    }
                }
                
                // Actualizar el estado local
                setUserFetched(updatedUserData);
                
                // IMPORTANTE: Actualizar el sessionStorage con los datos actualizados
                sessionStorage.setItem('userData', JSON.stringify(updatedUserData));
                
                setIsSuccess(true);
                return { success: true, data: responseUser };
            } else {
                console.error("Error al actualizar usuario:", responseUser.message);
                setError(responseUser.message || "Error al actualizar el usuario");
                return { success: false, error: responseUser.message || "Error al actualizar el usuario" };
            }
        } catch (error) {
            console.error("Error al actualizar usuario:", error);
            setError(error.message || "Error al actualizar el usuario");
            return { success: false, error: error.message || "Error al actualizar el usuario" };
        } finally {
            setIsLoading(false);
        }
    };

    return {
        updateUser,
        isLoading,
        error,
        userFetched,
        isSuccess
    };
};