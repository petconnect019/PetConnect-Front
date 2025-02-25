import React from 'react';

export const GoogleSignUp = ({ navigate, content }) => {
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
        console.log(event.data);
        
        if (event.origin === 'http://localhost:5000' && event.data) {
          window.removeEventListener('message', messageListener);

          if (event.data.error) {
            alert('Este correo no está registrado. Por favor, regístrate.');
            navigate('/register');
          } else if (event.data.accessToken) {
            localStorage.setItem('accessToken', event.data.accessToken);
            popup.close();
            navigate('/home');
          }
        }
      };

      window.addEventListener('message', messageListener);
    } catch (error) {
      console.error('Error al abrir popup:', error);
      window.location.href = 'http://localhost:5000/api/auth/google';
    }
  };

  return (
    <button
      type="button"
      onClick={handleGoogleSignUp}
      className="w-full mt-4 bg-red-600 text-white py-2 px-4 rounded-md hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 flex items-center justify-center"
    >
      <img src="https://www.google.com/favicon.ico" alt="Google Logo" className="w-5 h-5 mr-2" />
      {content}
    </button>
  );
};
