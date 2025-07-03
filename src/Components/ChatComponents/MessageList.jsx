import React, { useEffect, useRef, memo, useMemo } from 'react';
import { IoCheckmark, IoCheckmarkDone, IoTime, IoChatbubble } from 'react-icons/io5';

// Componente individual de mensaje optimizado
const MessageItem = memo(({ message, isOwnMessage, senderName }) => {
  const messageTime = useMemo(() => {
    if (!message.timestamp) return '';
    
    try {
      const date = new Date(message.timestamp);
      return date.toLocaleTimeString('es-ES', { 
        hour: '2-digit', 
        minute: '2-digit',
        hour12: false
      });
    } catch (error) {
      return '';
    }
  }, [message.timestamp]);

  const getStatusIcon = () => {
    if (!isOwnMessage) return null;
    
    if (message.read) {
      return <IoCheckmarkDone className="w-4 h-4 text-blue-100" />;
    } else if (message.delivered) {
      return <IoCheckmarkDone className="w-4 h-4 text-blue-200" />;
    } else if (message.sent) {
      return <IoCheckmark className="w-4 h-4 text-blue-200" />;
    }
    return <IoTime className="w-4 h-4 text-blue-200" />;
  };

  if (isOwnMessage) {
    return (
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
              {messageTime}
            </span>
            {getStatusIcon()}
          </div>
          {/* Flecha del globo */}
          <div className="absolute top-4 right-[-8px] w-0 h-0 border-solid border-t-[8px] border-t-blue-500 border-l-[8px] border-l-transparent">
          </div>
        </div>
      </div>
    );
  }

  return (
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
            {messageTime}
          </span>
        </div>
        {/* Flecha del globo */}
        <div className="absolute top-4 left-[-8px] w-0 h-0 border-solid border-t-[8px] border-t-white border-r-[8px] border-r-transparent">
        </div>
      </div>
    </div>
  );
});

MessageItem.displayName = 'MessageItem';

// Separador de fecha optimizado
const DateSeparator = memo(({ date }) => (
  <div className="flex justify-center my-4">
    <div className="bg-white px-4 py-2 rounded-full text-xs text-gray-600 shadow-sm border border-gray-200">
      {date}
    </div>
  </div>
));

DateSeparator.displayName = 'DateSeparator';

// Componente MessageList mejorado con nombres de remitente
export const MessageList = memo(({ 
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

  // Agrupar mensajes por fecha optimizado
  const groupedMessages = useMemo(() => {
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
  }, [messages]);

  // Función para obtener el nombre del remitente optimizada
  const getSenderName = useMemo(() => {
    return (message) => {
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
  }, [currentUser]);

  // Función para determinar si es el usuario actual optimizada
  const isCurrentUserMessage = useMemo(() => {
    return (message) => {
      if (!message || !message.senderId || !currentUser) return false;
      
      const senderId = typeof message.senderId === 'object' 
        ? message.senderId._id || message.senderId.id
        : message.senderId;
        
      return senderId === currentUser.id || senderId === currentUser._id;
    };
  }, [currentUser]);

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
              <IoChatbubble className="w-8 h-8 text-gray-400" />
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
          <DateSeparator date={date} />
          
          {/* Mensajes del día */}
          {dateMessages.map((message, index) => {
            if (!message || !message.senderId) {
              console.warn('Mensaje inválido:', message);
              return null;
            }

            const isOwnMessage = isCurrentUserMessage(message);
            const senderName = getSenderName(message);

            return (
              <MessageItem
                key={message._id || `${message.timestamp}-${index}`}
                message={message}
                isOwnMessage={isOwnMessage}
                senderName={senderName}
              />
            );
          })}
        </div>
      ))}
      
      {/* Referencia para scroll automático */}
      <div ref={messagesEndRef} />
    </div>
  );
});

MessageList.displayName = 'MessageList';

export default MessageList; 