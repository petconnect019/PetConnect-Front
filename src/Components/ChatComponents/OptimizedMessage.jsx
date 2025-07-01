import React, { memo } from 'react';
import MessageStatus from './MessageStatus';

/**
 * Componente de mensaje individual optimizado
 * Maneja mensajes optimistas y estados de envío
 */
const OptimizedMessage = memo(({ message, currentUser, isLast }) => {
  const isOwn = message.senderId?._id === currentUser?.id || message.senderId?._id === currentUser?._id;
  
  // Clases dinámicas para el estado del mensaje
  const getMessageClasses = () => {
    let baseClasses = `
      max-w-xs lg:max-w-md px-4 py-2 rounded-lg break-words
      ${isOwn 
        ? 'bg-blue-500 text-white ml-auto' 
        : 'bg-white text-gray-800 border border-gray-200'
      }
    `;

    // Agregar estilos para mensajes optimistas
    if (message.isOptimistic || message.sending) {
      baseClasses += ' opacity-70';
    }

    // Agregar estilos para mensajes fallidos
    if (message.failed) {
      baseClasses += ' opacity-50 border-red-300';
      if (isOwn) {
        baseClasses = baseClasses.replace('bg-blue-500', 'bg-red-500');
      }
    }

    return baseClasses;
  };

  // Formatear timestamp
  const formatTime = (timestamp) => {
    if (!timestamp) return '';
    
    const date = new Date(timestamp);
    return date.toLocaleTimeString('es-ES', {
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  // Manejar reintento de envío (si el mensaje falló)
  const handleRetry = () => {
    if (message.failed && window.retryMessage) {
      const chatId = message.chatId || window.location.pathname.split('/chat/')[1];
      window.retryMessage(chatId, message.content, message._id, {
        messageType: message.messageType || 'text',
        attachments: message.attachments,
        location: message.location
      });
    }
  };

  return (
    <div className={`flex ${isOwn ? 'justify-end' : 'justify-start'} mb-2`}>
      <div className="flex flex-col space-y-1 max-w-full">
        <div className={getMessageClasses()}>
          {/* Nombre del remitente (solo para mensajes de otros) */}
          {!isOwn && (
            <div className="text-xs font-medium text-gray-600 mb-1">
              {message.senderId?.name || 'Usuario'}
            </div>
          )}
          
          {/* Contenido del mensaje */}
          <div className="text-sm whitespace-pre-wrap">
            {message.content}
          </div>
          
          {/* Adjuntos (si los hay) */}
          {message.attachments && message.attachments.length > 0 && (
            <div className="mt-2 space-y-1">
              {message.attachments.map((attachment, index) => (
                <div key={index} className="text-xs opacity-75">
                  📎 {attachment.name || 'Archivo adjunto'}
                </div>
              ))}
            </div>
          )}
          
          {/* Ubicación (si la hay) */}
          {message.location && (
            <div className="mt-2 text-xs opacity-75">
              📍 Ubicación compartida
            </div>
          )}
        </div>
        
        {/* Estado y timestamp */}
        <div className={`flex items-center space-x-2 text-xs ${isOwn ? 'justify-end' : 'justify-start'}`}>
          <span className="text-gray-500">
            {formatTime(message.timestamp)}
          </span>
          
          {/* Estado del mensaje (solo para mensajes propios) */}
          <MessageStatus message={message} isOwn={isOwn} />
          
          {/* Botón de reintento para mensajes fallidos */}
          {message.failed && isOwn && (
            <button
              onClick={handleRetry}
              className="text-red-500 hover:text-red-700 transition-colors"
              title="Reintentar envío"
            >
              ↻
            </button>
          )}
        </div>
      </div>
    </div>
  );
});

OptimizedMessage.displayName = 'OptimizedMessage';

export default OptimizedMessage; 