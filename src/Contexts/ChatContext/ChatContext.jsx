import React, { createContext, useContext, useReducer, useEffect, useCallback, useRef } from 'react';
import { useAuth } from '../AuthContext/AuthContext';
import { connectSocket, disconnectSocket, on, off, isConnected, getConnectionState } from '../../Utils/socket';
import config from '../../Utils/config';
// import { fetchGetConversations, fetchSendMessage, fetchGetMessages } from '../../Utils/Fetch/FetchChat/FetchChat';

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
        conversations: action.payload.conversations || [],
        conversationsPagination: action.payload.pagination || {},
        conversationsLoading: false,
        unreadCount: (action.payload.conversations || []).reduce((acc, conv) => acc + (conv.unreadCount || 0), 0)
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
        messages: action.payload.messages || [],
        messagesPagination: action.payload.pagination || {},
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
  
  // Referencias para evitar dependencias circulares
  const loadConversationsRef = useRef();
  const loadMessagesRef = useRef();

  // Cargar conversaciones
  const loadConversations = useCallback(async (options = {}) => {
    try {
      dispatch({ type: CHAT_ACTIONS.SET_LOADING, payload: true });
      
      const {
        page = 1,
        limit = 20,
        search = '',
        ...filters
      } = options;

      const queryParams = new URLSearchParams({
        page: page.toString(),
        limit: limit.toString(),
        ...(search && { search }),
        ...filters
      });

      const response = await fetch(`${config.api}/api/chat?${queryParams}`, {
        headers: {
          'Authorization': `Bearer ${sessionStorage.getItem('accessToken')}`,
          'Content-Type': 'application/json'
        }
      });

      const data = await response.json();

      if (data && data.success) {
        dispatch({
          type: CHAT_ACTIONS.SET_CONVERSATIONS,
          payload: {
            conversations: data.data || [],
            pagination: data.pagination || {}
          }
        });
      } else {
        throw new Error(data?.message || 'Error al cargar conversaciones');
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
  }, []);

  // Cargar mensajes de un chat
  const loadMessages = useCallback(async (chatId, options = {}) => {
    if (!chatId) return;
    
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
        `${config.api}/api/chat/${chatId}/messages?${queryParams}`,
        {
          headers: {
            'Authorization': `Bearer ${sessionStorage.getItem('accessToken')}`,
            'Content-Type': 'application/json'
          }
        }
      );

      const data = await response.json();

      if (data && data.success) {
        dispatch({
          type: CHAT_ACTIONS.SET_MESSAGES,
          payload: {
            messages: data.data || [],
            pagination: data.pagination || {}
          }
        });
      } else {
        throw new Error(data?.message || 'Error al cargar mensajes');
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
    if (!chatId || !content?.trim()) return;
    
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

      const data = await response.json();

      if (data && data.success) {
        // El mensaje se agregará via socket, no necesitamos agregarlo aquí
        return data.data;
      } else {
        throw new Error(data?.message || 'Error al enviar mensaje');
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
    if (chat?._id && loadMessagesRef.current) {
      loadMessagesRef.current(chat._id);
    }
  }, []);

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
  }, []);

  // Limpiar error
  const clearError = useCallback(() => {
    dispatch({ type: CHAT_ACTIONS.CLEAR_ERROR });
  }, []);

  // Verificar estado de conexión
  const checkConnection = useCallback(() => {
    const connected = isConnected();
    const connectionState = getConnectionState();
    
    dispatch({ 
      type: CHAT_ACTIONS.SET_CONNECTED, 
      payload: connected 
    });
    
    console.log('🔍 Estado de conexión verificado:', {
      connected,
      socketId: connectionState.socketId,
      error: connectionState.connectionError
    });
    
    return connected;
  }, []);

  // Asignar funciones a referencias
  loadConversationsRef.current = loadConversations;
  loadMessagesRef.current = loadMessages;

  // Conectar socket al autenticarse
  useEffect(() => {
    if (isAuthenticated && user) {
      const token = sessionStorage.getItem('accessToken');
      if (token) {
        console.log('🔌 Conectando socket para usuario:', user.name);
        console.log('🔐 Token encontrado (primeros 20 chars):', token.substring(0, 20) + '...');
        console.log('👤 ID de usuario:', user.id || user._id);
        console.log('🔗 Configuración automática:', {
          entorno: config.isDevelopment ? 'desarrollo' : 'producción',
          api: config.api,
          socket: config.socket
        });
        
        const socket = connectSocket(token, { userId: user.id || user._id });
        
        // Verificar estado inicial de conexión con varios intentos
        let attempts = 0;
        const checkConnection = () => {
          attempts++;
          const connected = isConnected();
          const connectionState = getConnectionState();
          
          console.log(`🔍 Intento ${attempts} - Estado de conexión:`);
          console.log(`   ✅ Conectado: ${connected ? 'SÍ' : 'NO'}`);
          console.log(`   🆔 Socket ID: ${connectionState.socketId || 'Sin asignar'}`);
          console.log(`   ❌ Error: ${connectionState.connectionError || 'Ninguno'}`);
          console.log(`   🔗 URL Socket: ${config.socket}`);
          
          dispatch({ type: CHAT_ACTIONS.SET_CONNECTED, payload: connected });
          
          // Si no está conectado y no hay error de socket, intentar de nuevo
          if (!connected && attempts < 3 && !connectionState.connectionError) {
            setTimeout(checkConnection, 2000);
          }
        };
        
        setTimeout(checkConnection, 1000);
      } else {
        console.warn('⚠️ No se encontró token de acceso');
        dispatch({ type: CHAT_ACTIONS.SET_CONNECTED, payload: false });
      }
    } else {
      console.log('🔌 Desconectando socket - usuario no autenticado');
      disconnectSocket();
      dispatch({ type: CHAT_ACTIONS.SET_CONNECTED, payload: false });
    }

    return () => {
      disconnectSocket();
    };
  }, [isAuthenticated, user]);

  // Configurar listeners de socket
  useEffect(() => {
    if (!isAuthenticated) return;

    // Handlers de socket
    const handleConnect = () => {
      dispatch({ type: CHAT_ACTIONS.SET_CONNECTED, payload: true });
      dispatch({ type: CHAT_ACTIONS.CLEAR_ERROR });
      console.log('✅ Socket conectado exitosamente');
    };

    const handleDisconnect = (reason) => {
      dispatch({ type: CHAT_ACTIONS.SET_CONNECTED, payload: false });
      console.log('❌ Socket desconectado:', reason);
      
      if (reason !== 'io client disconnect') {
        dispatch({ 
          type: CHAT_ACTIONS.SET_ERROR, 
          payload: 'Conexión perdida. Intentando reconectar...' 
        });
      }
    };

    const handleConnectError = (error) => {
      dispatch({ type: CHAT_ACTIONS.SET_CONNECTED, payload: false });
      dispatch({ 
        type: CHAT_ACTIONS.SET_ERROR, 
        payload: 'Error de conexión. Verificando...' 
      });
      console.error('💥 Error de conexión del socket:', error);
    };

    const handleNewMessage = (data) => {
      const { chatId, message } = data;
      
      if (state.activeChat?._id === chatId) {
        dispatch({
          type: CHAT_ACTIONS.ADD_MESSAGE,
          payload: { ...message, chatId }
        });
      }
      
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

    const handleChatCreated = (data) => {
      console.log('🆕 Nuevo chat creado:', data);
      dispatch({
        type: CHAT_ACTIONS.ADD_CONVERSATION,
        payload: data
      });
    };

    const handleMessagesRead = (data) => {
      dispatch({
        type: CHAT_ACTIONS.MARK_MESSAGES_READ,
        payload: { chatId: data.chatId }
      });
    };

    const handleUserTyping = (data) => {
      dispatch({
        type: CHAT_ACTIONS.SET_TYPING,
        payload: {
          chatId: data.chatId,
          userId: data.userId,
          isTyping: true
        }
      });

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
    on('connect', handleConnect);
    on('disconnect', handleDisconnect);
    on('connect_error', handleConnectError);
    on('new_message', handleNewMessage);
    on('chat_created', handleChatCreated);
    on('messages_read', handleMessagesRead);
    on('user_typing', handleUserTyping);

    // Cleanup
    return () => {
      off('connect', handleConnect);
      off('disconnect', handleDisconnect);
      off('connect_error', handleConnectError);
      off('new_message', handleNewMessage);
      off('chat_created', handleChatCreated);
      off('messages_read', handleMessagesRead);
      off('user_typing', handleUserTyping);
    };
  }, [isAuthenticated]);

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
    clearError,
    checkConnection
  };

  return (
    <ChatContext.Provider value={contextValue}>
      {children}
    </ChatContext.Provider>
  );
};

export default ChatContext; 