import React, { createContext, useContext, useState, useCallback, useMemo } from 'react';
import config from '../../Utils/config';

/**
 * Contexto de Chat simplificado para evitar problemas de dependencias
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

// Provider del contexto simplificado
export const ChatProvider = ({ children }) => {
  // Estado básico
  const [conversations, setConversations] = useState([]);
  const [activeChat, setActiveChat] = useState(null);
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [connected, setConnected] = useState(true); // Asumir conectado por ahora

  // Función simple para enviar mensaje con optimistic update
  const sendMessage = useCallback(async (chatId, content, options = {}) => {
    if (!chatId || !content?.trim()) {
      throw new Error('Chat ID y contenido son requeridos');
    }

    // Crear mensaje optimista
    const optimisticMessage = {
      _id: `temp_${Date.now()}_${Math.random()}`,
      chatId,
      content: content.trim(),
      messageType: options.messageType || 'text',
      timestamp: new Date(),
      senderId: {
        _id: options.currentUserId || 'current_user',
        name: options.currentUserName || 'Tú'
      },
      isOptimistic: true,
      sending: true
    };

    // Agregar mensaje optimista inmediatamente
    setMessages(prev => [...prev, optimisticMessage]);

    try {
      // Envío al servidor
      const response = await fetch(`${config.api}/api/chat/${chatId}/messages`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${sessionStorage.getItem('accessToken')}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          content: content.trim(),
          messageType: options.messageType || 'text'
        })
      });

      if (!response.ok) {
        throw new Error(`Error ${response.status}: ${response.statusText}`);
      }

      const data = await response.json();

      if (data.success) {
        // Actualizar mensaje optimista con datos reales
        setMessages(prev => prev.map(msg => 
          msg._id === optimisticMessage._id 
            ? { ...data.data, isOptimistic: false, sending: false }
            : msg
        ));
        return data.data;
      } else {
        throw new Error(data.message || 'Error al enviar mensaje');
      }
    } catch (error) {
      // Marcar mensaje como fallido
      setMessages(prev => prev.map(msg => 
        msg._id === optimisticMessage._id 
          ? { ...msg, sending: false, failed: true, error: error.message }
          : msg
      ));
      throw error;
    }
  }, []);

  // Función para seleccionar chat
  const selectChat = useCallback((chat) => {
    setActiveChat(chat);
    // Cargar mensajes del chat (simplificado por ahora)
    setMessages([]);
  }, []);

  // Función para cerrar chat
  const closeChat = useCallback(() => {
    setActiveChat(null);
    setMessages([]);
  }, []);

  // Función para cargar conversaciones
  const loadConversations = useCallback(async () => {
    setLoading(true);
    try {
      // Simular carga de conversaciones
      setConversations([]);
    } catch (error) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  }, []);

  // Función para cargar mensajes
  const loadMessages = useCallback(async (chatId) => {
    setLoading(true);
    try {
      // Simular carga de mensajes
      setMessages([]);
    } catch (error) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  }, []);

  // Función para limpiar errores
  const clearError = useCallback(() => {
    setError(null);
  }, []);

  // Funciones de búsqueda (simplificadas)
  const searchConversations = useCallback((query) => {
    // Por ahora no hacer nada
  }, []);

  const checkConnection = useCallback(() => {
    // Por ahora asumir que está conectado
    return true;
  }, []);

  // Valor del contexto
  const contextValue = useMemo(() => ({
    // Estado
    conversations,
    activeChat,
    messages,
    loading,
    error,
    connected,
    searchQuery: '',
    unreadCount: 0,
    showSidebar: !activeChat,

    // Acciones
    loadConversations,
    loadMessages,
    sendMessage,
    selectChat,
    closeChat,
    searchConversations,
    clearError,
    checkConnection
  }), [
    conversations,
    activeChat,
    messages,
    loading,
    error,
    connected,
    loadConversations,
    loadMessages,
    sendMessage,
    selectChat,
    closeChat,
    searchConversations,
    clearError,
    checkConnection
  ]);

  return (
    <ChatContext.Provider value={contextValue}>
      {children}
    </ChatContext.Provider>
  );
};

export default ChatContext; 