import React, { useEffect, useRef } from 'react';
import { useAuth } from '../../Contexts/AuthContext/AuthContext';
import LoadingSpinner from '../Common/LoadingSpinner';
  
const MessageItem = React.memo(({ message, isCurrentUser }) => {
  const formatTime = (timestamp) => {
    if (!timestamp) return '';
    return new Date(timestamp).toLocaleTimeString('es-ES', { hour: '2-digit', minute: '2-digit' });
  };

  const bubbleClasses = isCurrentUser
    ? 'bg-orange-500 text-white rounded-br-none'
    : 'bg-gray-200 text-gray-800 rounded-bl-none';

  const wrapperClasses = isCurrentUser ? 'justify-end' : 'justify-start';

  return (
    <div className={`flex ${wrapperClasses} mb-4`}>
      <div className={`px-4 py-3 rounded-lg max-w-xs lg:max-w-md ${bubbleClasses}`}>
        <p className="text-sm">{message.content}</p>
        <p className="text-xs text-right mt-1 opacity-70">{formatTime(message.timestamp)}</p>
      </div>
    </div>
  );
});

const groupMessagesByDate = (messages) => {
  return messages.reduce((acc, message) => {
    const date = new Date(message.timestamp).toLocaleDateString('es-ES', {
      year: 'numeric', month: 'long', day: 'numeric'
    });
    if (!acc[date]) {
      acc[date] = [];
    }
    acc[date].push(message);
    return acc;
  }, {});
};

const MessageList = ({ isLoading, messages = [] }) => {
  const { user } = useAuth();
  const messagesEndRef = useRef(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  if (isLoading) {
    return <LoadingSpinner message="Cargando mensajes..." />;
  }

  if (!messages.length) {
    return (
      <div className="flex-1 flex items-center justify-center text-center">
        <div>
          <h3 className="text-lg font-semibold text-gray-700">Chat Vacío</h3>
          <p className="text-sm text-gray-500">Sé el primero en enviar un mensaje.</p>
      </div>
    </div>
  );
  }
  
  const groupedMessages = groupMessagesByDate(messages);

  return (
    <div className="flex-1 overflow-y-auto p-6">
      {Object.entries(groupedMessages).map(([date, msgs]) => (
        <React.Fragment key={date}>
          <div className="text-center my-4">
            <span className="text-xs text-gray-500 bg-gray-100 px-3 py-1 rounded-full">{date}</span>
          </div>
          {msgs.map(message => (
            <MessageItem
              key={message._id}
              message={message}
              isCurrentUser={message.senderId === user?.id}
            />
          ))}
        </React.Fragment>
      ))}
      <div ref={messagesEndRef} />
    </div>
  );
}; 

export default MessageList; 