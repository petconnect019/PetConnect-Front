import React, { createContext, useContext, useReducer, useEffect, useCallback } from 'react';
import { useAuth } from '../AuthContext/AuthContext';
import { socket, connectSocket, disconnectSocket } from '../../Utils/socket';
import { fetchGetConversations, fetchSendMessage, fetchGetMessages } from '../../Utils/Fetch/FetchChat/FetchChat';

// Tipos de acciones
const CHAT_ACTIONS = {
  // Estados de carga
  SET_LOADING: 'SET_LOADING',
  SET_ERROR: 'SET_ERROR',
  CLEAR_ERROR: 'CLEAR_ERROR',
  
  // Gestión de conversaciones
  SET_CONVERSATIONS: 'SET_CONVERSATIONS',
  ADD_CONVERSATION: 'ADD_CONVERSATION',
  UPDATE_CONVERSATION: 'UPDATE_CONVERSATION',
  REMOVE_CONVERSATION: 'REMOVE_CONVERSATION',
  
  // Gestión de chat activo
  SET_ACTIVE_CHAT: 'SET_ACTIVE_CHAT',
  CLEAR_ACTIVE_CHAT: 'CLEAR_ACTIVE_CHAT',
  
  // Gestión de mensajes
  SET_MESSAGES: 'SET_MESSAGES',
  ADD_MESSAGE: 'ADD_MESSAGE',
  UPDATE_MESSAGE: 'UPDATE_MESSAGE',
  MARK_MESSAGES_READ: 'MARK_MESSAGES_READ',
  
  // Estados de conexión
  SET_CONNECTED: 'SET_CONNECTED',
  SET_TYPING: 'SET_TYPING',
  
  // Configuración
  SET_PAGINATION: 'SET_PAGINATION',
  SET_SEARCH_QUERY: 'SET_SEARCH_QUERY'
};

// Estado inicial
const initialState = {
  // Estados de carga y error
  loading: false,
  error: null,
  
  // Conversaciones
  conversations: [],
  conversationsLoading: false,
  conversationsPagination: {
    page: 1,
    limit: 20,
    total: 0,
    hasNext: false
  },
  
  // Chat activo
  activeChat: null,
  messages: [],
  messagesLoading: false,
  messagesPagination: {
    page: 1,
    limit: 50,
    hasMore: false
  },
  
  // Estados de conexión y tipeo
  connected: false,
  typingUsers: {},
  
  // Búsqueda y filtros
  searchQuery: '',
  filters: {
    chatType: null,
    status: 'active'
  },
  
  // UI State
  showSidebar: true,
  unreadCount: 0
};

// Reducer para manejar el estado del chat
const chatReducer = (state, action) => {
  switch (action.type) {
    case CHAT_ACTIONS.SET_LOADING:
      return {
        ...state,
        loading: action.payload
      };
      
    case CHAT_ACTIONS.SET_ERROR:
      return {
        ...state,
        error: action.payload,
        loading: false
      };
      
    case CHAT_ACTIONS.CLEAR_ERROR:
      return {
        ...state,
        error: null
      };
      
    case CHAT_ACTIONS.SET_CONVERSATIONS:
      return {
        ...state,
        conversations: action.payload.conversations,
        conversationsPagination: action.payload.pagination,
        conversationsLoading: false,
        unreadCount: action.payload.conversations.reduce((acc, conv) => acc + (conv.unreadCount || 0), 0)
      };
      
    case CHAT_ACTIONS.ADD_CONVERSATION:
      return {
        ...state,
        conversations: [action.payload, ...state.conversations]
      };
      
    case CHAT_ACTIONS.UPDATE_CONVERSATION:
      return {
        ...state,
        conversations: state.conversations.map(conv =>
          conv._id === action.payload._id ? { ...conv, ...action.payload } : conv
        )
      };
      
    case CHAT_ACTIONS.SET_ACTIVE_CHAT:
      return {
        ...state,
        activeChat: action.payload,
        messages: [],
        showSidebar: false // En móvil, ocultar sidebar al seleccionar chat
      };
      
    case CHAT_ACTIONS.CLEAR_ACTIVE_CHAT:
      return {
        ...state,
        activeChat: null,
        messages: [],
        showSidebar: true
      };
      
    case CHAT_ACTIONS.SET_MESSAGES:
      return {
        ...state,
        messages: action.payload.messages,
        messagesPagination: action.payload.pagination,
        messagesLoading: false
      };
      
    case CHAT_ACTIONS.ADD_MESSAGE:
      return {
        ...state,
        messages: [...state.messages, action.payload],
        conversations: state.conversations.map(conv =>
          conv._id === action.payload.chatId
            ? {
                ...conv,
                lastMessage: {
                  content: action.payload.content,
                  timestamp: action.payload.timestamp,
                  senderId: action.payload.senderId
                }
              }
            : conv
        )
      };
      
    case CHAT_ACTIONS.UPDATE_MESSAGE:
      return {
        ...state,
        messages: state.messages.map(msg =>
          msg._id === action.payload._id ? { ...msg, ...action.payload } : msg
        )
      };
      
    case CHAT_ACTIONS.MARK_MESSAGES_READ:
      return {
        ...state,
        conversations: state.conversations.map(conv =>
          conv._id === action.payload.chatId
            ? { ...conv, unreadCount: 0 }
            : conv
        )
      };
      
    case CHAT_ACTIONS.SET_CONNECTED:
      return {
        ...state,
        connected: action.payload
      };
      
    case CHAT_ACTIONS.SET_TYPING:
      return {
        ...state,
        typingUsers: {
          ...state.typingUsers,
          [action.payload.chatId]: action.payload.isTyping
            ? [...(state.typingUsers[action.payload.chatId] || []), action.payload.userId]
            : (state.typingUsers[action.payload.chatId] || []).filter(id => id !== action.payload.userId)
        }
      };
      
    case CHAT_ACTIONS.SET_SEARCH_QUERY:
      return {
        ...state,
        searchQuery: action.payload
      };
      
    default:
      return state;
  }
};

