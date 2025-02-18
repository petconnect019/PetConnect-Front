import React from 'react';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';

// Esquema de validación con Yup
const schema = yup.object().shape({
  email: yup
    .string()
    .email('Correo electrónico inválido')
    .required('Este campo es obligatorio')
    .matches(/@dominio\.com$/|/@gmail\.com$/, 'El correo debe ser del dominio @dominio.com'),
    password: yup
    .string()
    .min(6, 'La contraseña debe tener al menos 6 caracteres')
    .matches(/[A-Z]/, 'La contraseña debe incluir al menos una letra mayúscula')
    .matches(/[a-z]/, 'La contraseña debe incluir al menos una letra minúscula')
    .matches(/[0-9]/, 'La contraseña debe incluir al menos un número')
    .required('Este campo es obligatorio'),
});

export const Register = () => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(schema),
  });

  const onSubmit = async (data) => {
    try {
      const response = await fetch('http://localhost:5000/api/auth/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });

      const result = await response.json();

      if (response.ok) {
        alert('Registro exitoso');
      } else {
        alert(`Error: ${result.message || 'No se pudo registrar'}`);
      }
    } catch (error) {
      alert('Error en la conexión con el servidor');
    }
  };


  // Función para manejar el registro con Google
  const handleGoogleSignUp = () => {
    console.log('Registrarse con Google');
    // Aquí iría la lógica para integrar Google OAuth
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 p-4">
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="w-full max-w-md bg-white p-8 rounded-lg shadow-md"
      >
        <h2 className="text-2xl font-bold mb-6 text-center">Regístrate</h2>

        {/* Campo de correo electrónico */}
        <div className="mb-4">
          <label htmlFor="email" className="block text-sm font-medium text-gray-700">
            Correo electrónico:
          </label>
          <input
            type="email"
            id="email"
            {...register('email')}
            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          {errors.email && (
            <span className="text-sm text-red-600">{errors.email.message}</span>
          )}
        </div>

        {/* Campo de contraseña */}
        <div className="mb-6">
          <label htmlFor="password" className="block text-sm font-medium text-gray-700">
            Contraseña:
          </label>
          <input
            type="password"
            id="password"
            {...register('password')}
            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          {errors.password && (
            <span className="text-sm text-red-600">{errors.password.message}</span>
          )}
        </div>

        {/* Botón de registro */}
        <button
          type="submit"
          className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          Registrarse
        </button>

        {/* Separador */}
        <div className="mt-6 flex items-center justify-center">
          <div className="w-full border-t border-gray-300"></div>
          <span className="px-2 text-gray-500">o</span>
          <div className="w-full border-t border-gray-300"></div>
        </div>

        {/* Botón de registro con Google */}
        <button
          type="button"
          onClick={handleGoogleSignUp}
          className="w-full mt-4 bg-red-600 text-white py-2 px-4 rounded-md hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 flex items-center justify-center"
        >
          <img
            src="https://www.google.com/favicon.ico"
            alt="Google Logo"
            className="w-5 h-5 mr-2"
          />
          Registrarse con Google
        </button>
      </form>
    </div>
  );
};