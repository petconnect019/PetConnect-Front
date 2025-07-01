import React, { useEffect, useState, useCallback, useMemo } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { IoSearch } from 'react-icons/io5';

// Contexto y hooks
import { useAuth } from '../../Contexts/AuthContext/AuthContext';
import { useChat } from '../../Contexts/ChatContext/ChatContextV2';

// Componentes optimizados
import OptimizedChatHeader from '../../Components/ChatComponents/OptimizedChatHeader';
import { ConversationList } from '../../Components/ChatComponents/ConversationList';
import { MessageList } from '../../Components/ChatComponents/MessageList';
import { MessageInput } from '../../Components/ChatComponents/MessageInput';
import { FooterNav } from '../../Components/FooterNav/FooterNav';
import ErrorMessage from '../../Components/Common/ErrorMessage';

/**
 * Componente de Chat refactorizado y optimizado
 * Versión minimalista con mejor manejo de estado
 */
export const ChatV2 = () => {
  const navigate = useNavigate();
  const { chat_id } = useParams();
  const { isAuthenticated, user } = useAuth();
  
  // Usar el contexto refactorizado
  const {
    // Estado de conexión
    connected,
    connectionError,
    
    // Conversaciones
    conversations,
    conversationsLoading,
    conversationsError,
    unreadCount,
    searchQuery,
    
    // Chat activo
    activeChat,
    showSidebar,
    
    // Mensajes
    messages,
    messagesLoading,
    messagesError,
    typingUsers,
    
    // Acciones
    loadConversations,
    searchConversations,
    clearSearch,
    selectChat,
    closeChat,
    sendMessage,
    clearError,
    checkConnection,
    setShowSidebar
  } = useChat();

  // Estado local para UI
  const [showSearchBar, setShowSearchBar] = useState(false);
  const [localSearchQuery, setLocalSearchQuery] = useState('');
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);

  // Efecto para detección de pantalla móvil
  useEffect(() => {
    const handleResize = () => {
      const mobile = window.innerWidth < 768;
      setIsMobile(mobile);
      
      // En desktop, mostrar siempre el sidebar si no hay chat activo
      if (!mobile && !activeChat) {
        setShowSidebar(true);
      }
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [activeChat, setShowSidebar]);

  // Redirigir si no está autenticado
  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/login');
    }
  }, [isAuthenticated, navigate]);

  // Cargar conversaciones iniciales
  useEffect(() => {
    if (isAuthenticated) {
      loadConversations();
    }
  }, [isAuthenticated, loadConversations]);

  // Manejar chat_id de la URL
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

  // Handlers memoizados
  const handleSelectConversation = useCallback((conversation) => {
    selectChat(conversation);
    navigate(`/chat/${conversation._id}`);
  }, [selectChat, navigate]);

  const handleBackToList = useCallback(() => {
    closeChat();
    navigate('/chat');
  }, [closeChat, navigate]);

  const handleSearchToggle = useCallback(() => {
    setShowSearchBar(true);
    setLocalSearchQuery(searchQuery);
  }, [searchQuery]);

  const handleSearchChange = useCallback((e) => {
    const query = e.target.value;
    setLocalSearchQuery(query);
    
    // Debounce la búsqueda
    clearTimeout(window.searchTimeout);
    window.searchTimeout = setTimeout(() => {
      searchConversations(query);
    }, 300);
  }, [searchConversations]);

  const handleSearchClear = useCallback(() => {
    setLocalSearchQuery('');
    setShowSearchBar(false);
    clearSearch();
  }, [clearSearch]);

  const handleSendMessage = useCallback(async (content, options = {}) => {
    if (!activeChat) return;
    
    try {
      await sendMessage(activeChat._id, content, options);
    } catch (error) {
      console.error('Error al enviar mensaje:', error);
    }
  }, [activeChat, sendMessage]);

  // Estado de error combinado
  const error = conversationsError || messagesError || connectionError;

  // Componente de estado vacío memoizado
  const EmptyState = useMemo(() => (
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
  ), [isMobile]);

  // Loading inicial
  if (!isAuthenticated) {
    return (
      <div className="fixed inset-0 flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Verificando autenticación...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 flex flex-col bg-gray-50">
      {/* Header optimizado */}
      <OptimizedChatHeader
        activeChat={activeChat}
        showSidebar={showSidebar}
        connected={connected}
        error={error}
        showSearchBar={showSearchBar}
        localSearchQuery={localSearchQuery}
        unreadCount={unreadCount}
        onBackToList={handleBackToList}
        onSearchToggle={handleSearchToggle}
        onSearchChange={handleSearchChange}
        onSearchClear={handleSearchClear}
        onRetryConnection={checkConnection}
      />

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
          {conversationsLoading && !conversations.length ? (
            <div className="flex items-center justify-center h-full">
              <div className="text-center">
                <div className="w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto mb-2"></div>
                <p className="text-gray-600 text-sm">Cargando conversaciones...</p>
              </div>
            </div>
          ) : (
            <ConversationList 
              conversations={conversations}
              selectedChat={activeChat}
              searchQuery={searchQuery}
              onSelectConversation={handleSelectConversation}
              loading={conversationsLoading}
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
                  loading={messagesLoading}
                  chatId={activeChat._id}
                  typingUsers={typingUsers}
                />
              </div>
              
              {/* Message Input */}
              <div className="p-4 bg-white border-t border-gray-200">
                <MessageInput 
                  chatId={activeChat._id}
                  onMessageSent={handleSendMessage}
                  disabled={!connected}
                  placeholder={
                    !connected 
                      ? 'Conectando...' 
                      : `Escribe un mensaje...`
                  }
                />
              </div>
            </>
          ) : (
            EmptyState
          )}
        </div>
      </div>

      {/* Footer Navigation */}
      <FooterNav navigate={navigate} />
    </div>
  );
};

export default ChatV2; 