// Crear contexto
const ChatContext = createContext();

// Hook para usar el contexto
export const useChat = () => {
  const context = useContext(ChatContext);
  if (!context) {
    throw new Error('useChat debe ser usado dentro de un ChatProvider');
  }
  return context;
};

// Provider del contexto
export const ChatProvider = ({ children }) => {
  const [state, dispatch] = useReducer(chatReducer, initialState);
  const { isAuthenticated, user } = useAuth();

  // Conectar socket al autenticarse
  useEffect(() => {
    if (isAuthenticated && user) {
      const token = sessionStorage.getItem('accessToken');
      if (token) {
        connectSocket(token);
      }
    } else {
      disconnectSocket();
    }

    return () => {
      disconnectSocket();
    };
  }, [isAuthenticated, user]);

  // Configurar listeners de socket
  useEffect(() => {
    if (!isAuthenticated) return;

    // Conexión establecida
    const handleConnect = () => {
      dispatch({ type: CHAT_ACTIONS.SET_CONNECTED, payload: true });
      console.log('🔌 Socket conectado');
    };

    // Conexión perdida
    const handleDisconnect = (reason) => {
      dispatch({ type: CHAT_ACTIONS.SET_CONNECTED, payload: false });
      console.log('❌ Socket desconectado:', reason);
    };

    // Nuevo mensaje recibido
    const handleNewMessage = (data) => {
      const { chatId, message } = data;
      
      // Agregar mensaje si es del chat activo
      if (state.activeChat?._id === chatId) {
        dispatch({
          type: CHAT_ACTIONS.ADD_MESSAGE,
          payload: { ...message, chatId }
        });
      }
      
      // Actualizar conversación
      dispatch({
        type: CHAT_ACTIONS.UPDATE_CONVERSATION,
        payload: {
          _id: chatId,
          lastMessage: {
            content: message.content,
            timestamp: message.timestamp,
            senderId: message.senderId
          },
          unreadCount: state.activeChat?._id === chatId ? 0 : 1
        }
      });
    };

    // Nuevo chat creado
    const handleChatCreated = (data) => {
      console.log('🆕 Nuevo chat creado:', data);
      loadConversations(); // Recargar conversaciones
    };

    // Mensajes marcados como leídos
    const handleMessagesRead = (data) => {
      dispatch({
        type: CHAT_ACTIONS.MARK_MESSAGES_READ,
        payload: { chatId: data.chatId }
      });
    };

    // Usuario escribiendo
    const handleUserTyping = (data) => {
      dispatch({
        type: CHAT_ACTIONS.SET_TYPING,
        payload: {
          chatId: data.chatId,
          userId: data.userId,
          isTyping: true
        }
      });

      // Limpiar estado de tipeo después de 3 segundos
      setTimeout(() => {
        dispatch({
          type: CHAT_ACTIONS.SET_TYPING,
          payload: {
            chatId: data.chatId,
            userId: data.userId,
            isTyping: false
          }
        });
      }, 3000);
    };

    // Configurar listeners
    socket.on('connect', handleConnect);
    socket.on('disconnect', handleDisconnect);
    socket.on('new_message', handleNewMessage);
    socket.on('chat_created', handleChatCreated);
    socket.on('messages_read', handleMessagesRead);
    socket.on('user_typing', handleUserTyping);

    // Cleanup
    return () => {
      socket.off('connect', handleConnect);
      socket.off('disconnect', handleDisconnect);
      socket.off('new_message', handleNewMessage);
      socket.off('chat_created', handleChatCreated);
      socket.off('messages_read', handleMessagesRead);
      socket.off('user_typing', handleUserTyping);
    };
  }, [isAuthenticated, state.activeChat]);

  // Cargar conversaciones
  const loadConversations = useCallback(async (options = {}) => {
    try {
      dispatch({ type: CHAT_ACTIONS.SET_LOADING, payload: true });
      
      const {
        page = 1,
        limit = 20,
        search = state.searchQuery,
        ...filters
      } = options;

      const queryParams = new URLSearchParams({
        page: page.toString(),
        limit: limit.toString(),
        ...(search && { search }),
        ...filters
      });

      const response = await fetch(`${import.meta.env.VITE_API_URL}/api/chat?${queryParams}`, {
        headers: {
          'Authorization': `Bearer ${sessionStorage.getItem('accessToken')}`,
          'Content-Type': 'application/json'
        }
      });

      const data = await response.json();

      if (data.success) {
        dispatch({
          type: CHAT_ACTIONS.SET_CONVERSATIONS,
          payload: {
            conversations: data.data,
            pagination: data.pagination
          }
        });
      } else {
        throw new Error(data.message);
      }
    } catch (error) {
      console.error('Error al cargar conversaciones:', error);
      dispatch({
        type: CHAT_ACTIONS.SET_ERROR,
        payload: error.message
      });
    } finally {
      dispatch({ type: CHAT_ACTIONS.SET_LOADING, payload: false });
    }
  }, [state.searchQuery]);

  // Cargar mensajes de un chat
  const loadMessages = useCallback(async (chatId, options = {}) => {
    try {
      dispatch({ type: CHAT_ACTIONS.SET_LOADING, payload: true });
      
      const {
        page = 1,
        limit = 50,
        before
      } = options;

      const queryParams = new URLSearchParams({
        page: page.toString(),
        limit: limit.toString(),
        ...(before && { before })
      });

      const response = await fetch(
        `${import.meta.env.VITE_API_URL}/api/chat/${chatId}/messages?${queryParams}`,
        {
          headers: {
            'Authorization': `Bearer ${sessionStorage.getItem('accessToken')}`,
            'Content-Type': 'application/json'
          }
        }
      );

      const data = await response.json();

      if (data.success) {
        dispatch({
          type: CHAT_ACTIONS.SET_MESSAGES,
          payload: {
            messages: data.data,
            pagination: data.pagination
          }
        });
      } else {
        throw new Error(data.message);
      }
    } catch (error) {
      console.error('Error al cargar mensajes:', error);
      dispatch({
        type: CHAT_ACTIONS.SET_ERROR,
        payload: error.message
      });
    } finally {
      dispatch({ type: CHAT_ACTIONS.SET_LOADING, payload: false });
    }
  }, []);

  // Enviar mensaje
  const sendMessage = useCallback(async (chatId, content, options = {}) => {
    try {
      const messageData = {
        content: content.trim(),
        messageType: options.messageType || 'text',
        ...(options.attachments && { attachments: options.attachments }),
        ...(options.location && { location: options.location })
      };

      const response = await fetch(
        `${import.meta.env.VITE_API_URL}/api/chat/${chatId}/messages`,
        {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${sessionStorage.getItem('accessToken')}`,
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(messageData)
        }
      );

      const data = await response.json();

      if (data.success) {
        // El mensaje se agregará via socket, no necesitamos agregarlo aquí
        return data.data;
      } else {
        throw new Error(data.message);
      }
    } catch (error) {
      console.error('Error al enviar mensaje:', error);
      dispatch({
        type: CHAT_ACTIONS.SET_ERROR,
        payload: error.message
      });
      throw error;
    }
  }, []);

  // Seleccionar chat
  const selectChat = useCallback((chat) => {
    dispatch({
      type: CHAT_ACTIONS.SET_ACTIVE_CHAT,
      payload: chat
    });
    
    // Cargar mensajes del chat
    if (chat?._id) {
      loadMessages(chat._id);
    }
  }, [loadMessages]);

  // Cerrar chat
  const closeChat = useCallback(() => {
    dispatch({ type: CHAT_ACTIONS.CLEAR_ACTIVE_CHAT });
  }, []);

  // Buscar conversaciones
  const searchConversations = useCallback((query) => {
    dispatch({
      type: CHAT_ACTIONS.SET_SEARCH_QUERY,
      payload: query
    });
    
    // Recargar conversaciones con búsqueda
    loadConversations({ search: query, page: 1 });
  }, [loadConversations]);

  // Limpiar error
  const clearError = useCallback(() => {
    dispatch({ type: CHAT_ACTIONS.CLEAR_ERROR });
  }, []);

  // Valor del contexto
  const contextValue = {
    // Estado
    ...state,
    
    // Acciones
    loadConversations,
    loadMessages,
    sendMessage,
    selectChat,
    closeChat,
    searchConversations,
    clearError
  };

  return (
    <ChatContext.Provider value={contextValue}>
      {children}
    </ChatContext.Provider>
  );
};

export default ChatContext; 