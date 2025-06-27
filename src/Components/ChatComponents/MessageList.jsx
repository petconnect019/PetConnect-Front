import { useEffect, useRef } from 'react';

// Componente MessageList mejorado con nombres de remitente
export const MessageList = ({ messages, currentUser }) => {
  const messagesEndRef = useRef(null);
  
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

  const groupedMessages = groupMessagesByDate(messages);

  // Función para obtener el nombre del remitente
  const getSenderName = (message) => {
    if (message.senderId === currentUser?.id) {
      return currentUser?.name || "Tú";
    }
    // Intentar obtener el nombre del remitente de diferentes propiedades posibles
    return message.senderName || 
           (message.senderId && typeof message.senderId === 'object' ? message.senderId.name : null) ||
           "Usuario";
  };

  // Componente para mensajes enviados (usuario actual)
  const SentMessage = ({ message, senderName }) => (
    <div className="flex w-full justify-end mb-1">
      <div className="relative max-w-[65%] min-w-[80px] bg-brand text-white px-2 py-[6px] rounded-lg ml-auto mr-2">
        <div className="text-[11px] font-medium mb-0.5 text-white">
          {senderName}
        </div>
        <p className="text-[14px] text-white whitespace-pre-wrap break-words pr-[52px] leading-[19px]">
          {message.content}
        </p>
        <div className="absolute bottom-[4px] right-2 flex items-center">
          <span className="text-[11px] text-gray-100 min-w-[55px] text-right">
            {new Date(message.timestamp).toLocaleTimeString([], { 
              hour: '2-digit', 
              minute: '2-digit',
              hour12: false
            })}
          </span>
          <svg className="w-[18px] h-[18px] text-white ml-0.5" viewBox="0 0 16 11" fill="currentColor">
            <path d="M11.1548 0.721314C10.9249 0.721314 10.7038 0.809804 10.5359 0.977803L4.06216 7.45155L1.46411 4.85351C1.12945 4.51884 0.585785 4.51884 0.251121 4.85351C-0.0837068 5.18817 -0.0837068 5.73184 0.251121 6.0665L3.45567 9.27105C3.62357 9.43895 3.84474 9.52744 4.06216 9.52744C4.27958 9.52744 4.50075 9.43895 4.66865 9.27105L11.7736 2.16608C12.1083 1.83142 12.1083 1.28775 11.7736 0.953083C11.6057 0.809804 11.3846 0.721314 11.1548 0.721314Z"/>
          </svg>
        </div>
        <div className="absolute top-0 right-[-8px] w-0 h-0 border-solid border-t-[8px] border-t-brand border-l-[8px] border-l-transparent">
        </div>
      </div>
    </div>
  );

  // Componente para mensajes recibidos
  const ReceivedMessage = ({ message, senderName }) => (
    <div className="flex w-full justify-start mb-1">
      <div className="relative max-w-[65%] min-w-[80px] bg-white px-2 py-[6px] rounded-lg ml-2 mr-auto">
        <div className="text-[11px] font-medium mb-0.5 text-[#1877F2]">
          {senderName}
        </div>
        <p className="text-[14px] text-[#111b21] whitespace-pre-wrap break-words pr-[52px] leading-[19px]">
          {message.content}
        </p>
        <div className="absolute bottom-[4px] right-2 flex items-center">
          <span className="text-[11px] text-[#667781] min-w-[55px] text-right">
            {new Date(message.timestamp).toLocaleTimeString([], { 
              hour: '2-digit', 
              minute: '2-digit',
              hour12: false
            })}
          </span>
        </div>
        <div className="absolute top-0 left-[-8px] w-0 h-0 border-solid border-t-[8px] border-t-white border-r-[8px] border-r-transparent">
        </div>
      </div>
    </div>
  );

  return (
    <div className="flex flex-col h-full overflow-y-auto bg-[#E4DDD6] p-3">
      {Object.entries(groupedMessages).map(([date, dateMessages]) => (
        <div key={date} className="space-y-1">
          <div className="flex justify-center mb-2">
            <div className="bg-[#E2F3FB] px-3 py-1 rounded-lg text-[11px] text-gray-600 shadow-sm">
              {date}
            </div>
          </div>
          
          {dateMessages.map((message, index) => {
            if (!message || !message.senderId) return null;
            const isCurrentUser = typeof message.senderId === 'object' 
              ? message.senderId._id === currentUser?.id
              : message.senderId === currentUser?.id;
            const senderName = getSenderName(message);
            
            return isCurrentUser ? 
              <SentMessage key={message._id || index} message={message} senderName={senderName} /> : 
              <ReceivedMessage key={message._id || index} message={message} senderName={senderName} />;
          })}
        </div>
      ))}
      <div ref={messagesEndRef} />
    </div>
  );
}; 