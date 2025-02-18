import React from 'react';
import { GoogleOAuthProvider, GoogleLogin } from '@react-oauth/google';
import jwt_decode from 'jwt-decode'; // Para decodificar el token JWT

export const GoogleSignIn = () => {
  const handleSuccess = (credentialResponse) => {
    const decodedToken = jwt_decode(credentialResponse.credential);
    console.log('Usuario autenticado:', decodedToken);

    // Aquí puedes enviar los datos del usuario a tu backend para registrar o iniciar sesión
    const userData = {
      name: decodedToken.name,
      email: decodedToken.email,
      picture: decodedToken.picture,
    };
    console.log('Datos del usuario:', userData);
  };

  const handleError = () => {
    console.log('Error en el inicio de sesión con Google');
  };

  return (
    <GoogleOAuthProvider clientId="TU_CLIENT_ID_DE_GOOGLE">
      <GoogleLogin
        onSuccess={handleSuccess}
        onError={handleError}
      />
    </GoogleOAuthProvider>
  );
};

