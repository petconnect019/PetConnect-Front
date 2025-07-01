import React, { memo } from 'react';
import { IoClose, IoWarning, IoInformation, IoAlert } from 'react-icons/io5';

/**
 * Componente de mensaje de error optimizado
 */
const ErrorMessage = memo(({ 
  message, 
  onClose, 
  type = 'error',
  dismissible = true 
}) => {
  if (!message) return null;

  const getTypeStyles = () => {
    switch (type) {
      case 'warning':
        return {
          icon: IoWarning,
          bgColor: 'bg-yellow-50',
          borderColor: 'border-yellow-200',
          textColor: 'text-yellow-800',
          iconColor: 'text-yellow-400'
        };
      case 'info':
        return {
          icon: IoInformation,
          bgColor: 'bg-blue-50',
          borderColor: 'border-blue-200',
          textColor: 'text-blue-800',
          iconColor: 'text-blue-400'
        };
      case 'error':
      default:
        return {
          icon: IoAlert,
          bgColor: 'bg-red-50',
          borderColor: 'border-red-200',
          textColor: 'text-red-800',
          iconColor: 'text-red-400'
        };
    }
  };

  const { icon: Icon, bgColor, borderColor, textColor, iconColor } = getTypeStyles();

  return (
    <div className={`${bgColor} border ${borderColor} rounded-lg p-4 mx-4 my-2`}>
      <div className="flex items-start">
        <div className="flex-shrink-0">
          <Icon className={`w-5 h-5 ${iconColor}`} />
        </div>
        <div className="ml-3 flex-1">
          <p className={`text-sm font-medium ${textColor}`}>{message}</p>
        </div>
        {dismissible && onClose && (
          <button
            onClick={onClose}
            className={`ml-auto ${textColor} hover:${textColor.replace('800', '600')} transition-colors focus:outline-none`}
            aria-label="Cerrar mensaje"
          >
            <IoClose className="w-4 h-4" />
          </button>
        )}
      </div>
    </div>
  );
});

ErrorMessage.displayName = 'ErrorMessage';

export default ErrorMessage; 