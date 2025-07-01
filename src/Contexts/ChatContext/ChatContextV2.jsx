import React, { createContext, useContext, useState, useCallback, useMemo } from 'react';
import { useAuth } from '../AuthContext/AuthContext';
import { useChatConnection } from './hooks/useChatConnection';
import { useChatConversations } from './hooks/useChatConversations';
import { useChatMessages } from './hooks/useChatMessages';
import { useChatSocket } from './hooks/useChatSocket';
import config from '../../Utils/config';

/**
 * Contexto de Chat refactorizado y modular
 * Utiliza hooks específicos para cada funcionalidad
 */
const ChatContext = createContext();

// Hook para usar el contexto
export const useChat = () => {
  const context = useContext(ChatContext);
  if (!context) {
    throw new Error('useChat debe ser usado dentro de un ChatProvider');
  }
  return context;
};

// Provider del contexto refactorizado
export const ChatProvider = ({ children }) => {
  const { isAuthenticated, user } = useAuth();
  
  // Estado local del chat activo
  const [activeChat, setActiveChat] = useState(null);
  const [showSidebar, setShowSidebar] = useState(true);

  // Hook de conexión
  const connectionHook = useChatConnection(isAuthenticated, user);
  
  // Hook de conversaciones
  const conversationsHook = useChatConversations();
  
  // Hook de mensajes
  const messagesHook = useChatMessages();

  // Callbacks para el socket
  const handleConnectionChange = useCallback((connected, error) => {
    // La conexión ya se maneja en el hook, solo actualizamos errores si es necesario
    if (error) {
      conversationsHook.clearError();
    }
  }, [conversationsHook]);

  const handleConversationAdded = useCallback((newConversation) => {
    conversationsHook.addConversation(newConversation);
  }, [conversationsHook]);

  const handleConversationUpdated = useCallback((conversationUpdate) => {
    conversationsHook.updateConversation(conversationUpdate);
  }, [conversationsHook]);

  const handleMessageReceived = useCallback((chatId, message, isActiveChat) => {
    messagesHook.addMessage(chatId, message);
    
    // Si es el chat activo, marcar como leído automáticamente
    if (isActiveChat) {
      messagesHook.markAsRead(chatId);
    }
  }, [messagesHook]);

  const handleMessagesRead = useCallback((chatId, readBy) => {
    // Actualizar estado de lectura si es necesario
    console.log(`Mensajes leídos en chat ${chatId} por ${readBy}`);
  }, []);

  const handleUserTyping = useCallback((chatId, userId, isTyping, userName) => {
    messagesHook.setUserTyping(chatId, userId, isTyping);
  }, [messagesHook]);

  // Hook de socket
  const socketHook = useChatSocket({
    isAuthenticated,
    connected: connectionHook.connected,
    currentUser: user,
    activeChat,
    onConnectionChange: handleConnectionChange,
    onConversationAdded: handleConversationAdded,
    onConversationUpdated: handleConversationUpdated,
    onMessageReceived: handleMessageReceived,
    onMessagesRead: handleMessagesRead,
    onUserTyping: handleUserTyping
  });

  // Funciones del chat activo
  const selectChat = useCallback((chat) => {
    setActiveChat(chat);
    setShowSidebar(false); // En móvil, ocultar sidebar
    
    // Cargar mensajes del chat
    if (chat?._id) {
      messagesHook.loadMessages(chat._id);
      messagesHook.markAsRead(chat._id); // Marcar como leído al abrir
    }
  }, [messagesHook]);

  const closeChat = useCallback(() => {
    setActiveChat(null);
    setShowSidebar(true);
  }, []);

  // Funciones de envío de mensajes
  const sendMessage = useCallback(async (chatId, content, options = {}) => {
    if (!chatId || !content?.trim()) {
      throw new Error('Chat ID y contenido son requeridos');
    }
    
    try {
      return await messagesHook.sendMessage(chatId, content, options);
    } catch (error) {
      console.error('Error al enviar mensaje:', error);
      throw error;
    }
  }, [messagesHook]);

  // Función para iniciar chat con usuario
  const startChatWithUser = useCallback(async (recipientId, initialMessage) => {
    try {
      const response = await fetch(
        `${config.api}/api/chat/user/${recipientId}/start`,
        {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${sessionStorage.getItem('accessToken')}`,
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({ initialMessage })
        }
      );

      if (!response.ok) {
        throw new Error(`Error ${response.status}: ${response.statusText}`);
      }

      const data = await response.json();

      if (data.success) {
        const newChat = data.chat;
        conversationsHook.addConversation(newChat);
        selectChat(newChat);
        return newChat;
      } else {
        throw new Error(data.message || 'Error al iniciar chat');
      }
    } catch (error) {
      console.error('Error al iniciar chat:', error);
      throw error;
    }
  }, [conversationsHook, selectChat]);

  // Obtener mensajes del chat activo
  const activeMessages = useMemo(() => {
    return activeChat ? messagesHook.getMessages(activeChat._id) : [];
  }, [activeChat, messagesHook]);

  // Obtener usuarios escribiendo en el chat activo
  const activeTypingUsers = useMemo(() => {
    return activeChat ? messagesHook.getTypingUsers(activeChat._id) : [];
  }, [activeChat, messagesHook]);

  // Estado de carga del chat activo
  const activeLoading = useMemo(() => {
    return activeChat ? messagesHook.getLoadingState(activeChat._id) : false;
  }, [activeChat, messagesHook]);

  // Error del chat activo
  const activeError = useMemo(() => {
    return activeChat ? messagesHook.getError(activeChat._id) : null;
  }, [activeChat, messagesHook]);

  // Limpiar error general
  const clearError = useCallback(() => {
    conversationsHook.clearError();
    if (activeChat) {
      messagesHook.clearError(activeChat._id);
    }
  }, [conversationsHook, messagesHook, activeChat]);

  // Valor del contexto optimizado
  const contextValue = useMemo(() => ({
    // Estado de conexión
    connected: connectionHook.connected,
    connectionError: connectionHook.connectionError,
    reconnectAttempts: connectionHook.reconnectAttempts,
    
    // Conversaciones
    conversations: conversationsHook.conversations,
    conversationsLoading: conversationsHook.loading,
    conversationsError: conversationsHook.error,
    unreadCount: conversationsHook.unreadCount,
    searchQuery: conversationsHook.searchQuery,
    
    // Chat activo
    activeChat,
    showSidebar,
    
    // Mensajes del chat activo
    messages: activeMessages,
    messagesLoading: activeLoading,
    messagesError: activeError,
    typingUsers: activeTypingUsers,
    
    // Acciones de conversaciones
    loadConversations: conversationsHook.loadConversations,
    searchConversations: conversationsHook.searchConversations,
    clearSearch: conversationsHook.clearSearch,
    refreshConversations: conversationsHook.refresh,
    
    // Acciones de chat
    selectChat,
    closeChat,
    sendMessage,
    startChatWithUser,
    
    // Acciones de mensajes
    loadMessages: messagesHook.loadMessages,
    markMessagesAsRead: messagesHook.markAsRead,
    
    // Acciones de conexión
    reconnect: connectionHook.reconnect,
    checkConnection: connectionHook.checkConnection,
    
    // Acciones generales
    clearError,
    
    // UI
    setShowSidebar
  }), [
    connectionHook,
    conversationsHook,
    messagesHook,
    activeChat,
    showSidebar,
    activeMessages,
    activeLoading,
    activeError,
    activeTypingUsers,
    selectChat,
    closeChat,
    sendMessage,
    startChatWithUser,
    clearError
  ]);

  return (
    <ChatContext.Provider value={contextValue}>
      {children}
    </ChatContext.Provider>
  );
};

export default ChatContext; 