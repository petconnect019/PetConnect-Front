import React, { useState, useEffect } from 'react';
import { IoWifiOffOutline, IoCheckmarkCircle, IoCloudOfflineOutline } from 'react-icons/io5';

const ConnectionStatus = ({ connected, className = '' }) => {
  const [showStatus, setShowStatus] = useState(false);
  const [wasConnected, setWasConnected] = useState(connected);

  // Mostrar estado cuando cambia la conexión
  useEffect(() => {
    if (connected !== wasConnected) {
      setShowStatus(true);
      setWasConnected(connected);
      
      // Ocultar después de unos segundos si está conectado
      if (connected) {
        const timer = setTimeout(() => {
          setShowStatus(false);
        }, 3000);
        
        return () => clearTimeout(timer);
      }
    }
  }, [connected, wasConnected]);

  // No mostrar nada si nunca ha habido cambios y está conectado
  if (!showStatus && connected) {
    return null;
  }

  return (
    <div 
      className={`
        absolute top-2 left-1/2 transform -translate-x-1/2 z-50
        transition-all duration-300 ease-in-out
        ${showStatus || !connected ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-2'}
        ${className}
      `}
    >
      <div
        className={`
          flex items-center space-x-2 px-3 py-2 rounded-full shadow-lg text-sm font-medium
          ${connected 
            ? 'bg-green-100 text-green-800 border border-green-200' 
            : 'bg-red-100 text-red-800 border border-red-200'
          }
        `}
      >
        {connected ? (
          <>
            <IoCheckmarkCircle className="w-4 h-4" />
            <span>Conectado</span>
          </>
        ) : (
          <>
            <IoCloudOfflineOutline className="w-4 h-4" />
            <span>Sin conexión</span>
          </>
        )}
      </div>
    </div>
  );
};

export default ConnectionStatus; 