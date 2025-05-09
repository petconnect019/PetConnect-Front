import { io } from 'socket.io-client';

const SOCKET_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

export const socket = io(SOCKET_URL, {
  autoConnect: false,
  withCredentials: true,
  reconnection: true,
  reconnectionAttempts: 5,
  reconnectionDelay: 1000
});

// Manejar reconexión automática
socket.on('disconnect', (reason) => {
  console.log('Socket desconectado:', reason);
  if (reason === 'io server disconnect') {
    // el servidor desconectó el socket
    socket.connect();
  }
});

// Manejar errores de conexión
socket.on('connect_error', (error) => {
  console.error('Error de conexión:', error);
});

// Función para conectar el socket con el token
export const connectSocket = (token) => {
  if (!token) {
    console.error('No hay token disponible para conectar el socket');
    return;
  }

  // Configurar el token de autorización
  socket.auth = { token };
  
  // Conectar el socket
  socket.connect();

  // Manejar reconexión exitosa
  socket.on('connect', () => {
    console.log('Socket conectado exitosamente');
  });
};

// Función para desconectar el socket
export const disconnectSocket = () => {
  socket.disconnect();
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