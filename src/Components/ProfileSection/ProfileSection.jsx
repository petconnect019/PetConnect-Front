import React, { useState, useEffect } from 'react';
import { useAuth } from "../../Contexts/AuthContext/AuthContext";
import DefaultProfile from '../../assets/images/DefaultProfile.png';

export const ProfileSection = ({ navigate }) => {
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);
    const [userData, setUserData] = useState(null);
    const { isAuthenticated } = useAuth();

    // Función para obtener datos directamente del sessionStorage
    const getUserDataFromSession = () => {
        try {
            const storedUserData = sessionStorage.getItem("userData");
            if (storedUserData) {
                const parsedData = JSON.parse(storedUserData);
                console.log("Datos del usuario obtenidos del sessionStorage:", parsedData);
                setUserData(parsedData);
                setIsLoading(false);
                return true;
            }
            return false;
        } catch (error) {
            console.error("Error al obtener datos del sessionStorage:", error);
            setError("Error al cargar datos del usuario");
            setIsLoading(false);
            return false;
        }
    };

    const handleNavigate = () => {
        if (userData) {
            const userId = userData.id || userData._id;
            if (userId) {
                console.log("Navegando a perfil con ID:", userId);
                navigate(`/user-profile-config/${userId}`);
            } else {
                console.error("No se encontró el ID del usuario en los datos");
            }
        } else {
            console.error("No se encontraron datos del usuario");
        }
    };

    // Cargar datos al iniciar y cuando cambia el estado de autenticación
    useEffect(() => {
        if (isAuthenticated) {
            setIsLoading(true);
            getUserDataFromSession();
        } else {
            setUserData(null);
            setIsLoading(false);
        }
    }, [isAuthenticated]);
    
    // Escuchar cambios en el sessionStorage
    useEffect(() => {
        const handleStorageChange = (event) => {
            if ((event.key === 'userData' && event.storageArea === sessionStorage) || 
                (event.type === 'storage' && event.key === 'userData')) {
                console.log("Detectado cambio en userData del sessionStorage - actualizando perfil");
                getUserDataFromSession();
            }
        };
        
        // Para cambios desde otras pestañas
        window.addEventListener('storage', handleStorageChange);
        
        // Para cambios dentro de la misma pestaña (custom event)
        const handleCustomEvent = () => {
            console.log("Evento userDataUpdated recibido - actualizando perfil");
            getUserDataFromSession();
        };
        window.addEventListener('userDataUpdated', handleCustomEvent);
        
        // Verificar datos al montar el componente
        getUserDataFromSession();
        
        return () => {
            window.removeEventListener('storage', handleStorageChange);
            window.removeEventListener('userDataUpdated', handleCustomEvent);
        };
    }, []);

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

    // Usar imagen por defecto si la del perfil no existe
    const profileImage = userData.profile_picture || DefaultProfile;
    // Usar nombre tal como está en el sessionStorage
    const userName = userData.name || 'Usuario';

    return (
        <section 
            onClick={handleNavigate}
            className="flex items-center cursor-pointer"
        >
            <img 
                src={profileImage} 
                alt="Profile" 
                className="w-16 h-16 xs:w-18 xs:h-18 sm:w-20 sm:h-20 md:w-22 md:h-22 lg:w-24 lg:h-24 xl:w-26 xl:h-26 2xl:w-28 2xl:h-28 3xl:w-30 3xl:h-30 4xl:w-32 4xl:h-32 rounded-full border border-gray-300 object-cover" 
                onError={(e) => {
                    e.target.onerror = null;
                    e.target.src = DefaultProfile;
                }}
            />
            <div className="ml-3 xs:ml-4 sm:ml-5 md:ml-6 lg:ml-7 xl:ml-8">
                <h2 className="text-lg xs:text-xl sm:text-2xl md:text-3xl lg:text-4xl xl:text-5xl font-semibold">
                    {userName}
                </h2>
                <p className="text-gray-500 text-base xs:text-lg sm:text-xl md:text-2xl lg:text-3xl xl:text-4xl">Dueño</p>
            </div>
        </section>
    );
};