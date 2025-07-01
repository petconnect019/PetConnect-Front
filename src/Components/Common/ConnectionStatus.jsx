import React from 'react';

const ConnectionStatus = ({ connectionState }) => {
  const getStatusDetails = () => {
    switch (connectionState) {
      case 'connected':
        return {
          text: 'Conectado',
          color: 'bg-green-500',
          title: 'Conexión con el chat establecida.',
        };
      case 'connecting':
        return {
          text: 'Conectando...',
          color: 'bg-yellow-500 animate-pulse',
          title: 'Intentando conectar con el servidor de chat...',
        };
      case 'disconnected':
        return {
          text: 'Sin conexión',
          color: 'bg-red-500',
          title: 'No hay conexión con el servidor de chat.',
        };
      default:
        return {
          text: 'Desconocido',
          color: 'bg-gray-400',
          title: 'Estado de la conexión desconocido.',
        };
    }
  };

  const { text, color, title } = getStatusDetails();

  return (
    <div className="flex items-center space-x-2" title={title}>
      <div className={`w-2.5 h-2.5 rounded-full ${color}`}></div>
      <span className="text-xs text-gray-600">{text}</span>
    </div>
  );
};

export default ConnectionStatus; 