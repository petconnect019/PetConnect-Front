import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { NavButton } from '../../Components/NavButton/NavButton';
import { changePassword } from '../../Utils/Fetch/FetchChangePassword/FetchChangePassword';
import { FetchRefreshToken } from '../../Utils/Fetch/FetchRefreshToken/FetchRefreshToken';
import { isTokenExpired } from '../../Utils/Helpers/IsTokenExpired/IsTokenExpired';
import { PasswordField } from '../../Components/InputField/PasswordField';
import { ButtonPrimary } from '../../Components/Buttons/ButtonPrimary';

export const ChangePassword = () => {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [serverError, setServerError] = useState('');
  const { register, handleSubmit, formState: { errors }, watch } = useForm();

  const onSubmit = async (data) => {
    setIsLoading(true);
    setServerError('');

    try {
      // Verificamos si el token está expirado y lo refrescamos si es necesario
      if (isTokenExpired(localStorage.getItem('token'))) {
        try {
          await FetchRefreshToken();
        } catch (refreshError) {
          setServerError('Su sesión ha expirado. Por favor, inicie sesión nuevamente.');
          setIsLoading(false);
          return;
        }
      }

      await changePassword(data.currentPassword, data.newPassword);
      // Navegar a la página de perfil del usuario
      navigate('/home');
    } catch (error) {
      console.error('Error al cambiar la contraseña:', error);
      setServerError(error.message || 'Error al cambiar la contraseña. Por favor, intente nuevamente.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="max-w-md mx-auto mt-8 p-8 bg-white rounded-lg shadow-md">
      <NavButton onClick={() => navigate(-1)} />
      <h2 className="text-2xl font-semibold text-center text-gray-800 mb-6">
        Cambiar Contraseña
      </h2>
      {serverError && (
        <div className="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded">
          {serverError}
        </div>
      )}
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <PasswordField
          label="Contraseña Actual"
          name="currentPassword"
          register={register}
          validation={{
            required: 'La contraseña actual es requerida'
          }}
        />

        <PasswordField
          label="Nueva Contraseña"
          name="newPassword"
          register={register}
          validation={{
            required: 'La nueva contraseña es requerida',
            minLength: {
              value: 6,
              message: 'La contraseña debe tener al menos 6 caracteres'
            }
          }}
        />

        <PasswordField
          label="Confirmar Nueva Contraseña"
          name="confirmPassword"
          register={register}
          validation={{
            required: 'La confirmación de contraseña es requerida',
            validate: value => value === watch('newPassword') || 'Las contraseñas no coinciden'
          }}
        />

        <button
          type="submit"
          disabled={isLoading}
          className="block mx-auto w-full max-w-md bg-brand text-white py-3 xs:py-3.5 sm:py-4 md:py-4.5 lg:py-5 xl:py-5 2xl:py-5.5 3xl:py-6 4xl:py-6 rounded-full mt-5 text-sm xs:text-base sm:text-lg md:text-xl lg:text-2xl xl:text-2xl 2xl:text-3xl 3xl:text-3xl 4xl:text-4xl font-medium shadow-md disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isLoading ? 'Cambiando contraseña...' : 'Cambiar Contraseña'}
        </button>
      </form>
    </div>
  );
};
