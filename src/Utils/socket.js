import { io } from 'socket.io-client';
import config from './config';

// Variable para almacenar la instancia del socket
let socket = null;

// Estado de conexión
let connectionState = {
  isConnected: false,
  isConnecting: false,
  connectionError: null,
  lastReconnectTime: null
};

// Configuración simplificada basada en el test exitoso
const DEFAULT_CONFIG = {
  transports: ['websocket', 'polling'],
  timeout: 10000
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

  // Usar configuración simple como en el test exitoso
  const socketConfig = {
    auth: { token },
    transports: ['websocket', 'polling'],
    timeout: 10000,
    autoConnect: true, // Conectar automáticamente como en el test
    forceNew: false,
    ...options
  };

  try {
    const serverUrl = config.socket;

    console.log('🔌 Conectando socket a:', serverUrl);
    console.log('🔧 Configuración detectada:', {
      entorno: config.isDevelopment ? 'desarrollo' : 'producción',
      api: config.api,
      socket: config.socket
    });
    console.log('🔐 Autenticación:', {
      tokenExiste: !!token,
      tokenLength: token ? token.length : 0,
      userId: options.userId
    });
    
    console.log('⚙️ Config del socket:', socketConfig);
    
    socket = io(serverUrl, socketConfig);
    
    console.log('📡 Socket creado, esperando conexión...');

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

    socket.on('connect_error', async (error) => {
      console.error('💥 Error de conexión del socket:', error);
      // Detectar error por token inválido / expirado y reintentar
      if (error?.message?.toLowerCase().includes('token')) {
        await refreshTokenAndReconnect();
        return; // Evitar marcar como error hasta reintentar
      }

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
      console.log('✅ 🔐 Autenticación exitosa:', data);
    });

    socket.on('auth_error', (error) => {
      console.error('❌ 🔐 Error de autenticación:', error);
      connectionState.connectionError = `Auth Error: ${error}`;
      disconnectSocket();
    });

    // Listener adicional para errores específicos
    socket.on('error', (error) => {
      console.error('❌ Error general del socket:', error);
      connectionState.connectionError = error.message || error;
    });

    // Ping para mantener la conexión activa
    setInterval(() => {
      if (socket?.connected) {
        socket.emit('ping');
      }
    }, 30000); // Cada 30 segundos

    // Responder al ping de servidor personalizado
    socket.on('ping', () => {
      socket.emit('pong');
    });

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
  if (socket && typeof callback === 'function') {
    socket.on(event, callback);
    return true;
  }
  console.warn(`⚠️ No se pudo agregar listener para evento: ${event}`);
  return false;
};

/**
 * Remover listener de evento
 * @param {string} event - Nombre del evento
 * @param {Function} callback - Función callback (opcional)
 */
const off = (event, callback) => {
  if (socket) {
    try {
      if (callback) {
        socket.off(event, callback);
      } else {
        socket.off(event);
      }
      return true;
    } catch (error) {
      console.warn(`⚠️ Error al remover listener para evento ${event}:`, error);
    }
  }
  return false;
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
  console.warn(`⚠️ No se pudo emitir evento ${event}: socket no está conectado`);
  return false;
};

/**
 * Obtener la instancia actual del socket
 */
const getSocket = () => socket;

/**
 * Forzar reconexión del socket
 */
const forceReconnect = () => {
  if (socket) {
    socket.disconnect();
    socket.connect();
  }
};

// Nueva función para actualizar el token de autenticación del socket
const updateAuthToken = (newToken) => {
  if (!newToken) return;
  // Actualizar localStorage por consistencia
  localStorage.setItem('accessToken', newToken);

  if (socket) {
    // Actualizar el token que se enviará en el próximo handshake
    socket.auth = socket.auth || {};
    socket.auth.token = newToken;

    // Si el socket está desconectado, forzar reconexión usando el nuevo token
    if (!socket.connected && !connectionState.isConnecting) {
      console.log('🔄 Token actualizado. Reintentando conexión del socket...');
      try {
        socket.connect();
      } catch (err) {
        console.error('💥 Error al reconectar después de actualizar token:', err);
      }
    }
  }
};

// Helper interno para refrescar token vía endpoint y reintentar conexión
const refreshTokenAndReconnect = async () => {
  try {
    console.log('🔄 Intentando refrescar token...');
    const response = await fetch(`${config.api}/api/auth/refresh-token`, {
      method: 'POST',
      credentials: 'include',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      }
    });

    if (!response.ok) {
      throw new Error('No fue posible refrescar el token');
    }

    const data = await response.json();

    if (data.accessToken) {
      updateAuthToken(data.accessToken);
    }
  } catch (err) {
    console.error('💥 Error al refrescar token:', err);
  }
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
  emit,
  getSocket,
  forceReconnect,
  updateAuthToken
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
  emit,
  getSocket,
  forceReconnect,
  updateAuthToken
}; 