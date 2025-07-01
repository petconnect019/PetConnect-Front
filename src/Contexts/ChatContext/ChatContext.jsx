import React, { createContext, useContext, useReducer, useEffect, useCallback } from 'react';
import { useAuth } from '../AuthContext/AuthContext';
import { io } from 'socket.io-client';
import config from '../../Utils/config';

// --- 1. Definición de Acciones Claras ---
const ACTIONS = {
  // Conexión
  SET_CONNECTION_STATE: 'SET_CONNECTION_STATE',
  
  // Carga y Errores
  SET_LOADING: 'SET_LOADING',
  SET_ERROR: 'SET_ERROR',

  // Conversaciones
  SET_CONVERSATIONS: 'SET_CONVERSATIONS',
  UPDATE_OR_ADD_CONVERSATION: 'UPDATE_OR_ADD_CONVERSATION',

  // Mensajes y Chat Activo
  SET_ACTIVE_CHAT_MESSAGES: 'SET_ACTIVE_CHAT_MESSAGES',
  ADD_MESSAGE_TO_ACTIVE_CHAT: 'ADD_MESSAGE_TO_ACTIVE_CHAT',
  CLEAR_ACTIVE_CHAT: 'CLEAR_ACTIVE_CHAT',
};

// --- 2. Estado Inicial Simplificado ---
const initialState = {
  socket: null,
  connectionState: 'disconnected', // 'connecting', 'connected', 'disconnected'
  isLoading: false,
  error: null,
  conversations: [],
  activeChat: {
    chatId: null,
    messages: [],
  },
};

// --- 3. Reducer Centralizado y Predecible ---
const chatReducer = (state, action) => {
  switch (action.type) {
    case ACTIONS.SET_CONNECTION_STATE:
      return { ...state, connectionState: action.payload };

    case ACTIONS.SET_LOADING:
      return { ...state, isLoading: action.payload };

    case ACTIONS.SET_ERROR:
      return { ...state, error: action.payload, isLoading: false };

    case ACTIONS.SET_CONVERSATIONS:
      return { ...state, conversations: action.payload };

    case ACTIONS.UPDATE_OR_ADD_CONVERSATION: {
      const updatedConversation = action.payload;
      const existingConvo = state.conversations.find(c => c._id === updatedConversation._id);
      
      let newConversations;
      if (existingConvo) {
        // Actualizar existente
        newConversations = state.conversations.map(c => 
          c._id === updatedConversation._id ? updatedConversation : c
        );
      } else {
        // Agregar nueva
        newConversations = [updatedConversation, ...state.conversations];
      }
      
      // Ordenar por la fecha del último mensaje
      newConversations.sort((a, b) => 
        new Date(b.lastMessage?.timestamp || 0) - new Date(a.lastMessage?.timestamp || 0)
      );

      return { ...state, conversations: newConversations };
    }

    case ACTIONS.SET_ACTIVE_CHAT_MESSAGES:
      return {
        ...state,
        activeChat: {
          chatId: action.payload.chatId,
          messages: action.payload.messages,
        },
      };

    case ACTIONS.ADD_MESSAGE_TO_ACTIVE_CHAT: {
      const { message, chatId } = action.payload;

      // Solo agregar si el mensaje pertenece al chat activo
      if (state.activeChat.chatId !== chatId) return state;

      // Evitar duplicados
      if (state.activeChat.messages.some(m => m._id === message._id)) return state;

      return {
        ...state,
        activeChat: {
          ...state.activeChat,
          messages: [...state.activeChat.messages, message],
        },
      };
    }
    
    case ACTIONS.CLEAR_ACTIVE_CHAT:
      return { ...state, activeChat: { chatId: null, messages: [] } };

    default:
      return state;
  }
};

const ChatContext = createContext();

export const useChat = () => useContext(ChatContext);

