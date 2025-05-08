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

  useEffect(() => {
    if (chatId && isAuthenticated) {
      loadMessages();
      const interval = setInterval(loadMessages, 5000);
      return () => clearInterval(interval);
    }
  }, [chatId, isAuthenticated, loadMessages]);

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

    socket.on('new_message', handleNewMessage);

    return () => {
      socket.off('new_message', handleNewMessage);
    };
  }, [isAuthenticated, chatId, socket]);

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