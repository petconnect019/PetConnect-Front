import React, { useEffect, useRef } from 'react';
import { IoCheckmark, IoCheckmarkDone } from 'react-icons/io5';

// Componente MessageList mejorado con nombres de remitente
export const MessageList = ({ 
  messages = [], 
  currentUser, 
  loading = false,
  chatId 
}) => {
  const messagesEndRef = useRef(null);
  const messagesContainerRef = useRef(null);
  
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // Agrupar mensajes por fecha
  const groupMessagesByDate = (messages) => {
    const groups = {};
    (messages || []).forEach(message => {
      if (!message || !message.timestamp) return;
      
      try {
        const date = new Date(message.timestamp);
        const dateStr = date.toLocaleDateString('es-ES', {
          weekday: 'long',
          year: 'numeric',
          month: 'long',
          day: 'numeric'
        });
        
        if (!groups[dateStr]) {
          groups[dateStr] = [];
        }
        groups[dateStr].push(message);
      } catch (error) {
        console.warn('Error al procesar fecha del mensaje:', error);
      }
    });
    return groups;
  };

  const groupedMessages = groupMessagesByDate(messages);

  // Función para obtener el nombre del remitente
  const getSenderName = (message) => {
    if (!message || !message.senderId) return "Usuario";
    
    // Si es el usuario actual
    if (message.senderId === currentUser?.id || 
        message.senderId === currentUser?._id) {
      return "Tú";
    }
    
    // Intentar obtener el nombre del remitente de diferentes propiedades posibles
    return message.senderName || 
           message.sender?.name ||
           (message.senderId && typeof message.senderId === 'object' ? message.senderId.name : null) ||
           "Usuario";
  };

  // Función para determinar si es el usuario actual
  const isCurrentUser = (message) => {
    if (!message || !message.senderId || !currentUser) return false;
    
    const senderId = typeof message.senderId === 'object' 
      ? message.senderId._id || message.senderId.id
      : message.senderId;
      
    return senderId === currentUser.id || senderId === currentUser._id;
  };

  // Componente para mensajes enviados (usuario actual)
  const SentMessage = ({ message, senderName }) => (
    <div className="flex w-full justify-end mb-3">
      <div className="relative max-w-[75%] min-w-[100px] bg-blue-500 text-white px-4 py-2 rounded-lg ml-auto mr-2 shadow-sm">
        <div className="text-xs font-medium mb-1 text-blue-100">
          {senderName}
        </div>
        <p className="text-sm text-white whitespace-pre-wrap break-words pr-14 leading-relaxed">
          {message.content}
        </p>
        <div className="absolute bottom-2 right-3 flex items-center space-x-1">
          <span className="text-xs text-blue-100">
            {formatTime(message.timestamp)}
          </span>
          {/* Indicador de entrega/lectura */}
          <div className="text-blue-100">
            {message.read ? (
              <IoCheckmarkDone className="w-4 h-4" />
            ) : (
              <IoCheckmark className="w-4 h-4" />
            )}
          </div>
        </div>
        {/* Flecha del globo */}
        <div className="absolute top-4 right-[-8px] w-0 h-0 border-solid border-t-[8px] border-t-blue-500 border-l-[8px] border-l-transparent">
        </div>
      </div>
    </div>
  );

  // Componente para mensajes recibidos
  const ReceivedMessage = ({ message, senderName }) => (
    <div className="flex w-full justify-start mb-3">
      <div className="relative max-w-[75%] min-w-[100px] bg-white px-4 py-2 rounded-lg ml-2 mr-auto shadow-sm border border-gray-200">
        <div className="text-xs font-medium mb-1 text-blue-600">
          {senderName}
        </div>
        <p className="text-sm text-gray-800 whitespace-pre-wrap break-words pr-14 leading-relaxed">
          {message.content}
        </p>
        <div className="absolute bottom-2 right-3">
          <span className="text-xs text-gray-500">
            {formatTime(message.timestamp)}
          </span>
        </div>
        {/* Flecha del globo */}
        <div className="absolute top-4 left-[-8px] w-0 h-0 border-solid border-t-[8px] border-t-white border-r-[8px] border-r-transparent">
        </div>
      </div>
    </div>
  );

  // Función para formatear tiempo
  const formatTime = (timestamp) => {
    if (!timestamp) return '';
    
    try {
      const date = new Date(timestamp);
      return date.toLocaleTimeString('es-ES', { 
        hour: '2-digit', 
        minute: '2-digit',
        hour12: false
      });
    } catch (error) {
      return '';
    }
  };

  // Loading state
  if (loading && messages.length === 0) {
    return (
      <div className="flex flex-col h-full overflow-y-auto bg-gray-50 p-4">
        <div className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <div className="w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
            <p className="text-gray-600 text-sm">Cargando mensajes...</p>
          </div>
        </div>
      </div>
    );
  }

  // Empty state
  if (!messages || messages.length === 0) {
    return (
      <div className="flex flex-col h-full overflow-y-auto bg-gray-50 p-4">
        <div className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <div className="w-16 h-16 bg-gray-200 rounded-full flex items-center justify-center mb-4">
              <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
              </svg>
            </div>
            <h3 className="text-lg font-semibold text-gray-800 mb-2">Inicia la conversación</h3>
            <p className="text-gray-500 text-sm max-w-xs">
              Envía un mensaje para comenzar esta conversación
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div 
      ref={messagesContainerRef}
      className="flex flex-col h-full overflow-y-auto bg-gray-50 p-3 scroll-smooth"
    >
      {Object.entries(groupedMessages).map(([date, dateMessages]) => (
        <div key={date} className="space-y-1">
          {/* Separador de fecha */}
          <div className="flex justify-center my-4">
            <div className="bg-white px-4 py-2 rounded-full text-xs text-gray-600 shadow-sm border border-gray-200">
              {date}
            </div>
          </div>
          
          {/* Mensajes del día */}
          {dateMessages.map((message, index) => {
            if (!message || !message.senderId) {
              console.warn('Mensaje inválido:', message);
              return null;
            }
            
            const isCurrentUserMessage = isCurrentUser(message);
            const senderName = getSenderName(message);
            
            return isCurrentUserMessage ? 
              <SentMessage 
                key={message._id || `${chatId}-${index}`} 
                message={message} 
                senderName={senderName} 
              /> : 
              <ReceivedMessage 
                key={message._id || `${chatId}-${index}`} 
                message={message} 
                senderName={senderName} 
              />;
          })}
        </div>
      ))}
      
      {/* Marcador para scroll automático */}
      <div ref={messagesEndRef} />
      
      {/* Indicador de carga al final */}
      {loading && messages.length > 0 && (
        <div className="text-center py-2">
          <div className="w-6 h-6 border-2 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto"></div>
        </div>
      )}
    </div>
  );
};

export default MessageList; 