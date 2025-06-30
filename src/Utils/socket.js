import { io } from 'socket.io-client';

// Variable para almacenar la instancia del socket
let socket = null;

// Estado de conexión
let connectionState = {
  isConnected: false,
  isConnecting: false,
  connectionError: null,
  lastReconnectTime: null
};

// Configuración por defecto
const DEFAULT_CONFIG = {
  autoConnect: false,
  transports: ['websocket', 'polling'],
  timeout: 20000,
  reconnection: true,
  reconnectionAttempts: 5,
  reconnectionDelay: 1000,
  reconnectionDelayMax: 5000,
  maxReconnectionAttempts: 5,
  randomizationFactor: 0.5
};

/**
 * Conectar al servidor de socket
 * @param {string} token - Token de autenticación
 * @param {Object} options - Opciones adicionales de conexión
 */
const connectSocket = (token, options = {}) => {
  if (socket?.connected) {
    console.log('🔌 Socket ya está conectado');
    return socket;
  }

  if (connectionState.isConnecting) {
    console.log('🔄 Conexión ya en progreso...');
    return socket;
  }

  connectionState.isConnecting = true;
  connectionState.connectionError = null;

  const config = {
    ...DEFAULT_CONFIG,
    ...options,
    auth: {
      token: token
    },
    query: {
      userId: options.userId || 'unknown'
    }
  };

  try {
    const serverUrl = import.meta.env.VITE_SOCKET_URL || 
                     import.meta.env.VITE_API_URL?.replace('/api', '') || 
                     'http://localhost:3001';

    console.log('🔌 Conectando socket a:', serverUrl);
    
    socket = io(serverUrl, config);

    // Eventos de conexión
    socket.on('connect', () => {
      console.log('✅ Socket conectado exitosamente:', socket.id);
      connectionState.isConnected = true;
      connectionState.isConnecting = false;
      connectionState.connectionError = null;
      connectionState.lastReconnectTime = new Date();
    });

    socket.on('disconnect', (reason) => {
      console.log('❌ Socket desconectado:', reason);
      connectionState.isConnected = false;
      connectionState.isConnecting = false;
      
      // Intentar reconectar si no fue manual
      if (reason !== 'io client disconnect') {
        console.log('🔄 Intentando reconectar...');
      }
    });

    socket.on('connect_error', (error) => {
      console.error('💥 Error de conexión del socket:', error);
      connectionState.isConnected = false;
      connectionState.isConnecting = false;
      connectionState.connectionError = error.message;
    });

    socket.on('reconnect', (attemptNumber) => {
      console.log(`🔄 Socket reconectado después de ${attemptNumber} intentos`);
      connectionState.lastReconnectTime = new Date();
    });

    socket.on('reconnect_error', (error) => {
      console.error('💥 Error al reconectar:', error);
    });

    socket.on('reconnect_failed', () => {
      console.error('💥 Falló la reconexión del socket');
      connectionState.connectionError = 'Reconexión fallida';
    });

    // Eventos específicos de la aplicación
    socket.on('auth_success', (data) => {
      console.log('🔐 Autenticación exitosa:', data);
    });

    socket.on('auth_error', (error) => {
      console.error('🔐 Error de autenticación:', error);
      disconnectSocket();
    });

    // Ping para mantener la conexión activa
    setInterval(() => {
      if (socket?.connected) {
        socket.emit('ping');
      }
    }, 30000); // Cada 30 segundos

    return socket;

  } catch (error) {
    console.error('💥 Error al crear socket:', error);
    connectionState.isConnecting = false;
    connectionState.connectionError = error.message;
    return null;
  }
};

/**
 * Desconectar el socket
 */
const disconnectSocket = () => {
  if (socket) {
    console.log('🔌 Desconectando socket...');
    socket.disconnect();
    socket = null;
    connectionState.isConnected = false;
    connectionState.isConnecting = false;
    connectionState.connectionError = null;
  }
};

