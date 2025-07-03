import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { NavButton } from '../../Components/NavButton/NavButton';
import { changePassword } from '../../Utils/Fetch/FetchChangePassword/FetchChangePassword';
import { FetchRefreshToken } from '../../Utils/Fetch/FetchRefreshToken/FetchRefreshToken';
import { isTokenExpired } from '../../Utils/Helpers/IsTokenExpired/IsTokenExpired';
import { PasswordField } from '../../Components/InputField/PasswordField';
import { ButtonPrimary } from '../../Components/Buttons/ButtonPrimary';
import { ModalSpinner } from '../../Components/ModalBasic/ModalSpinnerAll';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

export const ChangePassword = () => {
  const navigate = useNavigate();
  const { register, handleSubmit, formState: { errors }, watch } = useForm();
  const { handleChangePassword, isLoading, error, isSuccess } = useFetchChangePassword();

  const onSubmit = async (data) => {
    if (data.newPassword !== data.confirmPassword) {
      toast.error("Las contraseñas no coinciden");
      return;
    }
    await handleChangePassword(data);
  };

  useEffect(() => {
    if (isSuccess) {
      toast.success("Contraseña actualizada con éxito");
      setTimeout(() => navigate('/settings'), 2000);
    }
    if (error) {
      toast.error(error);
    }
  }, [isSuccess, error, navigate]);

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center p-4">
      <ToastContainer />
      <div className="w-full max-w-md">
        <div className="flex items-center justify-between mb-8">
          <NavButton onClick={() => navigate(-1)} />
          <h1 className="text-xl font-bold text-gray-800">Cambiar Contraseña</h1>
          <div className="w-10"></div> {/* Spacer */}
        </div>
        
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          <PasswordField
            label="Contraseña Actual"
            name="currentPassword"
            register={register}
            validation={{ required: "La contraseña actual es obligatoria" }}
            placeholder="Introduce tu contraseña actual"
          />
          <PasswordField
            label="Nueva Contraseña"
            name="newPassword"
            register={register}
            validation={{ 
              required: "La nueva contraseña es obligatoria",
              minLength: { value: 8, message: "Mínimo 8 caracteres" }
            }}
            placeholder="Introduce tu nueva contraseña"
          />
          <PasswordField
            label="Confirmar Nueva Contraseña"
            name="confirmPassword"
            register={register}
            validation={{ required: "Confirma tu nueva contraseña" }}
            placeholder="Confirma tu nueva contraseña"
          />
          <ButtonPrimary text="Actualizar Contraseña" type="submit" disabled={isLoading} />
        </form>
      </div>
    </div>
  );
};