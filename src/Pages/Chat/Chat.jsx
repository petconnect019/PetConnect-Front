import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { IoArrowBack, IoEllipsisVertical, IoSearch, IoClose, IoWifiOffOutline, IoCheckmark } from 'react-icons/io5';

// Contexto y componentes
import { useAuth } from '../../Contexts/AuthContext/AuthContext';
import { useChat } from '../../Contexts/ChatContext/ChatContext';
import { ConversationList } from '../../Components/ChatComponents/ConversationList';
import { MessageList } from '../../Components/ChatComponents/MessageList';
import { MessageInput } from '../../Components/ChatComponents/MessageInput';
import { FooterNav } from '../../Components/FooterNav/FooterNav';

// Componentes auxiliares
import LoadingSpinner from '../../Components/Common/LoadingSpinner';
import ErrorMessage from '../../Components/Common/ErrorMessage';
import ConnectionStatus from '../../Components/Common/ConnectionStatus';

export const Chat = () => {
  const navigate = useNavigate();
  const { chat_id } = useParams();
  const { isAuthenticated, user } = useAuth();
  const {
    // Estado
    conversations,
    activeChat,
    messages,
    loading,
    error,
    connected,
    searchQuery,
    unreadCount,
    showSidebar,
    
    // Acciones
    loadConversations,
    loadMessages,
    sendMessage,
    selectChat,
    closeChat,
    searchConversations,
    clearError
  } = useChat();

  // Estado local para UI
  const [showSearchBar, setShowSearchBar] = useState(false);
  const [localSearchQuery, setLocalSearchQuery] = useState('');
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);

  // Redirigir si no está autenticado
  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/login');
    }
  }, [isAuthenticated, navigate]);

  // Cargar conversaciones al montar
  useEffect(() => {
    if (isAuthenticated) {
      loadConversations();
    }
  }, [isAuthenticated, loadConversations]);

  // Manejar chat_id en la URL
  useEffect(() => {
    if (chat_id && conversations.length > 0) {
      const chat = conversations.find(c => c._id === chat_id);
      if (chat) {
        selectChat(chat);
      } else {
        // Chat no encontrado, redirigir a lista
        navigate('/chat');
      }
    } else if (!chat_id && activeChat) {
      // No hay chat_id pero hay chat activo, limpiar
      closeChat();
    }
  }, [chat_id, conversations, activeChat, selectChat, closeChat, navigate]);

  // Detectar cambios de tamaño de pantalla
  useEffect(() => {
    const handleResize = () => {
      const mobile = window.innerWidth < 768;
      setIsMobile(mobile);
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Manejar selección de conversación
  const handleSelectConversation = (conversation) => {
    selectChat(conversation);
    navigate(`/chat/${conversation._id}`);
  };

  // Manejar volver a la lista
  const handleBackToList = () => {
    closeChat();
    navigate('/chat');
  };

  // Manejar búsqueda
  const handleSearchChange = (e) => {
    const query = e.target.value;
    setLocalSearchQuery(query);
    
    // Debounce la búsqueda
    clearTimeout(window.searchTimeout);
    window.searchTimeout = setTimeout(() => {
      searchConversations(query);
    }, 300);
  };

  // Limpiar búsqueda
  const handleClearSearch = () => {
    setLocalSearchQuery('');
    setShowSearchBar(false);
    searchConversations('');
  };

  // Manejar envío de mensaje
  const handleSendMessage = async (content, options = {}) => {
    if (!activeChat) return;
    
    try {
      await sendMessage(activeChat._id, content, options);
    } catch (error) {
      console.error('Error al enviar mensaje:', error);
    }
  };

  // Componente de encabezado
  const Header = () => (
    <header className="flex items-center justify-between px-4 py-3 bg-white border-b border-gray-200 h-16 shrink-0 relative">
      {/* Estado de conexión */}
      <ConnectionStatus connected={connected} />
      
      {(!showSidebar && activeChat) ? (
        // Header del chat activo
        <div className="flex items-center flex-1">
          <button 
            className="md:hidden -ml-2 p-2 rounded-full hover:bg-gray-100 transition-colors"
            onClick={handleBackToList}
          >
            <IoArrowBack className="w-5 h-5 text-gray-600" />
          </button>
          
          <div className="ml-2 flex-1 min-w-0">
            <h1 className="text-lg font-semibold text-gray-800 truncate">
              {activeChat.title || activeChat.otherParticipants?.[0]?.name || 'Chat'}
            </h1>
            {activeChat.petName && (
              <p className="text-sm text-gray-500 truncate">
                Sobre {activeChat.petName}
              </p>
            )}
          </div>
          
          <button className="p-2 rounded-full hover:bg-gray-100 transition-colors">
            <IoEllipsisVertical className="w-5 h-5 text-gray-600" />
          </button>
        </div>
      ) : (
        // Header de la lista de conversaciones
        <div className="flex items-center justify-between w-full">
          <div className="flex items-center">
            <h1 className="text-lg font-semibold text-gray-800">
              Mensajes
              {unreadCount > 0 && (
                <span className="ml-2 inline-flex items-center justify-center w-6 h-6 text-xs font-medium text-white bg-red-500 rounded-full">
                  {unreadCount > 99 ? '99+' : unreadCount}
                </span>
              )}
            </h1>
          </div>
          
          <div className="flex items-center space-x-2">
            {showSearchBar ? (
              <div className="flex items-center bg-gray-100 rounded-full px-3 py-2 flex-1 max-w-xs">
                <IoSearch className="w-4 h-4 text-gray-400 mr-2" />
                <input
                  type="text"
                  placeholder="Buscar chats..."
                  value={localSearchQuery}
                  onChange={handleSearchChange}
                  className="bg-transparent flex-1 text-sm focus:outline-none"
                  autoFocus
                />
                <button
                  onClick={handleClearSearch}
                  className="ml-2 p-1 hover:bg-gray-200 rounded-full transition-colors"
                >
                  <IoClose className="w-4 h-4 text-gray-500" />
                </button>
              </div>
            ) : (
              <button
                onClick={() => setShowSearchBar(true)}
                className="p-2 rounded-full hover:bg-gray-100 transition-colors"
                title="Buscar chats"
              >
                <IoSearch className="w-5 h-5 text-gray-600" />
              </button>
            )}
          </div>
        </div>
      )}
    </header>
  );

  // Componente de estado vacío
  const EmptyState = () => (
    <div className="flex-1 flex flex-col items-center justify-center p-8 text-center">
      <div className="w-20 h-20 mb-4 bg-gray-100 rounded-full flex items-center justify-center">
        <IoSearch className="w-10 h-10 text-gray-400" />
      </div>
      <h3 className="text-xl font-semibold text-gray-700 mb-2">
        {isMobile ? 'Selecciona un chat' : 'Bienvenido a tus mensajes'}
      </h3>
      <p className="text-gray-500 max-w-md">
        {isMobile 
          ? 'Elige una conversación de la lista para comenzar a chatear'
          : 'Selecciona una conversación existente o inicia una nueva para comenzar a comunicarte'
        }
      </p>
    </div>
  );

  // Mostrar loading o error si no está autenticado
  if (!isAuthenticated) {
    return (
      <div className="fixed inset-0 flex items-center justify-center bg-gray-50">
        <LoadingSpinner size="large" message="Verificando autenticación..." />
      </div>
    );
  }

  return (
    <div className="fixed inset-0 flex flex-col bg-gray-50">
      {/* Header */}
      <Header />

      {/* Error Message */}
      {error && (
        <ErrorMessage 
          message={error} 
          onClose={clearError}
          type="warning"
        />
      )}

      {/* Main Container */}
      <div className="flex flex-1 overflow-hidden pb-16">
        {/* Sidebar - Lista de Conversaciones */}
        <div 
          className={`
            ${showSidebar || !activeChat ? 'translate-x-0' : '-translate-x-full'}
            ${isMobile ? 'w-full absolute inset-y-0 left-0 z-20' : 'w-80 relative'}
            bg-white border-r border-gray-200 transition-transform duration-300 ease-in-out
          `}
        >
          {loading && !conversations.length ? (
            <div className="flex items-center justify-center h-full">
              <LoadingSpinner message="Cargando conversaciones..." />
            </div>
          ) : (
            <ConversationList 
              conversations={conversations}
              selectedChat={activeChat}
              searchQuery={searchQuery}
              onSelectConversation={handleSelectConversation}
              loading={loading}
            />
          )}
        </div>

        {/* Chat Area */}
        <div 
          className={`
            flex-1 flex flex-col bg-gray-50
            ${(!showSidebar || !isMobile) ? 'opacity-100' : 'opacity-0'}
            transition-opacity duration-300
          `}
        >
          {activeChat ? (
            <>
              {/* Messages Area */}
              <div className="flex-1 overflow-hidden">
                <MessageList 
                  messages={messages}
                  currentUser={user}
                  loading={loading}
                  chatId={activeChat._id}
                />
              </div>
              
              {/* Message Input */}
              <div className="p-4 bg-white border-t border-gray-200">
                <MessageInput 
                  chatId={activeChat._id}
                  onMessageSent={handleSendMessage}
                  disabled={!connected}
                />
              </div>
            </>
          ) : (
            <EmptyState />
          )}
        </div>
      </div>

      {/* Footer Navigation */}
      <FooterNav navigate={navigate} />
    </div>
  );
};

export default Chat;