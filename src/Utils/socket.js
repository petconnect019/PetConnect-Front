import { io } from 'socket.io-client';

const SOCKET_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

export const socket = io(SOCKET_URL, {
  autoConnect: false,
  withCredentials: true,
  reconnection: true,
  reconnectionAttempts: Infinity,
  reconnectionDelay: 1000,
  reconnectionDelayMax: 5000,
  timeout: 20000,
  transports: ['websocket'],
  upgrade: false
});

// Manejar eventos de conexión
socket.on('connect', () => {
  console.log('Socket conectado exitosamente');
  console.log('Tipo de transporte:', socket.io.engine.transport.name);
});

socket.on('connect_error', (error) => {
  console.error('Error de conexión del socket:', error);
});

socket.on('disconnect', (reason) => {
  console.log('Socket desconectado:', reason);
  console.log('Tipo de transporte actual:', socket.io.engine.transport.name);
  
  if (reason === 'io server disconnect' || reason === 'transport close') {
    // Intentar reconectar solo si la desconexión no fue intencional
    setTimeout(() => {
      if (!socket.connected) {
        socket.connect();
      }
    }, 1000);
  }
});

// Función para conectar el socket con el token
export const connectSocket = (token) => {
  if (!token) {
    console.error('No hay token disponible para conectar el socket');
    return;
  }

  // Configurar el token de autorización
  socket.auth = { token };
  
  // Conectar el socket solo si no está conectado
  if (!socket.connected) {
    socket.connect();
  }
};

// Función para desconectar el socket
export const disconnectSocket = () => {
  if (socket.connected) {
    socket.disconnect();
  }
};

// Función para suscribirse a eventos de mensajes nuevos
export const subscribeToMessages = (callback) => {
  socket.on('new_message', (data) => {
    if (callback) callback(data);
  });
};

// Función para suscribirse a solicitudes de chat
export const subscribeToChatRequests = (callback) => {
  socket.on('chat_request', (data) => {
    if (callback) callback(data);
  });
};

// Función para suscribirse a mensajes de mascotas
export const subscribeToPetMessages = (callback) => {
  socket.on('pet_message', (data) => {
    if (callback) callback(data);
  });
};

export default socket;