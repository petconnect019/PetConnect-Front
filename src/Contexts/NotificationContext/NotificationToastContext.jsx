import React, { createContext, useContext, useCallback } from 'react';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const NotificationToastContext = createContext();

export const useNotificationToast = () => {
  const context = useContext(NotificationToastContext);
  if (!context) {
    throw new Error('useNotificationToast debe ser usado dentro de un NotificationToastProvider');
  }
  return context;
};

export const NotificationToastProvider = ({ children }) => {
  // Función para mostrar notificación toast
  const showToast = useCallback(({ type = 'info', message, title, duration = 5000, position = 'top-right' }) => {
    const toastConfig = {
      position,
      autoClose: duration,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
      progress: undefined,
    };

    const content = title ? (
      <div>
        <h4 className="font-bold">{title}</h4>
        <p>{message}</p>
      </div>
    ) : message;

    switch (type) {
      case 'success':
        toast.success(content, toastConfig);
        break;
      case 'error':
        toast.error(content, toastConfig);
        break;
      case 'warning':
        toast.warning(content, toastConfig);
        break;
      case 'info':
      default:
        toast.info(content, toastConfig);
        break;
    }
  }, []);

  // Función para mostrar notificación push
  const showPushNotification = useCallback(async ({ title, message, icon = '/favicon.svg', tag, data = {} }) => {
    try {
      // Verificar si el navegador soporta notificaciones
      if (!('Notification' in window)) {
        console.warn('Este navegador no soporta notificaciones push');
        return false;
      }

      // Verificar si ya tenemos permiso
      if (Notification.permission === 'granted') {
        // Si tenemos Service Worker, usarlo para la notificación
        if ('serviceWorker' in navigator && navigator.serviceWorker.ready) {
          const registration = await navigator.serviceWorker.ready;
          await registration.showNotification(title, {
            body: message,
            icon,
            tag,
            data,
            badge: '/favicon.svg',
            vibrate: [200, 100, 200],
            requireInteraction: true,
          });
        } else {
          // Fallback a notificación nativa
          new Notification(title, {
            body: message,
            icon,
            tag,
            data,
          });
        }
        return true;
      }

      // Si el permiso está en default, solicitarlo
      if (Notification.permission === 'default') {
        const permission = await Notification.requestPermission();
        if (permission === 'granted') {
          return showPushNotification({ title, message, icon, tag, data });
        }
      }

      return false;
    } catch (error) {
      console.error('Error al mostrar notificación push:', error);
      return false;
    }
  }, []);

  // Función para mostrar ambos tipos de notificación
  const showNotification = useCallback(async ({ 
    toast: showToastNotif = true, 
    push: showPushNotif = true,
    type = 'info',
    title,
    message,
    duration,
    position,
    icon,
    tag,
    data
  }) => {
    if (showToastNotif) {
      showToast({ type, message, title, duration, position });
    }
    if (showPushNotif) {
      await showPushNotification({ title: title || message, message, icon, tag, data });
    }
  }, [showToast, showPushNotification]);

  const value = {
    showToast,
    showPushNotification,
    showNotification
  };

  return (
    <NotificationToastContext.Provider value={value}>
      {children}
    </NotificationToastContext.Provider>
  );
}; 