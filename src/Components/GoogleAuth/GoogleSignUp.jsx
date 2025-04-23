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
    const popupUrl = `${import.meta.env.VITE_API_URL}/api/auth/google`;
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
        if (event.origin !== import.meta.env.VITE_API_URL || !event.data) {
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
      className="block mx-auto flex items-center justify-between w-full max-w-md bg-white text-black border-solid border-2 border-gray-100 px-5 py-2.5 rounded-full mt-8 text-lg font-medium"
      aria-label="Registrarse con Google"
    >
      <img
        src={logo}
        alt="Google Logo"
        className="w-6" 
      />
      <span className="flex-grow text-center">{content}</span>
    </button>
  );
};