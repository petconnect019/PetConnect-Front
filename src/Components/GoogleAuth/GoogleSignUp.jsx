import React, { useEffect, useState } from 'react';
import { useAuth } from '../../Contexts/AuthContext/AuthContext';

export const GoogleSignUp = ({ navigate, content }) => {
  const { login } = useAuth();
  const [token, setToken] = useState(null);
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
            popup.close();
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
      navigate('/home');
    }
  }, [token, login, navigate]);

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
