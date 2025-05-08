import { useEffect, useRef } from 'react';
import defaultProfilePic from '../../assets/images/DefaultProfile.png';

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

  // Componente para mensaje enviado
  const SentMessage = ({ message }) => (
    <div className="w-full flex justify-end mb-1 xs:mb-1.5 sm:mb-2 md:mb-2.5 lg:mb-3 xl:mb-3.5">
      <div className="relative max-w-[65%] min-w-[80px] xs:min-w-[90px] sm:min-w-[100px] md:min-w-[110px] lg:min-w-[120px] xl:min-w-[130px] bg-brand text-white px-2 xs:px-2.5 sm:px-3 md:px-3.5 lg:px-4 xl:px-4.5 py-[6px] xs:py-[8px] sm:py-[10px] md:py-[12px] lg:py-[14px] xl:py-[16px] rounded-lg">
        <p className="text-[14px] xs:text-[15px] sm:text-[16px] md:text-[17px] lg:text-[18px] xl:text-[19px] whitespace-pre-wrap break-words pr-[52px] leading-[19px] xs:leading-[20px] sm:leading-[21px] md:leading-[22px] lg:leading-[23px] xl:leading-[24px]">
          {message.content}
        </p>

        <div className="absolute bottom-[4px] xs:bottom-[5px] sm:bottom-[6px] md:bottom-[7px] lg:bottom-[8px] xl:bottom-[9px] right-2 xs:right-2.5 sm:right-3 md:right-3.5 lg:right-4 xl:right-4.5 flex items-center">
          <span className="text-[11px] xs:text-[12px] sm:text-[13px] md:text-[14px] lg:text-[15px] xl:text-[16px] text-gray-100 min-w-[55px] text-right">
            {new Date(message.timestamp).toLocaleTimeString([], { 
              hour: '2-digit', 
              minute: '2-digit',
              hour12: false
            })}
          </span>
          <svg className="w-[18px] h-[18px] xs:w-[20px] xs:h-[20px] sm:w-[22px] sm:h-[22px] md:w-[24px] md:h-[24px] lg:w-[26px] lg:h-[26px] xl:w-[28px] xl:h-[28px] text-white ml-0.5" viewBox="0 0 16 11" fill="currentColor">
            <path d="M11.1548 0.721314C10.9249 0.721314 10.7038 0.809804 10.5359 0.977803L4.06216 7.45155L1.46411 4.85351C1.12945 4.51884 0.585785 4.51884 0.251121 4.85351C-0.0837068 5.18817 -0.0837068 5.73184 0.251121 6.0665L3.45567 9.27105C3.62357 9.43895 3.84474 9.52744 4.06216 9.52744C4.27958 9.52744 4.50075 9.43895 4.66865 9.27105L11.7736 2.16608C12.1083 1.83142 12.1083 1.28775 11.7736 0.953083C11.6057 0.809804 11.3846 0.721314 11.1548 0.721314Z"/>
          </svg>
        </div>

        <div className="absolute top-0 right-[-8px] xs:right-[-9px] sm:right-[-10px] md:right-[-11px] lg:right-[-12px] xl:right-[-13px] w-0 h-0 border-solid border-t-[8px] xs:border-t-[9px] sm:border-t-[10px] md:border-t-[11px] lg:border-t-[12px] xl:border-t-[13px] border-t-brand border-l-[8px] xs:border-l-[9px] sm:border-l-[10px] md:border-l-[11px] lg:border-l-[12px] xl:border-l-[13px] border-l-transparent" />
      </div>
    </div>
  );

  // Componente para mensaje recibido
  const ReceivedMessage = ({ message }) => (
    <div className="w-full flex justify-start mb-1 xs:mb-1.5 sm:mb-2 md:mb-2.5 lg:mb-3 xl:mb-3.5">
      <div className="relative max-w-[65%] min-w-[80px] xs:min-w-[90px] sm:min-w-[100px] md:min-w-[110px] lg:min-w-[120px] xl:min-w-[130px] bg-white px-2 xs:px-2.5 sm:px-3 md:px-3.5 lg:px-4 xl:px-4.5 py-[6px] xs:py-[8px] sm:py-[10px] md:py-[12px] lg:py-[14px] xl:py-[16px] rounded-lg">
        <p className="text-[14px] xs:text-[15px] sm:text-[16px] md:text-[17px] lg:text-[18px] xl:text-[19px] text-[#111b21] whitespace-pre-wrap break-words pr-[52px] leading-[19px] xs:leading-[20px] sm:leading-[21px] md:leading-[22px] lg:leading-[23px] xl:leading-[24px]">
          {message.content}
        </p>

        <div className="absolute bottom-[4px] xs:bottom-[5px] sm:bottom-[6px] md:bottom-[7px] lg:bottom-[8px] xl:bottom-[9px] right-2 xs:right-2.5 sm:right-3 md:right-3.5 lg:right-4 xl:right-4.5 flex items-center">
          <span className="text-[11px] xs:text-[12px] sm:text-[13px] md:text-[14px] lg:text-[15px] xl:text-[16px] text-[#667781] min-w-[55px] text-right">
            {new Date(message.timestamp).toLocaleTimeString([], { 
              hour: '2-digit', 
              minute: '2-digit',
              hour12: false
            })}
          </span>
        </div>

        <div className="absolute top-0 left-[-8px] xs:left-[-9px] sm:left-[-10px] md:left-[-11px] lg:left-[-12px] xl:left-[-13px] w-0 h-0 border-solid border-t-[8px] xs:border-t-[9px] sm:border-t-[10px] md:border-t-[11px] lg:border-t-[12px] xl:border-t-[13px] border-t-white border-r-[8px] xs:border-r-[9px] sm:border-r-[10px] md:border-r-[11px] lg:border-r-[12px] xl:border-r-[13px] border-r-transparent" />
      </div>
    </div>
  );

  return (
    <div className="flex flex-col h-full overflow-y-auto bg-[#E4DDD6] p-2 xs:p-2.5 sm:p-3 md:p-3.5 lg:p-4 xl:p-4.5">
      {Object.entries(groupedMessages).map(([date, dateMessages]) => (
        <div key={date} className="space-y-1 xs:space-y-1.5 sm:space-y-2 md:space-y-2.5 lg:space-y-3 xl:space-y-3.5">
          {/* Separador de fecha */}
          <div className="flex justify-center mb-2 xs:mb-2.5 sm:mb-3 md:mb-3.5 lg:mb-4 xl:mb-4.5">
            <div className="bg-[#E2F3FB] px-2 xs:px-2.5 sm:px-3 md:px-3.5 lg:px-4 xl:px-4.5 py-1 xs:py-1.5 sm:py-2 md:py-2.5 lg:py-3 xl:py-3.5 rounded-lg text-[11px] xs:text-[12px] sm:text-[13px] md:text-[14px] lg:text-[15px] xl:text-[16px] text-gray-600 shadow-sm">
              {date}
            </div>
          </div>
          
          {/* Mensajes */}
          {dateMessages.map((message, index) => {
            const isCurrentUser = message.senderId === currentUser?.id;
            return isCurrentUser ? (
              <SentMessage key={message._id || index} message={message} />
            ) : (
              <ReceivedMessage key={message._id || index} message={message} />
            );
          })}
        </div>
      ))}
      <div ref={messagesEndRef} />
    </div>
  );
}; 