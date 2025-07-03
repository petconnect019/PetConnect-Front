import { useEffect, useCallback, useRef } from 'react';
import { on, off } from '../../../Utils/socket';

/**
 * Hook para manejar los eventos del socket del chat
 * Centraliza todos los listeners y callbacks
 */
export const useChatSocket = ({
  isAuthenticated,
  connected,
  currentUser,
  activeChat,
  onConnectionChange,
  onConversationAdded,
  onConversationUpdated,
  onMessageReceived,
  onMessagesRead,
  onUserTyping
}) => {
  const listenersSetup = useRef(false);

  // Handlers de eventos del socket
  const handleConnect = useCallback(() => {
    console.log('✅ Socket conectado');
    onConnectionChange?.(true, null);
  }, [onConnectionChange]);

  const handleDisconnect = useCallback((reason) => {
    console.log('❌ Socket desconectado:', reason);
    onConnectionChange?.(false, null);
    
    if (reason !== 'io client disconnect') {
      onConnectionChange?.(false, 'Conexión perdida. Intentando reconectar...');
    }
  }, [onConnectionChange]);

  const handleConnectError = useCallback((error) => {
    console.error('💥 Error de conexión del socket:', error);
    onConnectionChange?.(false, 'Error de conexión. Verificando...');
  }, [onConnectionChange]);

  const handleNewMessage = useCallback((data) => {
    const { chatId, message } = data;
    
    if (!chatId || !message) {
      console.warn('Mensaje recibido con datos incompletos:', data);
      return;
    }

    // Determinar si es el chat activo
    const isActiveChat = activeChat?._id === chatId;
    
    // Agregar el mensaje
    onMessageReceived?.(chatId, message, isActiveChat);
    
    // Actualizar la conversación correspondiente
    onConversationUpdated?.({
      _id: chatId,
      lastMessage: {
        content: message.content,
        timestamp: message.timestamp,
        senderId: message.senderId
      },
      // Solo incrementar unreadCount si no es el chat activo y no es nuestro mensaje
      ...(isActiveChat || message.senderId._id === currentUser?.id ? {} : { 
        unreadCount: 1 
      })
    });
  }, [activeChat, currentUser, onMessageReceived, onConversationUpdated]);

  const handleChatCreated = useCallback((data) => {
    console.log('🆕 Nuevo chat creado:', data);
    onConversationAdded?.(data);
  }, [onConversationAdded]);

  const handleMessagesRead = useCallback((data) => {
    const { chatId, readBy } = data;
    
    if (!chatId) {
      console.warn('Evento messages_read sin chatId:', data);
      return;
    }
    
    onMessagesRead?.(chatId, readBy);
    
    // Si es nuestro chat activo y otro usuario leyó, actualizar la conversación
    if (activeChat?._id === chatId && readBy !== currentUser?.id) {
      onConversationUpdated?.({
        _id: chatId,
        unreadCount: 0
      });
    }
  }, [activeChat, currentUser, onMessagesRead, onConversationUpdated]);

  const handleUserTyping = useCallback((data) => {
    const { chatId, userId, userName, isTyping } = data;
    
    if (!chatId || !userId) {
      console.warn('Evento user_typing con datos incompletos:', data);
      return;
    }
    
    // No mostrar notificación de tipeo si es el usuario actual
    if (userId === currentUser?.id) {
      return;
    }
    
    onUserTyping?.(chatId, userId, isTyping, userName);
  }, [currentUser, onUserTyping]);

  const handleReconnection = useCallback(() => {
    console.log('🔄 Reconectando socket...');
    onConnectionChange?.(false, 'Reconectando...');
  }, [onConnectionChange]);

  const handleReconnected = useCallback(() => {
    console.log('✅ Socket reconectado exitosamente');
    onConnectionChange?.(true, null);
  }, [onConnectionChange]);

  // Configurar listeners del socket
  useEffect(() => {
    if (!isAuthenticated || listenersSetup.current) {
      return;
    }

    console.log('🔧 Configurando listeners del socket de chat...');

    // Eventos de conexión
    on('connect', handleConnect);
    on('disconnect', handleDisconnect);
    on('connect_error', handleConnectError);
    on('reconnect', handleReconnected);
    on('reconnecting', handleReconnection);

    // Eventos de chat
    on('new_message', handleNewMessage);
    on('chat_created', handleChatCreated);
    on('messages_read', handleMessagesRead);
    on('user_typing', handleUserTyping);

    listenersSetup.current = true;

    // Cleanup function
    return () => {
      console.log('🧹 Limpiando listeners del socket de chat...');
      
      // Remover todos los listeners
      off('connect', handleConnect);
      off('disconnect', handleDisconnect);
      off('connect_error', handleConnectError);
      off('reconnect', handleReconnected);
      off('reconnecting', handleReconnection);
      off('new_message', handleNewMessage);
      off('chat_created', handleChatCreated);
      off('messages_read', handleMessagesRead);
      off('user_typing', handleUserTyping);
      
      listenersSetup.current = false;
    };
  }, [
    isAuthenticated,
    handleConnect,
    handleDisconnect,
    handleConnectError,
    handleReconnected,
    handleReconnection,
    handleNewMessage,
    handleChatCreated,
    handleMessagesRead,
    handleUserTyping
  ]);

  // Función para limpiar manualmente los listeners (útil para hot reload)
  const cleanup = useCallback(() => {
    if (!listenersSetup.current) return;
    
    off('connect', handleConnect);
    off('disconnect', handleDisconnect);
    off('connect_error', handleConnectError);
    off('reconnect', handleReconnected);
    off('reconnecting', handleReconnection);
    off('new_message', handleNewMessage);
    off('chat_created', handleChatCreated);
    off('messages_read', handleMessagesRead);
    off('user_typing', handleUserTyping);
    
    listenersSetup.current = false;
  }, [
    handleConnect,
    handleDisconnect,
    handleConnectError,
    handleReconnected,
    handleReconnection,
    handleNewMessage,
    handleChatCreated,
    handleMessagesRead,
    handleUserTyping
  ]);

  return {
    cleanup,
    listenersActive: listenersSetup.current
  };
};

export default useChatSocket; 