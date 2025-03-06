import React, { useEffect, useState } from 'react';
import { useAuth } from '../../Contexts/AuthContext/AuthContext';
import { useHasPetsUser } from '../../Contexts/HasPetsUser/HasPetsUser';
import logo from '../../assets/logoGoogleLight.png';


export const GoogleSignUp = ({ navigate, content }) => {
  const auth = useAuth();
  const Pets = useHasPetsUser();

  // Verificamos si el contexto de autenticación está disponible antes de desestructurar
  if (!auth) return <div className="text-center text-gray-600">Cargando autenticación...</div>;

  const { login } = auth ?? {};
  const { changeHasPetsUser } = Pets;
  const [token, setToken] = useState(null);
  const [hasPetsResponse, setHasPetResponse] = useState(null);
  const [isNewUser, setIsNewUser] = useState(null);


  const handleGoogleSignUp = () => {
    let messageListener = null;

    try {
      const popup = window.open(
        'http://localhost:5000/api/auth/google',
        'Google Login',
        'width=500,height=600,left=300,top=200'
      );

      if (!popup || popup.closed || typeof popup.closed === 'undefined') {
        throw new Error('Popup bloqueado');
      }

      messageListener = async (event) => {
        if (event.origin === 'http://localhost:5000' && event.data) {
          window.removeEventListener('message', messageListener);

          if (event.data.error) {
            alert('Este correo no está registrado. Por favor, regístrate.');
            navigate('/register');
          } else if (event.data.accessToken) {
            setToken(event.data.accessToken);
            setHasPetResponse(!!event.data.hasPets);
            setIsNewUser(event.data.isNewUser);
          }
        }
      };

      window.addEventListener('message', messageListener);
    } catch (error) {
      console.error('Error al abrir popup:', error);
      window.location.href = 'http://localhost:5000/api/auth/google';
    }
  };

  useEffect(() => {
    if (token) {
      login(token);
      if (!isNewUser) {
        navigate('/home');
        
      } else {
        navigate('/step-pet');
      }
      if (hasPetsResponse) {
        changeHasPetsUser(true);
      }
    }
  }, [token, login, hasPetsResponse, isNewUser, navigate]);

  return (
    <button
      type="button"
      onClick={handleGoogleSignUp}
      className="flex items-center space-x-7 w-full max-w-xs bg-white text-black border-solid border-2 border-gray-100 px-5 py-2.5 rounded-full mt-8 text-lg font-medium"
      aria-label="Registrarse con Google"
    >
      <img
        src={logo}
        alt="Google Logo"
        className="w-6" 
      />
      <span> {content} </span>
    </button>
  );
};
