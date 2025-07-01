import React, { memo, useMemo } from 'react';
import { IoChatbubble, IoTime, IoSearch } from 'react-icons/io5';
import defaultProfilePic from '../../assets/images/DefaultProfile.png';

// Componente individual de conversación optimizado
const ConversationItem = memo(({ 
  conversation, 
  isSelected, 
  onSelectConversation 
}) => {
  const lastMessageTime = conversation.lastMessage?.timestamp || conversation.updatedAt || conversation.createdAt;
  const otherParticipant = conversation.otherParticipants?.[0];
  const displayName = conversation.title || otherParticipant?.name || 'Usuario';
  const displayAvatar = otherParticipant?.profilePicture || defaultProfilePic;

  // Formatear tiempo de manera optimizada
  const formattedTime = useMemo(() => {
    if (!lastMessageTime) return '';
    
    try {
      const date = new Date(lastMessageTime);
      const now = new Date();
      const diff = now - date;
      const days = Math.floor(diff / (1000 * 60 * 60 * 24));
      
      if (days === 0) {
        return date.toLocaleTimeString('es-ES', { 
          hour: '2-digit', 
          minute: '2-digit' 
        });
      } else if (days === 1) {
        return 'Ayer';
      } else if (days < 7) {
        return date.toLocaleDateString('es-ES', { weekday: 'long' });
      } else {
        return date.toLocaleDateString('es-ES', { 
          day: '2-digit', 
          month: 'short' 
        });
      }
    } catch (error) {
      return '';
    }
  }, [lastMessageTime]);

  const handleClick = () => {
    onSelectConversation(conversation);
  };

  const handleImageError = (e) => {
    e.target.src = defaultProfilePic;
  };

  return (
    <div
      onClick={handleClick}
      className={`
        flex items-center p-4 cursor-pointer transition-all duration-200
        ${isSelected ? 'bg-blue-50 border-r-4 border-blue-500' : 'hover:bg-gray-50'}
        ${conversation.unreadCount > 0 ? 'bg-blue-50/30' : ''}
      `}
    >
      {/* Avatar */}
      <div className="relative flex-shrink-0">
        <div className="w-12 h-12 rounded-full overflow-hidden border-2 border-gray-200">
          <img 
            src={displayAvatar}
            alt={displayName}
            className="w-full h-full object-cover"
            onError={handleImageError}
            loading="lazy"
          />
        </div>
        {conversation.unreadCount > 0 && (
          <div className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 rounded-full flex items-center justify-center">
            <span className="text-xs text-white font-medium">
              {conversation.unreadCount > 99 ? '99+' : conversation.unreadCount}
            </span>
          </div>
        )}
      </div>

      {/* Información del chat */}
      <div className="ml-4 flex-1 min-w-0">
        <div className="flex justify-between items-start">
          <h3 className={`font-semibold truncate ${
            conversation.unreadCount > 0 ? 'text-gray-900' : 'text-gray-700'
          }`}>
            {displayName}
          </h3>
          <span className="text-xs text-gray-500 whitespace-nowrap ml-2">
            {formattedTime}
          </span>
        </div>
        
        <div className="mt-1 flex items-center justify-between">
          <p className={`text-sm truncate pr-4 ${
            conversation.unreadCount > 0 ? 'text-gray-800 font-medium' : 'text-gray-600'
          }`}>
            {conversation.lastMessage?.content || 'Conversación iniciada'}
          </p>
          {conversation.petName && (
            <span className="text-xs bg-orange-100 text-orange-800 px-2 py-1 rounded-full whitespace-nowrap">
              {conversation.petName}
            </span>
          )}
        </div>
      </div>
    </div>
  );
});

ConversationItem.displayName = 'ConversationItem';

// Componente principal optimizado
export const ConversationList = memo(({ 
  conversations = [], 
  selectedChat, 
  searchQuery = '', 
  onSelectConversation, 
  loading = false 
}) => {
  // Filtrar conversaciones de manera optimizada
  const filteredConversations = useMemo(() => {
    if (!searchQuery) return conversations;
    
    const searchTerm = searchQuery.toLowerCase();
    
    return conversations.filter(conversation => {
      const otherParticipants = conversation.otherParticipants || [];
      
      return (
        // Buscar en nombres de participantes
        otherParticipants.some(participant => 
          participant.name?.toLowerCase().includes(searchTerm)
        ) ||
        // Buscar en título del chat
        conversation.title?.toLowerCase().includes(searchTerm) ||
        // Buscar en nombre de mascota
        conversation.petName?.toLowerCase().includes(searchTerm) ||
        // Buscar en último mensaje
        conversation.lastMessage?.content?.toLowerCase().includes(searchTerm)
      );
    });
  }, [conversations, searchQuery]);

  // Loading state
  if (loading) {
    return (
      <div className="h-full flex flex-col items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-2 border-blue-500 border-t-transparent"></div>
        <p className="mt-4 text-sm text-gray-600">Cargando conversaciones...</p>
      </div>
    );
  }

  // Empty state - sin conversaciones
  if (!conversations || conversations.length === 0) {
    return (
      <div className="h-full flex flex-col items-center justify-center p-6">
        <div className="bg-blue-50 p-4 rounded-full mb-4">
          <IoChatbubble className="text-3xl text-blue-500" />
        </div>
        <h3 className="text-lg font-semibold text-gray-800 mb-2">
          Sin conversaciones
        </h3>
        <p className="text-gray-500 text-center text-sm max-w-[200px]">
          Inicia una conversación con el dueño de una mascota
        </p>
      </div>
    );
  }

  // Empty state - sin resultados de búsqueda
  if (filteredConversations.length === 0 && searchQuery) {
    return (
      <div className="h-full flex flex-col items-center justify-center p-6">
        <div className="text-gray-400 mb-4">
          <IoSearch className="w-10 h-10" />
        </div>
        <p className="text-gray-600 text-center text-sm">
          No se encontraron conversaciones que coincidan con "{searchQuery}"
        </p>
      </div>
    );
  }

  return (
    <div className="h-full overflow-y-auto bg-white">
      <div className="divide-y divide-gray-200">
        {filteredConversations.map((conversation) => (
          <ConversationItem
            key={conversation._id}
            conversation={conversation}
            isSelected={selectedChat && selectedChat._id === conversation._id}
            onSelectConversation={onSelectConversation}
          />
        ))}
      </div>
    </div>
  );
});

ConversationList.displayName = 'ConversationList';

export default ConversationList; 