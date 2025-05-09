import { useState, useEffect, useCallback } from 'react';
import { fetchGetMessages } from '../Utils/Fetch/FetchChat/FetchChat';
import { useSocket } from './useSocket';
import { isTokenExpired } from '../Utils/Helpers/IsTokenExpired/IsTokenExpired';
import { FetchRefreshToken } from '../Utils/Fetch/FetchRefreshToken/FetchRefreshToken';

export const useMessages = (chatId, isAuthenticated) => {
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const socket = useSocket();

  const loadMessages = useCallback(async () => {
    if (!chatId || !isAuthenticated) return;
    
    try {
      setLoading(true);
      setError(null);

      let token = sessionStorage.getItem('accessToken');
      if (isTokenExpired(token)) {
        try {
          await FetchRefreshToken();
          token = sessionStorage.getItem('accessToken');
        } catch (error) {
          console.error('Error al refrescar el token:', error);
          setError('Error de autenticación. Por favor, vuelve a iniciar sesión.');
          return;
        }
      }

      const data = await fetchGetMessages(chatId);
      setMessages(data);
    } catch (error) {
      console.error('Error al cargar mensajes:', error);
      setError('Error al cargar los mensajes. Por favor, intenta de nuevo más tarde.');
    } finally {
      setLoading(false);
    }
  }, [chatId, isAuthenticated]);

  // Cargar mensajes iniciales
  useEffect(() => {
    if (chatId && isAuthenticated) {
      loadMessages();
    }
  }, [chatId, isAuthenticated, loadMessages]);

  // Manejar mensajes nuevos a través del socket
  useEffect(() => {
    if (!isAuthenticated || !chatId || !socket) return;

    const handleNewMessage = (data) => {
      if (data.chatId === chatId) {
        setMessages(prev => {
          const messageExists = prev.some(m => m._id === data.message._id);
          if (messageExists) return prev;
          return [...prev, data.message];
        });
      }
    };

    // Suscribirse a eventos del socket
    socket.on('new_message', handleNewMessage);
    socket.on('chat_request', () => loadMessages());

    return () => {
      socket.off('new_message', handleNewMessage);
      socket.off('chat_request', loadMessages);
    };
  }, [isAuthenticated, chatId, socket, loadMessages]);

  const addMessage = useCallback((message) => {
    setMessages(prev => [...prev, message]);
  }, []);

  return {
    messages,
    loading,
    error,
    loadMessages,
    addMessage
  };
}; 