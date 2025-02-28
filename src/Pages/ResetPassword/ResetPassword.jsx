import React from 'react';
import { useLocation } from 'react-router-dom';
import { useResetPassword } from '../../Contexts/ResetPasswordContext/ResetPasswordContext';
import { useNavigate } from 'react-router-dom';

export const ResetPassword = () => {
    const { setTokenValue } = useResetPassword();
    const navigate = useNavigate();

  // Obtiene la ubicación actual de la URL
  const location = useLocation();
  // Crea una instancia de URLSearchParams a partir de la query string
  const queryParams = new URLSearchParams(location.search);
  // Extrae el valor del parámetro "token"
  const token = queryParams.get('token');
  setTokenValue(token);
  navigate("/change-password");

  return (
    <>
    </>
  );
};