/**
 * Enviar mensaje directo a un usuario específico
 * @param {string} userId - ID del usuario destinatario
 * @param {string} event - Nombre del evento
 * @param {Object} data - Datos a enviar
 */
const sendDirectMessage = (userId, event, data) => {
  if (!socket?.connected) {
    console.warn('⚠️ Socket no está conectado');
    return false;
  }

  socket.emit('direct_message', {
    recipientId: userId,
    event,
    data
  });

  return true;
};

/**
 * Enviar evento a un chat específico
 * @param {string} chatId - ID del chat
 * @param {string} event - Nombre del evento
 * @param {Object} data - Datos a enviar
 */
const sendToChatRoom = (chatId, event, data) => {
  if (!socket?.connected) {
    console.warn('⚠️ Socket no está conectado');
    return false;
  }

  socket.emit('chat_room_message', {
    chatId,
    event,
    data
  });

  return true;
};

/**
 * Unirse a una sala de chat
 * @param {string} chatId - ID del chat
 */
const joinChatRoom = (chatId) => {
  if (!socket?.connected) {
    console.warn('⚠️ Socket no está conectado');
    return false;
  }

  socket.emit('join_chat', { chatId });
  console.log(`🏠 Uniéndose al chat: ${chatId}`);
  return true;
};

/**
 * Salir de una sala de chat
 * @param {string} chatId - ID del chat
 */
const leaveChatRoom = (chatId) => {
  if (!socket?.connected) {
    console.warn('⚠️ Socket no está conectado');
    return false;
  }

  socket.emit('leave_chat', { chatId });
  console.log(`🏠 Saliendo del chat: ${chatId}`);
  return true;
};

/**
 * Indicar que el usuario está escribiendo
 * @param {string} chatId - ID del chat
 */
const startTyping = (chatId) => {
  if (!socket?.connected) return false;
  
  socket.emit('typing_start', { chatId });
  return true;
};

/**
 * Indicar que el usuario dejó de escribir
 * @param {string} chatId - ID del chat
 */
const stopTyping = (chatId) => {
  if (!socket?.connected) return false;
  
  socket.emit('typing_stop', { chatId });
  return true;
};

/**
 * Obtener estado de conexión
 */
const getConnectionState = () => {
  return {
    ...connectionState,
    socketId: socket?.id || null,
    connected: socket?.connected || false
  };
};

/**
 * Verificar si el socket está conectado
 */
const isConnected = () => {
  return socket?.connected || false;
};

/**
 * Agregar listener de evento
 * @param {string} event - Nombre del evento
 * @param {Function} callback - Función callback
 */
const on = (event, callback) => {
  if (socket) {
    socket.on(event, callback);
  }
};

/**
 * Remover listener de evento
 * @param {string} event - Nombre del evento
 * @param {Function} callback - Función callback (opcional)
 */
const off = (event, callback) => {
  if (socket) {
    if (callback) {
      socket.off(event, callback);
    } else {
      socket.off(event);
    }
  }
};

/**
 * Emitir evento personalizado
 * @param {string} event - Nombre del evento
 * @param {*} data - Datos a enviar
 */
const emit = (event, data) => {
  if (socket?.connected) {
    socket.emit(event, data);
    return true;
  }
  return false;
};

// Exportar la instancia actual del socket y las funciones
export {
  socket,
  connectSocket,
  disconnectSocket,
  sendDirectMessage,
  sendToChatRoom,
  joinChatRoom,
  leaveChatRoom,
  startTyping,
  stopTyping,
  getConnectionState,
  isConnected,
  on,
  off,
  emit
};

// Exportar como default para compatibilidad
export default {
  socket,
  connectSocket,
  disconnectSocket,
  sendDirectMessage,
  sendToChatRoom,
  joinChatRoom,
  leaveChatRoom,
  startTyping,
  stopTyping,
  getConnectionState,
  isConnected,
  on,
  off,
  emit
}; 