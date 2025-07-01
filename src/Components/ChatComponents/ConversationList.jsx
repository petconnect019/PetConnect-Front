import React from 'react';
import { IoChatbubble, IoTime, IoSearch } from 'react-icons/io5';
import defaultProfilePic from '../../assets/images/DefaultProfile.png';

  const formatTime = (timestamp) => {
    if (!timestamp) return '';
    const date = new Date(timestamp);
    const now = new Date();
  const diff = now.getTime() - date.getTime();
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    
    if (days === 0) {
    return date.toLocaleTimeString('es-ES', { hour: '2-digit', minute: '2-digit' });
    } else if (days === 1) {
      return 'Ayer';
    } else if (days < 7) {
    return date.toLocaleDateString('es-ES', { weekday: 'short' });
    } else {
    return date.toLocaleDateString('es-ES', { day: '2-digit', month: '2-digit' });
    }
  };

const ConversationItem = React.memo(({ conversation, isSelected, onSelect }) => {
  const lastMessageTime = conversation.lastMessage?.timestamp || conversation.updatedAt;
  const otherParticipant = conversation.otherParticipants?.[0];
  const displayName = conversation.title || otherParticipant?.name || 'Chat';
  const displayAvatar = otherParticipant?.profilePicture || defaultProfilePic;
  const unreadCount = conversation.unreadCount || 0;
          
          return (
            <div
      onClick={() => onSelect(conversation)}
              className={`
        flex items-center p-3 cursor-pointer transition-colors duration-150
        ${isSelected ? 'bg-orange-100' : 'hover:bg-gray-50'}
              `}
            >
              <div className="relative flex-shrink-0">
        <img
          src={displayAvatar}
          alt={displayName}
          className="w-12 h-12 rounded-full object-cover border-2 border-white shadow"
          onError={(e) => { e.target.src = defaultProfilePic; }}
                  />
        {unreadCount > 0 && (
          <span className="absolute top-0 right-0 block h-4 w-4 transform -translate-y-1/2 translate-x-1/2 rounded-full bg-red-500 text-white text-xs flex items-center justify-center font-bold">
            {unreadCount > 9 ? '9+' : unreadCount}
                    </span>
                )}
              </div>
      <div className="ml-3 flex-1 min-w-0">
        <div className="flex justify-between items-baseline">
          <p className={`font-semibold truncate ${unreadCount > 0 ? 'text-gray-900' : 'text-gray-800'}`}>
            {displayName}
          </p>
          <p className="text-xs text-gray-500 whitespace-nowrap ml-2">
                    {formatTime(lastMessageTime)}
          </p>
                </div>
        <p className={`text-sm truncate mt-1 ${unreadCount > 0 ? 'text-orange-700' : 'text-gray-600'}`}>
          {conversation.lastMessage?.content || 'Conversación iniciada'}
        </p>
              </div>
            </div>
          );
});

export const ConversationList = ({
  conversations = [],
  selectedConversationId,
  onSelectConversation,
}) => {
  if (conversations.length === 0) {
    return (
      <div className="flex-1 flex flex-col items-center justify-center p-6 text-center">
        <h3 className="text-lg font-semibold text-gray-700">No hay chats</h3>
        <p className="text-sm text-gray-500">Inicia una conversación para verla aquí.</p>
      </div>
    );
  }

  return (
    <div className="flex-1 overflow-y-auto">
      <div className="divide-y divide-gray-100">
        {conversations.map((conversation) => (
          <ConversationItem
            key={conversation._id}
            conversation={conversation}
            isSelected={conversation._id === selectedConversationId}
            onSelect={onSelectConversation}
          />
        ))}
      </div>
    </div>
  );
}; 

export default ConversationList; 