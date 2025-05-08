import React from 'react';

const ChatMessage = ({ message, isCurrentUser, senderName }) => {
  return (
    <div className={`flex w-full ${isCurrentUser ? 'justify-end' : 'justify-start'} mb-1`}>
      <div 
        className={`relative max-w-[65%] min-w-[80px] px-4 py-2 rounded-lg ${
          isCurrentUser 
            ? 'bg-brand text-white rounded-br-none ml-auto mr-2' 
            : 'bg-white text-gray-800 rounded-bl-none ml-2 mr-auto'
        }`}
      >
        {/* Nombre del remitente */}
        <div className={`text-[11px] font-medium mb-0.5 ${isCurrentUser ? 'text-white' : 'text-[#1877F2]'}`}>
          {senderName}
        </div>

        {/* Contenido del mensaje */}
        <p className={`text-[14px] whitespace-pre-wrap break-words pr-[52px] leading-[19px] ${
          isCurrentUser ? 'text-white' : 'text-[#111b21]'
        }`}>
          {message.content}
        </p>

        {/* Hora del mensaje */}
        <div className="absolute bottom-[4px] right-2 flex items-center">
          <span className={`text-[11px] min-w-[55px] text-right ${
            isCurrentUser ? 'text-gray-100' : 'text-[#667781]'
          }`}>
            {new Date(message.timestamp).toLocaleTimeString([], { 
              hour: '2-digit', 
              minute: '2-digit',
              hour12: false
            })}
          </span>
          {isCurrentUser && (
            <svg className="w-[18px] h-[18px] text-white ml-0.5" viewBox="0 0 16 11" fill="currentColor">
              <path d="M11.1548 0.721314C10.9249 0.721314 10.7038 0.809804 10.5359 0.977803L4.06216 7.45155L1.46411 4.85351C1.12945 4.51884 0.585785 4.51884 0.251121 4.85351C-0.0837068 5.18817 -0.0837068 5.73184 0.251121 6.0665L3.45567 9.27105C3.62357 9.43895 3.84474 9.52744 4.06216 9.52744C4.27958 9.52744 4.50075 9.43895 4.66865 9.27105L11.7736 2.16608C12.1083 1.83142 12.1083 1.28775 11.7736 0.953083C11.6057 0.809804 11.3846 0.721314 11.1548 0.721314Z"/>
            </svg>
          )}
        </div>

        {/* Triángulo decorativo */}
        <div className={`absolute top-0 ${
          isCurrentUser 
            ? 'right-[-8px] border-t-brand border-l-transparent border-t-[8px] border-l-[8px]' 
            : 'left-[-8px] border-t-white border-r-transparent border-t-[8px] border-r-[8px]'
        }`} />
      </div>
    </div>
  );
};

export default ChatMessage; 