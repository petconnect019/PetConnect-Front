import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { useAuth } from '../AuthContext/AuthContext';
import { useNotificationToast } from './NotificationToastContext';

const NotificationContext = createContext();

export const useNotifications = () => {
  const context = useContext(NotificationContext);
  if (!context) {
    throw new Error('useNotifications debe ser usado dentro de un NotificationProvider');
  }
  return context;
};

export const NotificationProvider = ({ children }) => {
  const { isAuthenticated } = useAuth();
  const { showNotification } = useNotificationToast();
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [stats, setStats] = useState(null);
  const [lastNotificationId, setLastNotificationId] = useState(null);

  // Función para obtener las notificaciones
  const fetchNotifications = useCallback(async (options = {}) => {
    if (!isAuthenticated) return;

    try {
      setLoading(true);
      setError(null);

      const queryParams = new URLSearchParams({
        page: options.page || 1,
        limit: options.limit || 20,
        includeRead: options.includeRead || true,
        ...(options.type && { type: options.type }),
        ...(options.category && { category: options.category }),
        ...(options.priority && { priority: options.priority })
      }).toString();

      const response = await fetch(`${import.meta.env.VITE_API_URL}/api/notifications?${queryParams}`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('accessToken')}`,
          'Content-Type': 'application/json'
        }
      });

      if (!response.ok) {
        throw new Error('Error al obtener notificaciones');
      }

      const data = await response.json();
      
      // Verificar si hay nuevas notificaciones
      if (data.notifications.length > 0) {
        const latestNotification = data.notifications[0];
        if (latestNotification._id !== lastNotificationId) {
          setLastNotificationId(latestNotification._id);
          
          // Si es una notificación nueva, mostrar toast y push
          if (!lastNotificationId) {
            showNotification({
              type: latestNotification.type === 'error' ? 'error' : 
                    latestNotification.type === 'warning' ? 'warning' : 
                    latestNotification.type === 'success' ? 'success' : 'info',
              title: latestNotification.title,
              message: latestNotification.message,
              icon: '/favicon.svg',
              tag: latestNotification._id,
              data: {
                url: latestNotification.actionUrl,
                notificationId: latestNotification._id
              }
            });
          }
        }
      }
      
      setNotifications(data.notifications);
      return data;

    } catch (err) {
      setError(err.message);
      console.error('Error al obtener notificaciones:', err);
    } finally {
      setLoading(false);
    }
  }, [isAuthenticated, lastNotificationId, showNotification]);

  // Función para obtener el contador de no leídas
  const fetchUnreadCount = useCallback(async () => {
    if (!isAuthenticated) return;

    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL}/api/notifications/unread-count`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('accessToken')}`,
          'Content-Type': 'application/json'
        }
      });

      if (!response.ok) {
        throw new Error('Error al obtener contador de notificaciones');
      }

      const data = await response.json();
      setUnreadCount(data.unreadCount);
      return data.unreadCount;

    } catch (err) {
      console.error('Error al obtener contador de notificaciones:', err);
    }
  }, [isAuthenticated]);

  // Función para obtener estadísticas
  const fetchStats = useCallback(async () => {
    if (!isAuthenticated) return;

    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL}/api/notifications/stats`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('accessToken')}`,
          'Content-Type': 'application/json'
        }
      });

      if (!response.ok) {
        throw new Error('Error al obtener estadísticas');
      }

      const data = await response.json();
      setStats(data.stats);
      return data.stats;

    } catch (err) {
      console.error('Error al obtener estadísticas:', err);
    }
  }, [isAuthenticated]);

  // Función para marcar como leída
  const markAsRead = useCallback(async (notificationId) => {
    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL}/api/notifications/${notificationId}/read`, {
        method: 'PATCH',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('accessToken')}`,
          'Content-Type': 'application/json'
        }
      });

      if (!response.ok) {
        throw new Error('Error al marcar notificación como leída');
      }

      // Actualizar estado local
      setNotifications(prev => prev.map(notif => 
        notif._id === notificationId 
          ? { ...notif, isRead: true, readAt: new Date() }
          : notif
      ));
      
      await fetchUnreadCount();
      return true;

    } catch (err) {
      console.error('Error al marcar notificación como leída:', err);
      return false;
    }
  }, [fetchUnreadCount]);

  // Función para marcar todas como leídas
  const markAllAsRead = useCallback(async () => {
    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL}/api/notifications/read-all`, {
        method: 'PATCH',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('accessToken')}`,
          'Content-Type': 'application/json'
        }
      });

      if (!response.ok) {
        throw new Error('Error al marcar todas las notificaciones como leídas');
      }

      // Actualizar estado local
      setNotifications(prev => prev.map(notif => ({
        ...notif,
        isRead: true,
        readAt: new Date()
      })));
      
      setUnreadCount(0);
      return true;

    } catch (err) {
      console.error('Error al marcar todas las notificaciones como leídas:', err);
      return false;
    }
  }, []);

  // Función para eliminar notificación
  const deleteNotification = useCallback(async (notificationId) => {
    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL}/api/notifications/${notificationId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('accessToken')}`,
          'Content-Type': 'application/json'
        }
      });

      if (!response.ok) {
        throw new Error('Error al eliminar notificación');
      }

      // Actualizar estado local
      setNotifications(prev => prev.filter(notif => notif._id !== notificationId));
      await fetchUnreadCount();
      return true;

    } catch (err) {
      console.error('Error al eliminar notificación:', err);
      return false;
    }
  }, [fetchUnreadCount]);

  // Función para crear una nueva notificación
  const createNotification = useCallback(async ({
    type = 'info',
    title,
    message,
    priority = 'normal',
    category = 'general',
    actionUrl,
    expiresAt,
    data = {}
  }) => {
    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL}/api/notifications`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('accessToken')}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          type,
          title,
          message,
          priority,
          category,
          actionUrl,
          expiresAt,
          data
        })
      });

      if (!response.ok) {
        throw new Error('Error al crear notificación');
      }

      const newNotification = await response.json();
      
      // Mostrar la notificación toast y push
      showNotification({
        type,
        title,
        message,
        icon: '/favicon.svg',
        tag: newNotification._id,
        data: {
          url: actionUrl,
          notificationId: newNotification._id,
          ...data
        }
      });

      // Actualizar la lista de notificaciones y el contador
      await fetchNotifications();
      await fetchUnreadCount();

      return newNotification;

    } catch (err) {
      console.error('Error al crear notificación:', err);
      return null;
    }
  }, [fetchNotifications, fetchUnreadCount, showNotification]);

  // Cargar datos iniciales cuando el usuario está autenticado
  useEffect(() => {
    if (isAuthenticated) {
      fetchNotifications();
      fetchUnreadCount();
      fetchStats();
    }
  }, [isAuthenticated, fetchNotifications, fetchUnreadCount, fetchStats]);

  // Configurar polling para nuevas notificaciones
  useEffect(() => {
    if (!isAuthenticated) return;

    const pollInterval = setInterval(() => {
      fetchNotifications();
      fetchUnreadCount();
    }, 30000); // Cada 30 segundos

    return () => clearInterval(pollInterval);
  }, [isAuthenticated, fetchNotifications, fetchUnreadCount]);

  // Valor del contexto
  const value = {
    notifications,
    unreadCount,
    loading,
    error,
    stats,
    fetchNotifications,
    fetchUnreadCount,
    fetchStats,
    markAsRead,
    markAllAsRead,
    deleteNotification,
    createNotification
  };

  return (
    <NotificationContext.Provider value={value}>
      {children}
    </NotificationContext.Provider>
  );
};

export default NotificationContext; 