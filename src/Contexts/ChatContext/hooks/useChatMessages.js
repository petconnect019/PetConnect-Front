import { useState, useCallback, useMemo, useRef } from 'react';
import config from '../../../Utils/config';

/**
 * Hook para manejar los mensajes del chat
 * Incluye envío, carga paginada y optimizaciones de rendimiento
 */
export const useChatMessages = () => {
  const [messagesByChat, setMessagesByChat] = useState(new Map());
  const [loadingStates, setLoadingStates] = useState(new Map());
  const [errorStates, setErrorStates] = useState(new Map());
  const [paginationStates, setPaginationStates] = useState(new Map());
  const [typingUsers, setTypingUsers] = useState(new Map());
  
  // Cache para evitar requests duplicados
  const loadingCache = useRef(new Set());

  // Obtener mensajes de un chat específico
  const getMessages = useCallback((chatId) => {
    return messagesByChat.get(chatId) || [];
  }, [messagesByChat]);

  // Obtener estado de carga de un chat
  const getLoadingState = useCallback((chatId) => {
    return loadingStates.get(chatId) || false;
  }, [loadingStates]);

  // Obtener error de un chat
  const getError = useCallback((chatId) => {
    return errorStates.get(chatId) || null;
  }, [errorStates]);

  // Obtener paginación de un chat
  const getPagination = useCallback((chatId) => {
    return paginationStates.get(chatId) || {
      page: 1,
      limit: 50,
      hasMore: false
    };
  }, [paginationStates]);

  // Cargar mensajes de un chat
  const loadMessages = useCallback(async (chatId, options = {}) => {
    if (!chatId || loadingCache.current.has(chatId)) {
      return;
    }

    try {
      loadingCache.current.add(chatId);
      
      setLoadingStates(prev => new Map(prev).set(chatId, true));
      setErrorStates(prev => new Map(prev).set(chatId, null));
      
      const {
        page = 1,
        limit = 50,
        before,
        resetMessages = true
      } = options;

      const queryParams = new URLSearchParams({
        page: page.toString(),
        limit: limit.toString(),
        ...(before && { before })
      });

      const response = await fetch(
        `${config.api}/api/chat/${chatId}/messages?${queryParams}`,
        {
          headers: {
            'Authorization': `Bearer ${sessionStorage.getItem('accessToken')}`,
            'Content-Type': 'application/json'
          }
        }
      );

      if (!response.ok) {
        throw new Error(`Error ${response.status}: ${response.statusText}`);
      }

      const data = await response.json();

      if (data.success) {
        const newMessages = data.data || [];
        
        setMessagesByChat(prev => {
          const newMap = new Map(prev);
          const existingMessages = newMap.get(chatId) || [];
          
          const updatedMessages = resetMessages || page === 1 
            ? newMessages 
            : [...existingMessages, ...newMessages];
          
          newMap.set(chatId, updatedMessages);
          return newMap;
        });
        
        setPaginationStates(prev => 
          new Map(prev).set(chatId, data.pagination || {})
        );
      } else {
        throw new Error(data.message || 'Error al cargar mensajes');
      }
    } catch (error) {
      console.error(`Error al cargar mensajes del chat ${chatId}:`, error);
      setErrorStates(prev => new Map(prev).set(chatId, error.message));
    } finally {
      setLoadingStates(prev => new Map(prev).set(chatId, false));
      loadingCache.current.delete(chatId);
    }
  }, []);

  // Enviar mensaje con Optimistic Update
  const sendMessage = useCallback(async (chatId, content, options = {}) => {
    if (!chatId || !content?.trim()) {
      throw new Error('Chat ID y contenido son requeridos');
    }
    
    // Crear mensaje optimista
    const optimisticMessage = {
      _id: `temp_${Date.now()}_${Math.random()}`, // ID temporal
      chatId, // Incluir chatId para reintentos
      content: content.trim(),
      messageType: options.messageType || 'text',
      attachments: options.attachments || [],
      location: options.location || null,
      timestamp: new Date(),
      senderId: {
        _id: options.currentUserId || 'current_user',
        name: options.currentUserName || 'Tú'
      },
      isOptimistic: true, // Marca para identificar mensajes optimistas
      sending: true // Estado de envío
    };

    // Agregar mensaje optimista inmediatamente
    addMessage(chatId, optimisticMessage);
    
    try {
      const messageData = {
        content: content.trim(),
        messageType: options.messageType || 'text',
        ...(options.attachments && { attachments: options.attachments }),
        ...(options.location && { location: options.location })
      };

      const response = await fetch(
        `${config.api}/api/chat/${chatId}/messages`,
        {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${sessionStorage.getItem('accessToken')}`,
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(messageData)
        }
      );

      if (!response.ok) {
        throw new Error(`Error ${response.status}: ${response.statusText}`);
      }

      const data = await response.json();

      if (data.success) {
        // Actualizar el mensaje optimista con los datos reales del servidor
        updateMessage(chatId, optimisticMessage._id, {
          _id: data.data._id,
          senderId: data.data.senderId,
          timestamp: data.data.timestamp,
          isOptimistic: false,
          sending: false
        });
        
        return data.data;
      } else {
        throw new Error(data.message || 'Error al enviar mensaje');
      }
    } catch (error) {
      console.error(`Error al enviar mensaje en chat ${chatId}:`, error);
      
      // Marcar el mensaje como fallido en lugar de eliminarlo
      updateMessage(chatId, optimisticMessage._id, {
        sending: false,
        failed: true,
        error: error.message
      });
      
      throw error;
    }
  }, [addMessage, updateMessage]);

  // Agregar mensaje (generalmente llamado desde socket)
  const addMessage = useCallback((chatId, message) => {
    setMessagesByChat(prev => {
      const newMap = new Map(prev);
      const existingMessages = newMap.get(chatId) || [];
      
      // Si es un mensaje del socket y ya existe un optimista con el mismo contenido y timestamp similar
      if (!message.isOptimistic) {
        const optimisticIndex = existingMessages.findIndex(msg => 
          msg.isOptimistic && 
          msg.content === message.content &&
          Math.abs(new Date(msg.timestamp) - new Date(message.timestamp)) < 5000 // 5 segundos de diferencia
        );
        
        if (optimisticIndex !== -1) {
          // Reemplazar el mensaje optimista con el real
          const updatedMessages = [...existingMessages];
          updatedMessages[optimisticIndex] = { ...message, isOptimistic: false };
          newMap.set(chatId, updatedMessages);
          return newMap;
        }
      }
      
      // Evitar duplicados por ID
      const messageExists = existingMessages.some(msg => msg._id === message._id);
      if (messageExists) return prev;
      
      const updatedMessages = [...existingMessages, message];
      newMap.set(chatId, updatedMessages);
      return newMap;
    });
  }, []);

  // Actualizar mensaje existente
  const updateMessage = useCallback((chatId, messageId, updates) => {
    setMessagesByChat(prev => {
      const newMap = new Map(prev);
      const messages = newMap.get(chatId) || [];
      
      const updatedMessages = messages.map(msg =>
        msg._id === messageId ? { ...msg, ...updates } : msg
      );
      
      newMap.set(chatId, updatedMessages);
      return newMap;
    });
  }, []);

  // Marcar mensajes como leídos
  const markAsRead = useCallback(async (chatId, messageIds = null) => {
    try {
      const response = await fetch(
        `${config.api}/api/chat/${chatId}/read`,
        {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${sessionStorage.getItem('accessToken')}`,
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({ messageIds })
        }
      );

      if (!response.ok) {
        throw new Error(`Error ${response.status}: ${response.statusText}`);
      }

      const data = await response.json();
      return data.success;
    } catch (error) {
      console.error(`Error al marcar mensajes como leídos:`, error);
      return false;
    }
  }, []);

  // Limpiar mensajes de un chat
  const clearMessages = useCallback((chatId) => {
    setMessagesByChat(prev => {
      const newMap = new Map(prev);
      newMap.delete(chatId);
      return newMap;
    });
    
    setLoadingStates(prev => {
      const newMap = new Map(prev);
      newMap.delete(chatId);
      return newMap;
    });
    
    setErrorStates(prev => {
      const newMap = new Map(prev);
      newMap.delete(chatId);
      return newMap;
    });
    
    setPaginationStates(prev => {
      const newMap = new Map(prev);
      newMap.delete(chatId);
      return newMap;
    });
  }, []);

  // Limpiar error de un chat específico
  const clearError = useCallback((chatId) => {
    setErrorStates(prev => {
      const newMap = new Map(prev);
      newMap.delete(chatId);
      return newMap;
    });
  }, []);

  // Gestionar usuarios que están escribiendo
  const setUserTyping = useCallback((chatId, userId, isTyping) => {
    setTypingUsers(prev => {
      const newMap = new Map(prev);
      const chatTypingUsers = newMap.get(chatId) || new Set();
      
      if (isTyping) {
        chatTypingUsers.add(userId);
      } else {
        chatTypingUsers.delete(userId);
      }
      
      if (chatTypingUsers.size === 0) {
        newMap.delete(chatId);
      } else {
        newMap.set(chatId, chatTypingUsers);
      }
      
      return newMap;
    });
  }, []);

  // Obtener usuarios que están escribiendo
  const getTypingUsers = useCallback((chatId) => {
    return Array.from(typingUsers.get(chatId) || []);
  }, [typingUsers]);

  // Reintentar envío de mensaje fallido
  const retryMessage = useCallback(async (chatId, content, originalMessageId, options = {}) => {
    try {
      // Remover el mensaje fallido del estado
      setMessagesByChat(prev => {
        const newMap = new Map(prev);
        const messages = newMap.get(chatId) || [];
        const filteredMessages = messages.filter(msg => msg._id !== originalMessageId);
        newMap.set(chatId, filteredMessages);
        return newMap;
      });
      
      // Reenviar el mensaje
      await sendMessage(chatId, content, options);
    } catch (error) {
      console.error('Error al reintentar envío:', error);
      throw error;
    }
  }, [sendMessage]);

  // Limpiar todo el estado
  const clearAll = useCallback(() => {
    setMessagesByChat(new Map());
    setLoadingStates(new Map());
    setErrorStates(new Map());
    setPaginationStates(new Map());
    setTypingUsers(new Map());
    loadingCache.current.clear();
  }, []);

  return {
    // Getters
    getMessages,
    getLoadingState,
    getError,
    getPagination,
    getTypingUsers,
    
    // Acciones
    loadMessages,
    sendMessage,
    retryMessage,
    addMessage,
    updateMessage,
    markAsRead,
    clearMessages,
    clearError,
    clearAll,
    setUserTyping
  };
};

export default useChatMessages; 