import React, { useState, useEffect } from 'react';
import { useAuth } from "../../Contexts/AuthContext/AuthContext";
import { FetchRefreshToken } from '../../Utils/Fetch/FetchRefreshToken/FetchRefreshToken';
import { isTokenExpired } from '../../Utils/Helpers/IsTokenExpired/IsTokenExpired';

export const ProfileSection = ({ navigate }) => {
    const [userData, setUserData] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);
    const { isAuthenticated } = useAuth();

    useEffect(() => {
        const fetchUserProfile = async () => {
            try {
                // Primero intentamos obtener los datos del sessionStorage
                const storedUserData = sessionStorage.getItem("userData");
                if (storedUserData) {
                    try {
                        const parsedData = JSON.parse(storedUserData);
                        if (parsedData && typeof parsedData === 'object') {
                            setUserData(parsedData);
                            setIsLoading(false);
                            return;
                        }
                    } catch (parseError) {
                        console.error("Error al parsear datos del usuario:", parseError);
                        // Continuamos con la llamada a la API si hay error al parsear
                    }
                }

                let token = sessionStorage.getItem("accessToken");
                
                if (!token) {
                    setError("No hay token de acceso disponible");
                    setIsLoading(false);
                    return;
                }

                if (isTokenExpired(token)) {
                    try {
                        await FetchRefreshToken();
                        token = sessionStorage.getItem("accessToken");
                    } catch (refreshError) {
                        console.error("Error al refrescar el token:", refreshError);
                        setError("Error de autenticación");
                        setIsLoading(false);
                        return;
                    }
                }

                const response = await fetch(`${import.meta.env.VITE_API_URL}/api/users/profile`, {
                    method: 'GET',
                    headers: {
                        'Authorization': `Bearer ${token}`,
                        'Content-Type': 'application/json'
                    }
                });

                if (!response.ok) {
                    const errorData = await response.json();
                    throw new Error(errorData.message || 'Error al obtener el perfil del usuario');
                }

                const data = await response.json();
                if (data.user) {
                    setUserData(data.user);
                    sessionStorage.setItem("userData", JSON.stringify(data.user));
                } else {
                    throw new Error('Datos de usuario no disponibles');
                }
                setIsLoading(false);
            } catch (error) {
                console.error("Error al obtener el perfil del usuario:", error);
                setError(error.message);
                setIsLoading(false);
            }
        };

        if (isAuthenticated) {
            fetchUserProfile();
        } else {
            setIsLoading(false);
        }
    }, [isAuthenticated]); 

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
            onClick={() => navigate("/user-profile-config")} 
            className="flex items-center cursor-pointer"
        >
            <img 
                src={userData.profile_picture || "/profile.jpg"} 
                alt="Profile" 
                className="w-16 h-16 xs:w-18 xs:h-18 sm:w-20 sm:h-20 md:w-22 md:h-22 lg:w-24 lg:h-24 xl:w-26 xl:h-26 2xl:w-28 2xl:h-28 3xl:w-30 3xl:h-30 4xl:w-32 4xl:h-32 rounded-full border border-gray-300 object-cover" 
            />
            <div className="ml-3 xs:ml-4 sm:ml-5 md:ml-6 lg:ml-7 xl:ml-8">
                <h2 className="text-lg xs:text-xl sm:text-2xl md:text-3xl lg:text-4xl xl:text-5xl font-semibold">
                    {userData.name || 'Usuario'}
                </h2>
                <p className="text-gray-500 text-base xs:text-lg sm:text-xl md:text-2xl lg:text-3xl xl:text-4xl">Dueño</p>
            </div>
        </section>
    );
};