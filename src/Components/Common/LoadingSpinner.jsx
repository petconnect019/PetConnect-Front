import React from 'react';

const LoadingSpinner = ({ 
  size = 'medium', 
  message = '', 
  className = '',
  color = 'primary'
}) => {
  // Definir tamaños
  const sizes = {
    small: 'w-4 h-4',
    medium: 'w-8 h-8',
    large: 'w-12 h-12',
    xlarge: 'w-16 h-16'
  };

  // Definir colores
  const colors = {
    primary: 'border-blue-500',
    secondary: 'border-gray-500',
    white: 'border-white',
    orange: 'border-orange-500'
  };

  return (
    <div className={`flex flex-col items-center justify-center ${className}`}>
      <div
        className={`
          ${sizes[size]} 
          border-4 
          ${colors[color]} 
          border-t-transparent 
          rounded-full 
          animate-spin
        `}
        role="status"
        aria-label="Cargando"
      />
      {message && (
        <p className="mt-3 text-sm text-gray-600 text-center max-w-xs">
          {message}
        </p>
      )}
    </div>
  );
};

export default LoadingSpinner; 