import React, { useEffect, useCallback } from 'react';
import { useAuth } from '../../Contexts/AuthContext/AuthContext';
import { useHasPetsUser } from '../../Contexts/HasPetsUser/HasPetsUser';
import logo from '../../assets/logoGoogleLight.png';

export const GoogleSignUp = ({ navigate, content }) => {
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
    const popupUrl = 'http://localhost:5000/api/auth/google';
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
        if (event.origin !== 'http://localhost:5000' || !event.data) {
          return;
        }
        
        window.removeEventListener('message', messageListener);
        
        if (event.data.error) {
          alert('Este correo no está registrado. Por favor, regístrate.');
          navigate('/register');
          return;
        }
        
        if (event.data.accessToken) {
          login(event.data.accessToken);
          
          const hasPets = Boolean(event.data.hasPets);
          if (hasPets) {
            changeHasPetsUser(true);
          }
          
          navigate(event.data.isNewUser ? '/step-pet' : '/home');
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
  }, [login, changeHasPetsUser, navigate]);

  return (
    <button
      type="button"
      onClick={handleGoogleSignUp}
      className="flex items-center justify-between w-full max-w-xs bg-white text-black border-solid border-2 border-gray-100 px-5 py-2.5 rounded-full mt-8 text-lg font-medium"
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