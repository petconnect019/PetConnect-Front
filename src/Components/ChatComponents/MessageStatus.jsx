import React, { memo } from 'react';
import { IoCheckmark, IoCheckmarkDone, IoTime, IoAlertCircle } from 'react-icons/io5';

/**
 * Componente para mostrar el estado visual de los mensajes
 * Maneja estados: enviando, enviado, entregado, fallido
 */
const MessageStatus = memo(({ message, isOwn }) => {
  if (!isOwn) return null; // Solo mostrar estado en mensajes propios

  // Mensaje fallido
  if (message.failed) {
    return (
      <div className="flex items-center space-x-1 text-red-500" title="Error al enviar">
        <IoAlertCircle className="w-3 h-3" />
        <span className="text-xs">Error</span>
      </div>
    );
  }

  // Mensaje enviando
  if (message.sending || message.isOptimistic) {
    return (
      <div className="flex items-center space-x-1 text-gray-400" title="Enviando...">
        <IoTime className="w-3 h-3 animate-pulse" />
        <span className="text-xs">Enviando</span>
      </div>
    );
  }

  // Mensaje entregado (leído por otros)
  if (message.readBy && message.readBy.length > 1) {
    return (
      <div className="flex items-center space-x-1 text-blue-500" title="Leído">
        <IoCheckmarkDone className="w-3 h-3" />
        <span className="text-xs">Leído</span>
      </div>
    );
  }

  // Mensaje enviado
  return (
    <div className="flex items-center space-x-1 text-gray-500" title="Enviado">
      <IoCheckmark className="w-3 h-3" />
      <span className="text-xs">Enviado</span>
    </div>
  );
});

MessageStatus.displayName = 'MessageStatus';

export default MessageStatus; 