// --- 4. Provider con Lógica de Socket Aislada y Controlada ---
export const ChatProvider = ({ children }) => {
  const [state, dispatch] = useReducer(chatReducer, initialState);
  const { isAuthenticated, user, token } = useAuth();

  // --- Ciclo de Vida del Socket ---
  useEffect(() => {
    if (isAuthenticated && user && token) {
      console.log('🔌 [ChatContext] Iniciando conexión de socket...');
      console.log(`   Usuario autenticado: ${user.name} (${user.email})`);
      console.log(`   Token disponible: ${token ? `${token.substring(0, 20)}...` : 'NONE'}`);
      console.log(`   URL del socket: ${config.api}`);
      
      dispatch({ type: ACTIONS.SET_CONNECTION_STATE, payload: 'connecting' });

      const newSocket = io(config.api, {
        auth: { token: `Bearer ${token}` },
        transports: ['polling', 'websocket'],
        upgrade: true,
        rememberUpgrade: true,
        timeout: 120000,
        forceNew: true,
        autoConnect: true
      });

      // --- Listeners Centralizados ---
      newSocket.on('connect', () => {
        console.log('✅ [ChatContext] Socket conectado exitosamente');
        dispatch({ type: ACTIONS.SET_CONNECTION_STATE, payload: 'connected' });
        // Cargar conversaciones iniciales al conectar
        loadConversations(); 
      });

      newSocket.on('disconnect', () => {
        console.log('🔌 [ChatContext] Socket desconectado');
        dispatch({ type: ACTIONS.SET_CONNECTION_STATE, payload: 'disconnected' });
      });
      
      newSocket.on('connect_error', (err) => {
        console.error("❌ [ChatContext] Error de conexión del socket:", err.message);
        console.error("   Detalles del error:", err);
        dispatch({ type: ACTIONS.SET_ERROR, payload: 'Error de conexión con el chat.' });
        dispatch({ type: ACTIONS.SET_CONNECTION_STATE, payload: 'disconnected' });
      });

      // Evento para un nuevo mensaje que llega
      newSocket.on('new_message', ({ message, conversation }) => {
        console.log('📩 [ChatContext] Nuevo mensaje recibido:', message);
        // 1. Actualizar la lista de conversaciones
        dispatch({ type: ACTIONS.UPDATE_OR_ADD_CONVERSATION, payload: conversation });
        // 2. Si es del chat activo, añadir el mensaje a la vista
        dispatch({ type: ACTIONS.ADD_MESSAGE_TO_ACTIVE_CHAT, payload: { message, chatId: conversation._id } });
      });

      // Evento cuando se crea un chat nuevo (ej. alguien nos contacta)
      newSocket.on('chat_created', (conversation) => {
        console.log('💬 [ChatContext] Nuevo chat creado:', conversation);
        dispatch({ type: ACTIONS.UPDATE_OR_ADD_CONVERSATION, payload: conversation });
      });

      // Función de limpieza al desmontar
      return () => {
        console.log('🧹 [ChatContext] Desconectando socket...');
        newSocket.disconnect();
      };
    } else {
      console.log('⚠️ [ChatContext] No se puede conectar socket:');
      console.log(`   isAuthenticated: ${isAuthenticated}`);
      console.log(`   user: ${user ? user.name : 'NONE'}`);
      console.log(`   token: ${token ? 'DISPONIBLE' : 'NONE'}`);
    }
  }, [isAuthenticated, user, token]);

  // --- Funciones Expuestas al Resto de la App ---

  const loadConversations = async () => {
    // Usar token del contexto o fallback a sessionStorage
    const currentToken = token || sessionStorage.getItem('accessToken');
    if (!currentToken) {
      return dispatch({ type: ACTIONS.SET_ERROR, payload: 'No autenticado' });
    }

    dispatch({ type: ACTIONS.SET_LOADING, payload: true });
    try {
      const response = await fetch(`${config.api}/api/chat`, {
        headers: { 'Authorization': `Bearer ${currentToken}` },
      });
      if (!response.ok) {
        if (response.status === 401) {
          dispatch({ type: ACTIONS.SET_ERROR, payload: 'Sesión expirada. Por favor, inicie sesión de nuevo.' });
        } else {
          throw new Error('No se pudieron cargar las conversaciones');
        }
        return;
      }
      const data = await response.json();
      dispatch({ type: ACTIONS.SET_CONVERSATIONS, payload: data.data || [] });
    } catch (error) {
      dispatch({ type: ACTIONS.SET_ERROR, payload: error.message });
    } finally {
      dispatch({ type: ACTIONS.SET_LOADING, payload: false });
    }
  };

  const loadMessages = async (chatId) => {
    const currentToken = token || sessionStorage.getItem('accessToken');
    if (!currentToken) {
      return dispatch({ type: ACTIONS.SET_ERROR, payload: 'No autenticado' });
    }

    dispatch({ type: ACTIONS.SET_LOADING, payload: true });
    dispatch({ type: ACTIONS.CLEAR_ACTIVE_CHAT });
    try {
      const response = await fetch(`${config.api}/api/chat/${chatId}/messages`, {
        headers: { 'Authorization': `Bearer ${currentToken}` },
      });
      if (!response.ok) throw new Error('No se pudieron cargar los mensajes');
      const data = await response.json();
      dispatch({ type: ACTIONS.SET_ACTIVE_CHAT_MESSAGES, payload: { chatId, messages: data.data || [] } });
    } catch (error) {
      dispatch({ type: ACTIONS.SET_ERROR, payload: error.message });
    } finally {
      dispatch({ type: ACTIONS.SET_LOADING, payload: false });
    }
  };

  const sendMessage = async (chatId, content) => {
    const currentToken = token || sessionStorage.getItem('accessToken');
    if (!currentToken) {
      return dispatch({ type: ACTIONS.SET_ERROR, payload: 'No autenticado' });
    }

    try {
      const response = await fetch(`${config.api}/api/chat/${chatId}/messages`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${currentToken}`,
        },
        body: JSON.stringify({ content }),
      });
      if (!response.ok) throw new Error('No se pudo enviar el mensaje');
      
      // El evento 'new_message' del socket se encargará de actualizar el estado.
      
    } catch (error) {
      dispatch({ type: ACTIONS.SET_ERROR, payload: error.message });
    }
  };

  const value = {
    // Estado
    ...state,
    // Acciones
    loadConversations,
    loadMessages,
    sendMessage,
  };

  return <ChatContext.Provider value={value}>{children}</ChatContext.Provider>;
};

export default ChatContext; 