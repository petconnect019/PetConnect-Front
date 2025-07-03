import { useState, useEffect, useCallback, useRef } from 'react';
import { connectSocket, disconnectSocket, isConnected, getConnectionState } from '../../../Utils/socket';

/**
 * Hook para manejar la conexión del socket del chat
 * Separado del contexto principal para mejor modularidad
 */
export const useChatConnection = (isAuthenticated, user) => {
  const [connected, setConnected] = useState(false);
  const [connectionError, setConnectionError] = useState(null);
  const [reconnectAttempts, setReconnectAttempts] = useState(0);
  const connectionRef = useRef(null);
  const maxReconnectAttempts = 3;

  // Verificar estado de conexión
  const checkConnection = useCallback(() => {
    const isConnectedNow = isConnected();
    const state = getConnectionState();
    
    setConnected(isConnectedNow);
    setConnectionError(state.connectionError);
    
    return isConnectedNow;
  }, []);

  // Conectar socket
  const connect = useCallback(async () => {
    if (!isAuthenticated || !user) {
      setConnected(false);
      return false;
    }

    try {
      const token = localStorage.getItem('accessToken');
      if (!token) {
        throw new Error('Token de acceso no encontrado');
      }

      // Extraer ID del usuario correctamente
      const userId = user.id || user._id || user._doc?._id;
      
      if (!userId) {
        throw new Error('ID de usuario no válido');
      }

      const socketInstance = connectSocket(token, { userId });
      
      if (socketInstance && !socketInstance.connected) {
        socketInstance.connect();
      }

      // Verificar conexión después de un breve delay
      setTimeout(() => {
        const connected = checkConnection();
        if (connected) {
          setReconnectAttempts(0);
          setConnectionError(null);
        }
      }, 1000);

      return true;
    } catch (error) {
      console.error('Error al conectar socket:', error);
      setConnectionError(error.message);
      setConnected(false);
      return false;
    }
  }, [isAuthenticated, user, checkConnection]);

  // Desconectar socket
  const disconnect = useCallback(() => {
    disconnectSocket();
    setConnected(false);
    setConnectionError(null);
    setReconnectAttempts(0);
  }, []);

  // Reconectar con límite de intentos
  const reconnect = useCallback(async () => {
    if (reconnectAttempts >= maxReconnectAttempts) {
      setConnectionError('Máximo número de intentos de reconexión alcanzado');
      return false;
    }

    setReconnectAttempts(prev => prev + 1);
    await new Promise(resolve => setTimeout(resolve, 2000 * reconnectAttempts)); // Backoff exponencial
    
    return await connect();
  }, [connect, reconnectAttempts]);

  // Efecto principal de conexión
  useEffect(() => {
    if (isAuthenticated && user) {
      connect();
    } else {
      disconnect();
    }

    // Cleanup al desmontar
    return () => {
      if (connectionRef.current) {
        clearTimeout(connectionRef.current);
      }
      disconnect();
    };
  }, [isAuthenticated, user]); // Solo depende de autenticación y usuario

  return {
    connected,
    connectionError,
    reconnectAttempts,
    connect,
    disconnect,
    reconnect,
    checkConnection
  };
};

export default useChatConnection; 