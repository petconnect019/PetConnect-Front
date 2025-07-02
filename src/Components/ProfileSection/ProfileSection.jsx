import React, { useEffect, useState } from 'react';
import { useAuth } from "../../Contexts/AuthContext/AuthContext";
import { useFetchUserProfile } from '../../Hooks/useFetchUserProfile/useFetchUserProfile';
import DefaultProfile from '../../assets/images/DefaultProfile.png'

export const ProfileSection = ({ navigate }) => {
    const { isAuthenticated } = useAuth();
    const { isLoading: hookLoading, error: hookError, userData: hookUserData, fetchUserProfile } = useFetchUserProfile();
    
    // Estado local para gestionar los datos del usuario correctamente
    const [userData, setUserData] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);

    // Recupera manualmente los datos del usuario desde la API para asegurar datos actualizados
    const fetchUpdatedUserData = async () => {
        try {
            setIsLoading(true);
            
            // Obtenemos el token de acceso
            const token = localStorage.getItem("accessToken");
            if (!token) {
                throw new Error("No hay token de acceso disponible");
            }

            // Hacemos la llamada directa a la API
            const response = await fetch(`${import.meta.env.VITE_API_URL}/api/users/profile`, {
                method: 'GET',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                },
                cache: 'no-store'
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.message || 'Error al obtener el perfil del usuario');
            }

            const data = await response.json();
            console.log("Datos obtenidos directamente:", data);

            // Verificamos si los datos vienen en el campo profile
            const profileData = data.profile || data.user || data;
            
            if (profileData) {
                setUserData(profileData);
                
                // También guardamos en localStorage para mantener consistencia
                localStorage.setItem("userData", JSON.stringify(profileData));
                
                setIsLoading(false);
            } else {
                throw new Error('Datos de usuario no disponibles');
            }
        } catch (err) {
            console.error("Error al obtener perfil:", err);
            setError(err.message);
            setIsLoading(false);
        }
    };

    useEffect(() => {
        if (isAuthenticated) {
            fetchUpdatedUserData();
        } else {
            setIsLoading(false);
        }
    }, [isAuthenticated]);

    // Fallback para usar datos del hook si la obtención directa falla
    useEffect(() => {
        if (hookUserData && !userData) {
            console.log("Usando datos de respaldo del hook:", hookUserData);
            setUserData(hookUserData);
        }
    }, [hookUserData, userData]);

    const handleNavigate = () => {
        if (userData) {
            // Usamos el ID correcto según la estructura
            const userId = userData._id || userData.id;
            if (userId) {
                console.log("Navegando a perfil con ID:", userId);
                navigate(`/user-profile-config/${userId}`);
            } else {
                console.error("No se encontró el ID del usuario en los datos almacenados");
                console.error("Datos de usuario disponibles:", userData);
            }
        } else {
            console.error("No se encontraron datos del usuario");
        }
    };

    if (isLoading) {
        return (
            <section className="flex items-center">
                <div className="animate-pulse flex items-center">
                    <div className="w-16 h-16 xs:w-18 xs:h-18 sm:w-20 sm:h-20 md:w-22 md:h-22 lg:w-24 lg:h-24 xl:w-26 xl:h-26 2xl:w-28 2xl:h-28 3xl:w-30 3xl:h-30 4xl:w-32 4xl:h-32 bg-gray-300 rounded-full"></div>
                    <div className="ml-3 xs:ml-4 sm:ml-5 md:ml-6 lg:ml-7 xl:ml-8">
                        <div className="h-4 xs:h-5 sm:h-6 md:h-7 lg:h-8 xl:h-9 bg-gray-300 rounded w-32 xs:w-36 sm:w-40 md:w-44 lg:w-48 xl:w-52 mb-2 xs:mb-3 sm:mb-4 md:mb-5 lg:mb-6"></div>
                        <div className="h-4 xs:h-5 sm:h-6 md:h-7 lg:h-8 xl:h-9 bg-gray-300 rounded w-28 xs:w-32 sm:w-36 md:w-40 lg:w-44 xl:w-48"></div>
                    </div>
                </div>
            </section>
        );
    }

    if (error) {
        return (
            <section className="flex items-center">
                <div className="ml-3 xs:ml-4 sm:ml-5 md:ml-6 lg:ml-7 xl:ml-8">
                    <h2 className="text-lg xs:text-xl sm:text-2xl md:text-3xl lg:text-4xl xl:text-5xl font-semibold text-red-500">Error</h2>
                    <p className="text-gray-500 text-base xs:text-lg sm:text-xl md:text-2xl lg:text-3xl xl:text-4xl">{error}</p>
                </div>
            </section>
        );
    }

    if (!userData) {
        return (
            <section className="flex items-center">
                <div className="ml-3 xs:ml-4 sm:ml-5 md:ml-6 lg:ml-7 xl:ml-8">
                    <h2 className="text-lg xs:text-xl sm:text-2xl md:text-3xl lg:text-4xl xl:text-5xl font-semibold">Usuario no identificado</h2>
                    <p className="text-gray-500 text-base xs:text-lg sm:text-xl md:text-2xl lg:text-3xl xl:text-4xl">Inicia sesión</p>
                </div>
            </section>
        );
    }

    return (
        <section 
            onClick={handleNavigate}
            className="flex items-center cursor-pointer"
        >
            <img 
                src={userData.profile_picture || DefaultProfile} 
                alt="Profile" 
                className="w-16 h-16 xs:w-18 xs:h-18 sm:w-20 sm:h-20 md:w-22 md:h-22 lg:w-24 lg:h-24 xl:w-26 xl:h-26 2xl:w-28 2xl:h-28 3xl:w-30 3xl:h-30 4xl:w-32 4xl:h-32 rounded-full border border-gray-300 object-cover" 
            />
            <div className="ml-3 xs:ml-4 sm:ml-5 md:ml-6 lg:ml-7 xl:ml-8">
                <h2 className="text-lg xs:text-xl sm:text-2xl md:text-3xl lg:text-4xl xl:text-5xl font-semibold">
                    {userData.name || 'Usuario'}
                </h2>
                <p className="text-gray-500 text-base xs:text-lg sm:text-xl md:text-2xl lg:text-3xl xl:text-4xl">
                    {userData.role === "admin" ? "Administrador" : "Dueño"}
                </p>
            </div>
        </section>
    );
};