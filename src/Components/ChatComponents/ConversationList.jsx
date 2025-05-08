import { useState, useEffect } from 'react';
import { fetchGetConversations } from '../../Utils/Fetch/FetchChat/FetchChat';
import { useAuth } from '../../Contexts/AuthContext/AuthContext';
import { IoChatbubble, IoTime } from 'react-icons/io5';
import { IoSearch } from 'react-icons/io5';
import defaultProfilePic from '../../assets/images/DefaultProfile.png';
import socket from '../../Utils/Socket/Socket';

export const ConversationList = ({ onSelectConversation, selectedChat, searchQuery }) => {
  const [conversations, setConversations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { isAuthenticated } = useAuth();

  const loadConversations = async () => {
    if (!isAuthenticated) return;
    
    try {
      setLoading(true);
      setError(null);
      const data = await fetchGetConversations();
      setConversations(data);
    } catch (err) {
      console.error('Error al cargar conversaciones:', err);
      setError('Error al cargar las conversaciones. Por favor, intenta de nuevo más tarde.');
    } finally {
      setLoading(false);
    }
  };

  // Exponer la función de actualización globalmente
  useEffect(() => {
    window.updateConversationList = loadConversations;
    return () => {
      delete window.updateConversationList;
    };
  }, []);

  useEffect(() => {
    if (isAuthenticated) {
      loadConversations();
      
      // Suscribirse a eventos de socket para actualizaciones en tiempo real
      const handleNewMessage = () => {
        loadConversations();
      };
      
      socket.on('new_message', handleNewMessage);
      socket.on('chat_request', handleNewMessage);
      
      return () => {
        socket.off('new_message', handleNewMessage);
        socket.off('chat_request', handleNewMessage);
      };
    }
  }, [isAuthenticated]);

  const filteredConversations = conversations.filter(conversation => 
    conversation.otherUser?.name?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  if (loading) {
    return (
      <div className="h-full flex flex-col items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-2 border-blue-500 border-t-transparent"></div>
        <p className="mt-4 text-sm text-gray-600">Cargando conversaciones...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="h-full flex flex-col items-center justify-center p-4">
        <div className="text-red-500 mb-4">
          <svg className="w-12 h-12" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        </div>
        <p className="text-center text-gray-600 text-sm mb-4">{error}</p>
        <button 
          onClick={loadConversations} 
          className="px-4 py-2 bg-blue-500 text-white text-sm rounded-full hover:bg-blue-600 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
        >
          Reintentar
        </button>
      </div>
    );
  }

  if (conversations.length === 0) {
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

  if (filteredConversations.length === 0) {
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

  const formatTime = (timestamp) => {
    if (!timestamp) return '';
    const date = new Date(timestamp);
    const now = new Date();
    const diff = now - date;
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    
    if (days === 0) {
      return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    } else if (days === 1) {
      return 'Ayer';
    } else if (days < 7) {
      return date.toLocaleDateString([], { weekday: 'long' });
    } else {
      return date.toLocaleDateString([], { day: '2-digit', month: 'short' });
    }
  };

  return (
    <div className="h-full overflow-y-auto bg-white">
      <div className="divide-y divide-gray-200">
        {filteredConversations.map((conversation) => {
          const isSelected = selectedChat && selectedChat._id === conversation._id;
          const lastMessageTime = conversation.lastMessage?.timestamp || conversation.createdAt;
          
          return (
            <div
              key={conversation._id}
              onClick={() => onSelectConversation(conversation)}
              className={`
                flex items-center p-4 cursor-pointer transition-all
                ${isSelected ? 'bg-blue-50' : 'hover:bg-gray-50'}
                ${conversation.unreadCount > 0 ? 'bg-blue-50/20' : ''}
              `}
            >
              {/* Avatar */}
              <div className="relative flex-shrink-0">
                <div className="w-12 h-12 rounded-full overflow-hidden border-2 border-gray-200">
                  <img 
                    src={conversation.otherUser?.profilePicture || defaultProfilePic}
                    alt={conversation.otherUser?.name || 'Usuario'}
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      e.target.src = defaultProfilePic;
                    }}
                  />
                </div>
                {conversation.unreadCount > 0 && (
                  <div className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 rounded-full flex items-center justify-center">
                    <span className="text-xs text-white font-medium">
                      {conversation.unreadCount}
                    </span>
                  </div>
                )}
              </div>

              {/* Información del chat */}
              <div className="ml-4 flex-1 min-w-0">
                <div className="flex justify-between items-start">
                  <h3 className="font-semibold text-gray-900 truncate">
                    {conversation.otherUser?.name || 'Usuario'}
                  </h3>
                  <span className="text-xs text-gray-500 whitespace-nowrap ml-2">
                    {formatTime(lastMessageTime)}
                  </span>
                </div>
                
                <div className="mt-1 flex items-center justify-between">
                  <p className="text-sm text-gray-600 truncate pr-4">
                    {conversation.lastMessage?.content || 'No hay mensajes'}
                  </p>
                  {conversation.petName && (
                    <span className="text-xs bg-orange-100 text-orange-800 px-2 py-1 rounded-full">
                      {conversation.petName}
                    </span>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};