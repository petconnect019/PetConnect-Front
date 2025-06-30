import React, { useState, useEffect } from 'react';
import { IoWifi, IoWifiOutline, IoCloudOffline, IoSync } from 'react-icons/io5';

const ConnectionStatus = ({ 
  connected = false, 
  reconnecting = false,
  error = null,
  showLabel = false,
  compact = false,
  onRetry = null 
}) => {
  const [showStatus, setShowStatus] = useState(false);
  const [lastConnectionTime, setLastConnectionTime] = useState(null);

  // Mostrar estado solo cuando hay cambios importantes
  useEffect(() => {
    if (!connected || reconnecting || error) {
      setShowStatus(true);
    } else {
      setLastConnectionTime(new Date());
      // Ocultar después de unos segundos si está conectado
      const timer = setTimeout(() => {
        setShowStatus(false);
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [connected, reconnecting, error]);

  // Determinar el estado actual
  const getStatus = () => {
    if (reconnecting) {
      return {
        type: 'reconnecting',
        icon: IoSync,
        color: 'text-yellow-500',
        bgColor: 'bg-yellow-50',
        borderColor: 'border-yellow-200',
        label: 'Reconectando...',
        animate: true,
        showIndicator: true
      };
    }
    
    if (error) {
      return {
        type: 'error',
        icon: IoCloudOffline,
        color: 'text-red-500',
        bgColor: 'bg-red-50',
        borderColor: 'border-red-200',
        label: error || 'Error de conexión',
        animate: false,
        showIndicator: true
      };
    }
    
    if (!connected) {
      return {
        type: 'disconnected',
        icon: IoWifiOutline,
        color: 'text-gray-500',
        bgColor: 'bg-gray-50',
        borderColor: 'border-gray-200',
        label: 'Sin conexión',
        animate: false,
        showIndicator: true
      };
    }
    
    return {
      type: 'connected',
      icon: IoWifi,
      color: 'text-green-500',
      bgColor: 'bg-green-50',
      borderColor: 'border-green-200',
      label: 'Conectado',
      animate: false,
      showIndicator: connected
    };
  };

  const status = getStatus();

  // Versión compacta - solo el indicador
  if (compact) {
    return (
      <div className="flex items-center">
        <div 
          className={`w-2 h-2 rounded-full ${
            connected ? 'bg-green-500' : 'bg-red-500'
          } ${status.animate ? 'animate-pulse' : ''}`}
          title={status.label}
        />
      </div>
    );
  }

  // No mostrar si está conectado y no se fuerza mostrar
  if (!showStatus && connected && !showLabel) {
    return null;
  }

  const StatusIcon = status.icon;

  return (
    <div className={`
      flex items-center space-x-2 px-3 py-2 rounded-lg border transition-all duration-300
      ${status.bgColor} ${status.borderColor}
      ${showStatus ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-2'}
    `}>
      {/* Icono de estado */}
      <div className="flex-shrink-0">
        <StatusIcon 
          className={`w-4 h-4 ${status.color} ${
            status.animate ? 'animate-spin' : ''
          }`} 
        />
      </div>

      {/* Etiqueta de estado */}
      {(showLabel || status.showIndicator) && (
        <span className={`text-xs font-medium ${status.color}`}>
          {status.label}
        </span>
      )}

      {/* Botón de reintentar */}
      {(status.type === 'error' || status.type === 'disconnected') && onRetry && (
        <button
          onClick={onRetry}
          className={`
            text-xs px-2 py-1 rounded hover:bg-opacity-20 transition-colors
            ${status.color} hover:bg-current
          `}
          title="Reintentar conexión"
        >
          Reintentar
        </button>
      )}

      {/* Información adicional */}
      {lastConnectionTime && connected && showLabel && (
        <span className="text-xs text-gray-400">
          {lastConnectionTime.toLocaleTimeString()}
        </span>
      )}
    </div>
  );
};

export default ConnectionStatus; 