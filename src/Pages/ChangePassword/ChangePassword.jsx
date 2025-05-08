import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { NavButton } from '../../Components/NavButton/NavButton';
import { changePassword } from '../../Utils/Fetch/FetchChangePassword/FetchChangePassword';
import { FetchRefreshToken } from '../../Utils/Fetch/FetchRefreshToken/FetchRefreshToken';
import { isTokenExpired } from '../../Utils/Helpers/IsTokenExpired/IsTokenExpired';
import { PasswordField } from '../../Components/InputField/PasswordField';
import { ButtonPrimary } from '../../Components/Buttons/ButtonPrimary';
import { ModalSpinner } from '../../Components/ModalBasic/ModalSpinnerAll';

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

      // Agregamos un timeout mínimo de 2 segundos
      const startTime = Date.now();
      await changePassword(data.currentPassword, data.newPassword);
      const elapsedTime = Date.now() - startTime;
      const remainingTime = Math.max(0, 1000 - elapsedTime);
      
      if (remainingTime > 0) {
        await new Promise(resolve => setTimeout(resolve, remainingTime));
      }

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
    <div className="flex flex-col items-center justify-between min-h-screen w-full">
      <div className='w-screen space-y-2 xs:space-y-3 sm:space-y-4 md:space-y-5 lg:space-y-6 xl:space-y-7 2xl:space-y-8 px-4 xs:px-6 sm:px-8 md:px-10 lg:px-12 xl:px-14 2xl:px-16'>
        <NavButton onClick={() => navigate(-1)} />
        <div className="p-4 xs:p-6 sm:p-8 md:p-10 lg:p-12 xl:p-14 2xl:p-16">
          <h2 className="text-xl xs:text-2xl sm:text-3xl md:text-4xl lg:text-5xl xl:text-6xl 2xl:text-7xl 3xl:text-8xl 4xl:text-9xl font-semibold text-center text-gray-800 mb-4 xs:mb-5 sm:mb-6 md:mb-7 lg:mb-8 xl:mb-9 2xl:mb-10 3xl:mb-11 4xl:mb-12">
            Cambiar Contraseña
          </h2>
          {serverError && (
            <div className="mb-3 xs:mb-4 sm:mb-5 md:mb-6 lg:mb-7 xl:mb-8 2xl:mb-9 3xl:mb-10 4xl:mb-11 p-2 xs:p-2.5 sm:p-3 md:p-3.5 lg:p-4 xl:p-4.5 2xl:p-5 3xl:p-5.5 4xl:p-6 bg-red-100 border border-red-400 text-red-700 rounded text-sm xs:text-base sm:text-lg md:text-xl lg:text-2xl xl:text-3xl 2xl:text-4xl 3xl:text-5xl 4xl:text-6xl">
              {serverError}
            </div>
          )}
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-3 xs:space-y-4 sm:space-y-5 md:space-y-6 lg:space-y-7 xl:space-y-8 2xl:space-y-9 3xl:space-y-10 4xl:space-y-11">
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
          </form>
        </div>
      </div>
      <div className="w-full px-4 xs:px-6 sm:px-8 md:px-10 lg:px-12 xl:px-14 2xl:px-16 pb-4 xs:pb-6 sm:pb-8 md:pb-10 lg:pb-12 xl:pb-14 2xl:pb-16">
        <button
          type="submit"
          disabled={isLoading}
          onClick={handleSubmit(onSubmit)}
          className="block mx-auto w-full max-w-[280px] xs:max-w-[320px] sm:max-w-[360px] md:max-w-[400px] lg:max-w-[440px] xl:max-w-[480px] 2xl:max-w-[520px] 3xl:max-w-[560px] 4xl:max-w-[600px] bg-brand text-white py-2.5 xs:py-3 sm:py-3.5 md:py-4 lg:py-4.5 xl:py-5 2xl:py-5.5 3xl:py-6 4xl:py-6.5 rounded-full text-sm xs:text-base sm:text-lg md:text-xl lg:text-2xl xl:text-3xl 2xl:text-4xl 3xl:text-5xl 4xl:text-6xl font-medium shadow-md disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isLoading ? 'Cambiando contraseña...' : 'Cambiar Contraseña'}
        </button>
      </div>
      {isLoading && (
        <ModalSpinner title={'Cambiando Contraseña'}  text={'Se esta guardando los cambios..'}/>
         
      )}
    </div>
  );
};