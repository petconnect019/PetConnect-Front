import React, { memo } from 'react';
import { IoCloudOffline, IoRefresh, IoCheckmarkCircle, IoWarning } from 'react-icons/io5';

/**
 * Componente optimizado para mostrar el estado de conexión
 */
const ConnectionStatus = memo(({ 
  connected, 
  error, 
  onRetry, 
  compact = false 
}) => {
  // No mostrar nada si está conectado y no hay error
  if (connected && !error) {
    return compact ? null : (
      <div className="flex items-center text-green-600 text-xs">
        <IoCheckmarkCircle className="w-3 h-3 mr-1" />
        <span>Conectado</span>
      </div>
    );
  }

  // Mostrar error o estado de desconexión
  const getStatusInfo = () => {
    if (error) {
      return {
        icon: IoWarning,
        color: 'text-amber-600',
        bgColor: 'bg-amber-50',
        message: error
      };
    }
    
    if (!connected) {
      return {
        icon: IoCloudOffline,
        color: 'text-red-600',
        bgColor: 'bg-red-50',
        message: 'Sin conexión'
      };
    }
  };

  const statusInfo = getStatusInfo();
  
  if (!statusInfo) return null;

  const { icon: Icon, color, bgColor, message } = statusInfo;

  if (compact) {
    return (
      <div className={`absolute top-2 left-2 z-10 flex items-center px-2 py-1 rounded-full ${bgColor}`}>
        <Icon className={`w-3 h-3 ${color}`} />
        <span className={`text-xs ml-1 ${color}`}>{message}</span>
        {onRetry && (
          <button
            onClick={onRetry}
            className={`ml-2 p-1 rounded-full hover:bg-white/20 transition-colors ${color}`}
            title="Reintentar conexión"
            aria-label="Reintentar conexión"
          >
            <IoRefresh className="w-3 h-3" />
          </button>
        )}
      </div>
    );
  }

  return (
    <div className={`flex items-center justify-between px-4 py-2 ${bgColor} border-l-4 border-${color.split('-')[1]}-500`}>
      <div className="flex items-center">
        <Icon className={`w-4 h-4 ${color} mr-2`} />
        <span className={`text-sm font-medium ${color}`}>{message}</span>
      </div>
      {onRetry && (
        <button
          onClick={onRetry}
          className={`ml-2 px-3 py-1 text-xs font-medium ${color} hover:bg-white/20 rounded-md transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2`}
          aria-label="Reintentar conexión"
        >
          <IoRefresh className="w-3 h-3 mr-1 inline" />
          Reintentar
        </button>
      )}
    </div>
  );
});

ConnectionStatus.displayName = 'ConnectionStatus';

export default ConnectionStatus; 