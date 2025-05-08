import { useEffect, useRef } from 'react';
import defaultProfilePic from '../../assets/images/DefaultProfile.png';
import ChatMessage from './ChatMessage';

export const MessageList = ({ messages, currentUser }) => {
  const messagesEndRef = useRef(null);
  
  // Añadir console.log para depuración
  console.log("MessageList renderizado con:", { 
    messages: messages?.length || 0, 
    currentUser: currentUser?.id || 'no user',
    styles: 'WhatsApp style applied' 
  });

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // Agrupar mensajes por fecha
  const groupMessagesByDate = (messages) => {
    const groups = {};
    messages.forEach(message => {
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
    });
    return groups;
  };

  const groupedMessages = groupMessagesByDate(messages || []);

  // Función para obtener el nombre del remitente
  const getSenderName = (message) => {
    if (message.senderId === currentUser?.id) {
      return currentUser?.name || "Tú";
    }
    return message.senderName || 
           (message.senderId && message.senderId.name) || 
           "Usuario";
  };

  return (
    <div className="flex flex-col h-full overflow-y-auto bg-[#E4DDD6] p-3">
      {Object.entries(groupedMessages).map(([date, dateMessages]) => (
        <div key={date} className="space-y-1">
          {/* Separador de fecha */}
          <div className="flex justify-center mb-2">
            <div className="bg-[#E2F3FB] px-3 py-1 rounded-lg text-[11px] text-gray-600 shadow-sm">
              {date}
            </div>
          </div>
          
          {/* Mensajes */}
          {dateMessages.map((message, index) => {
            const isCurrentUser = message.senderId === currentUser?.id;
            const senderName = getSenderName(message);
            
            return (
              <ChatMessage
                key={message._id || index}
                message={message}
                isCurrentUser={isCurrentUser}
                senderName={senderName}
              />
            );
          })}
        </div>
      ))}
      <div ref={messagesEndRef} />
    </div>
  );
}; 