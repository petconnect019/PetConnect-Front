import React from 'react';
import { IoClose, IoAlertCircle, IoWarning, IoInformationCircle, IoCheckmarkCircle } from 'react-icons/io5';

const ErrorMessage = ({ 
  message, 
  type = 'error', 
  onClose, 
  className = '',
  autoClose = false,
  duration = 5000
}) => {
  // Auto cerrar después del tiempo especificado
  React.useEffect(() => {
    if (autoClose && onClose) {
      const timer = setTimeout(() => {
        onClose();
      }, duration);
      
      return () => clearTimeout(timer);
    }
  }, [autoClose, duration, onClose]);

  // Configuración por tipo de mensaje
  const typeConfig = {
    error: {
      bgColor: 'bg-red-50',
      borderColor: 'border-red-200',
      textColor: 'text-red-800',
      iconColor: 'text-red-400',
      icon: IoAlertCircle
    },
    warning: {
      bgColor: 'bg-yellow-50',
      borderColor: 'border-yellow-200',
      textColor: 'text-yellow-800',
      iconColor: 'text-yellow-400',
      icon: IoWarning
    },
    info: {
      bgColor: 'bg-blue-50',
      borderColor: 'border-blue-200',
      textColor: 'text-blue-800',
      iconColor: 'text-blue-400',
      icon: IoInformationCircle
    },
    success: {
      bgColor: 'bg-green-50',
      borderColor: 'border-green-200',
      textColor: 'text-green-800',
      iconColor: 'text-green-400',
      icon: IoCheckmarkCircle
    }
  };

  const config = typeConfig[type] || typeConfig.error;
  const IconComponent = config.icon;

  return (
    <div
      className={`
        ${config.bgColor} 
        ${config.borderColor} 
        border 
        rounded-lg 
        p-4 
        mx-4 
        my-2
        ${className}
      `}
      role="alert"
    >
      <div className="flex items-start">
        <div className="flex-shrink-0">
          <IconComponent 
            className={`w-5 h-5 ${config.iconColor}`} 
            aria-hidden="true" 
          />
        </div>
        
        <div className="ml-3 flex-1">
          <p className={`text-sm font-medium ${config.textColor}`}>
            {message}
          </p>
        </div>
        
        {onClose && (
          <div className="ml-auto pl-3">
            <div className="-mx-1.5 -my-1.5">
              <button
                type="button"
                className={`
                  inline-flex 
                  rounded-md 
                  p-1.5 
                  ${config.textColor} 
                  hover:bg-opacity-20 
                  hover:bg-current
                  focus:outline-none 
                  focus:ring-2 
                  focus:ring-offset-2 
                  focus:ring-offset-transparent
                  focus:ring-current
                  transition-colors
                `}
                onClick={onClose}
                aria-label="Cerrar mensaje"
              >
                <IoClose className="w-5 h-5" aria-hidden="true" />
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ErrorMessage; 