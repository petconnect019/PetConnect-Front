import React, { useEffect, useState } from 'react';
import { useAuth } from '../../Contexts/AuthContext/AuthContext';
import { useHasPetsUser } from '../../Contexts/HasPetsUser/HasPetsUser';

export const GoogleSignUp = ({ navigate, content }) => {
  const auth = useAuth();
  const Pets = useHasPetsUser();

  // Verificamos si el contexto de autenticación está disponible antes de desestructurar
  if (!auth) return <div className="text-center text-gray-600">Cargando autenticación...</div>;

  const { login } = auth;
  const { hasPets } = Pets;
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
    console.log(hasPetsResponse, isNewUser);
    if (token) {
      login(token);
      if (!isNewUser) {
        navigate('/home');
        
      } else {
        navigate('/step-pet');
      }
      if (hasPetsResponse) {
        hasPets(true);
      }
    }
  }, [token, login, hasPetsResponse, isNewUser, navigate]);

  return (
    <button
      type="button"
      onClick={handleGoogleSignUp}
      className="w-full mt-4 flex items-center justify-center gap-2 bg-white border border-gray-300 text-gray-700 
                py-2 px-4 rounded-md shadow-sm hover:bg-gray-100 focus:outline-none 
                focus:ring-2 focus:ring-gray-300 transition-all duration-300"
      aria-label="Registrarse con Google"
    >
      <img
        src="https://upload.wikimedia.org/wikipedia/commons/5/53/Google_%22G%22_Logo.svg"
        alt="Google Logo"
        className="w-5 h-5"
      />
      <span className="font-medium"> {content} </span>
    </button>
  );
};
