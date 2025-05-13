import React, { useEffect, useCallback } from 'react';
import { useAuth } from '../../Contexts/AuthContext/AuthContext';
import { useHasPetsUser } from '../../Contexts/HasPetsUser/HasPetsUser';
import logo from '../../assets/images/logoGoogleLight.png';

export const GoogleSignUp = ({ content, setUser, setAccesToken, setHasPetsState, setIsnewUserState, setErrorState}) => {
  const auth = useAuth();
  const pets = useHasPetsUser();

  // Use early return pattern consistently
  if (!auth || !pets) {
    return <div className="text-center text-gray-600">Cargando autenticación...</div>;
  }

  const { login } = auth;
  const { changeHasPetsUser } = pets;


  // Use useCallback to avoid recreating this function on every render
  const handleGoogleSignUp = useCallback(() => {
    const popupUrl = 'https://petconnect-backend-production.up.railway.app/api/auth/google';
    const popupName = 'Google Login';
    const popupFeatures = 'width=500,height=600,left=300,top=200';
    
    try {
      const popup = window.open(popupUrl, popupName, popupFeatures);
      
      if (!popup || popup.closed || typeof popup.closed === 'undefined') {
        console.error('Popup bloqueado. Intentando redirección directa.');
        window.location.href = popupUrl;
        return;
      }
      
      const messageListener = async (event) => {
        if (event.origin !== 'https://petconnect-backend-production.up.railway.app' || !event.data) {
          return;
        }
        
        window.removeEventListener('message', messageListener);
        
        if (event.data.error) {
          setErrorState('Este correo no está registrado. Por favor, regístrate.');
          return;
        }
        
        if (event.data.accessToken) {
          setUser && setUser(event.data.user);
          setAccesToken && setAccesToken(event.data.accessToken);
          setHasPetsState && setHasPetsState(!!event.data.hasPets);
          setIsnewUserState && setIsnewUserState(!!event.data.isNewUser);
        }
      };
      
      window.addEventListener('message', messageListener);
      
      // Clean up the event listener if the component unmounts
      return () => {
        window.removeEventListener('message', messageListener);
        if (popup && !popup.closed) {
          popup.close();
        }
      };
    } catch (error) {
      console.error('Error al abrir popup:', error);
      window.location.href = popupUrl;
    }
  }, [login, changeHasPetsUser]);

  return (
    <button
      type="button"
      onClick={handleGoogleSignUp}
      className="block mx-auto flex items-center justify-between w-full max-w-md bg-white text-black border-solid border-2 border-gray-100 
      px-5 xs:px-5.5 sm:px-6 md:px-6.5 lg:px-7 xl:px-7 2xl:px-7.5 3xl:px-8 4xl:px-10 py-4 xs:py-3.5 sm:py-4 md:py-4.5 lg:py-5 xl:py-5 2xl:py-3 3xl:py-3 4xl:py-3 
      rounded-full mt-8 
      text-sm xs:text-base sm:text-lg md:text-xl lg:text-2xl xl:text-2xl 2xl:text-2xl 3xl:text-2xl 4xl:text-2xl font-medium"
      aria-label="Registrarse con Google"
    >
      <img
        src={logo}
        alt="Google Logo"
        className="w-5 h-5 xs:w-6 xs:h-6 sm:w-7 sm:h-7 md:w-8 md:h-8 lg:w-9 lg:h-9 xl:w-9 xl:h-9 2xl:w-8 2xl:h-8 3xl:w-8 3xl:h-8 4xl:w-8 4xl:h-8" 
      />
      <span className="flex-grow text-center">{content}</span>
    </button>
  );
};