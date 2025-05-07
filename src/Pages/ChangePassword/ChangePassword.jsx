import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { NavButton } from '../../Components/NavButton/NavButton';
import { changePassword } from '../../Utils/Fetch/FetchChangePassword/FetchChangePassword';

export const ChangePassword = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });
  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [serverError, setServerError] = useState('');

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
    // Limpiar errores cuando el usuario comienza a escribir
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
    setServerError('');
  };

  const validateForm = () => {
    const newErrors = {};
    if (!formData.currentPassword) {
      newErrors.currentPassword = 'La contraseña actual es requerida';
    }
    if (!formData.newPassword) {
      newErrors.newPassword = 'La nueva contraseña es requerida';
    } else if (formData.newPassword.length < 6) {
      newErrors.newPassword = 'La contraseña debe tener al menos 6 caracteres';
    }
    if (formData.newPassword !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Las contraseñas no coinciden';
    }
    return newErrors;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const validationErrors = validateForm();
    
    if (Object.keys(validationErrors).length === 0) {
      setIsLoading(true);
      setServerError('');
      
      try {
        await changePassword(formData.currentPassword, formData.newPassword);
        navigate('/profile');
      } catch (error) {
        console.error('Error al cambiar la contraseña:', error);
        setServerError(error.message);
      } finally {
        setIsLoading(false);
      }
    } else {
      setErrors(validationErrors);
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
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="space-y-2">
          <label htmlFor="currentPassword" className="block text-sm font-medium text-gray-700">
            Contraseña Actual
          </label>
          <input
            type="password"
            id="currentPassword"
            name="currentPassword"
            value={formData.currentPassword}
            onChange={handleChange}
            className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
              errors.currentPassword ? 'border-red-500' : 'border-gray-300'
            }`}
          />
          {errors.currentPassword && (
            <span className="text-sm text-red-500">{errors.currentPassword}</span>
          )}
        </div>

        <div className="space-y-2">
          <label htmlFor="newPassword" className="block text-sm font-medium text-gray-700">
            Nueva Contraseña
          </label>
          <input
            type="password"
            id="newPassword"
            name="newPassword"
            value={formData.newPassword}
            onChange={handleChange}
            className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
              errors.newPassword ? 'border-red-500' : 'border-gray-300'
            }`}
          />
          {errors.newPassword && (
            <span className="text-sm text-red-500">{errors.newPassword}</span>
          )}
        </div>

        <div className="space-y-2">
          <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700">
            Confirmar Nueva Contraseña
          </label>
          <input
            type="password"
            id="confirmPassword"
            name="confirmPassword"
            value={formData.confirmPassword}
            onChange={handleChange}
            className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
              errors.confirmPassword ? 'border-red-500' : 'border-gray-300'
            }`}
          />
          {errors.confirmPassword && (
            <span className="text-sm text-red-500">{errors.confirmPassword}</span>
          )}
        </div>

        <button
          type="submit"
          disabled={isLoading}
          className={`w-full py-2 px-4 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-md transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 ${
            isLoading ? 'opacity-50 cursor-not-allowed' : ''
          }`}
        >
          {isLoading ? 'Cambiando contraseña...' : 'Cambiar Contraseña'}
        </button>
      </form>
    </div>
  );
};
