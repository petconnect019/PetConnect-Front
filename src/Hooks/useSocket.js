import { useEffect } from 'react';
import { socket, connectSocket, disconnectSocket } from '../Utils/socket';
import { useAuth } from '../Contexts/AuthContext/AuthContext';
import { isTokenExpired } from '../Utils/Helpers/IsTokenExpired/IsTokenExpired';
import { FetchRefreshToken } from '../Utils/Fetch/FetchRefreshToken/FetchRefreshToken';

export const useSocket = () => {
  const { isAuthenticated } = useAuth();

  useEffect(() => {
    const initializeSocket = async () => {
      if (!isAuthenticated) {
        disconnectSocket();
        return;
      }

      try {
        let token = sessionStorage.getItem('accessToken');
        
        if (isTokenExpired(token)) {
          try {
            await FetchRefreshToken();
            token = sessionStorage.getItem('accessToken');
          } catch (error) {
            console.error('Error al refrescar el token:', error);
            return;
          }
        }

        connectSocket(token);
      } catch (error) {
        console.error('Error al inicializar el socket:', error);
      }
    };

    initializeSocket();

    return () => {
      disconnectSocket();
    };
  }, [isAuthenticated]);

  return socket;
}; 