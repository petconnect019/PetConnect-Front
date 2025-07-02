import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { IoChevronForward, IoCheckmarkCircleOutline, IoLockClosedOutline, IoStarOutline, IoAlertCircleOutline, IoCloudDownloadOutline, IoSettingsOutline, IoTrashOutline } from 'react-icons/io5';
import { useNotifications } from '../../Contexts/NotificationContext/NotificationContext';

const NotificationItem = ({ notification, onDelete }) => {
  const { markAsRead } = useNotifications();
  const navigate = useNavigate();

  const handleClick = async () => {
    if (!notification.isRead) {
      await markAsRead(notification._id);
    }
    if (notification.actionUrl) {
      navigate(notification.actionUrl);
    }
  };

  const getIcon = () => {
    switch (notification.type) {
      case 'security':
        return <IoLockClosedOutline className="text-xl text-blue-500" />;
      case 'system':
        return <IoAlertCircleOutline className="text-xl text-blue-500" />;
      case 'pet_scan':
        return <IoCheckmarkCircleOutline className="text-xl text-green-500" />;
      case 'message':
        return <IoCheckmarkCircleOutline className="text-xl text-blue-500" />;
      case 'payment':
        return <IoStarOutline className="text-xl text-yellow-500" />;
      case 'reminder':
        return <IoCloudDownloadOutline className="text-xl text-purple-500" />;
      default:
        return <IoCheckmarkCircleOutline className="text-xl text-blue-500" />;
    }
  };

  const formatDate = (date) => {
    const options = { hour: '2-digit', minute: '2-digit' };
    return new Date(date).toLocaleTimeString('es-ES', options);
  };

  return (
    <div className="flex items-start bg-white rounded-lg p-4 mb-2 shadow-sm">
      <div className="w-10 h-10 rounded-full flex justify-center items-center mr-4 flex-shrink-0 bg-blue-50">
        {getIcon()}
      </div>
      <div className="flex-grow" onClick={handleClick}>
        <div className="flex justify-between items-center mb-1">
          <p className="text-base font-semibold text-gray-800 m-0 flex items-center gap-1">
            {notification.title}
          </p>
          {!notification.isRead && (
            <div className="w-2 h-2 rounded-full bg-orange-500 ml-auto mr-2.5"></div>
          )}
          <IoChevronForward className="text-lg text-gray-400" />
        </div>
        <p className="text-sm text-gray-600 leading-tight mb-1">
          {notification.message}
        </p>
        <div className="flex justify-between items-center">
          <p className="text-xs text-gray-500">{formatDate(notification.createdAt)}</p>
          <button 
            onClick={(e) => {
              e.stopPropagation();
              onDelete(notification._id);
            }}
            className="text-gray-400 hover:text-red-500 transition-colors"
          >
            <IoTrashOutline />
          </button>
        </div>
      </div>
    </div>
  );
};

export const Notifications = () => {
  const navigate = useNavigate();
  const { notifications, loading, error, fetchNotifications, deleteNotification, markAllAsRead } = useNotifications();
  const [groupedNotifications, setGroupedNotifications] = useState({
    today: [],
    yesterday: [],
    older: []
  });

  useEffect(() => {
    fetchNotifications();
  }, [fetchNotifications]);

  useEffect(() => {
    const now = new Date();
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    const yesterday = new Date(now.getFullYear(), now.getMonth(), now.getDate() - 1);

    const grouped = notifications.reduce((acc, notification) => {
      const notifDate = new Date(notification.createdAt);
      const notifDay = new Date(notifDate.getFullYear(), notifDate.getMonth(), notifDate.getDate());

      if (notifDay.getTime() === today.getTime()) {
        acc.today.push(notification);
      } else if (notifDay.getTime() === yesterday.getTime()) {
        acc.yesterday.push(notification);
      } else {
        acc.older.push(notification);
      }
      return acc;
    }, { today: [], yesterday: [], older: [] });

    setGroupedNotifications(grouped);
  }, [notifications]);

  const handleDelete = async (notificationId) => {
    await deleteNotification(notificationId);
  };

  const handleMarkAllAsRead = async () => {
    await markAllAsRead();
  };

  if (loading) {
    return (
      <div className="font-sans bg-gray-100 min-h-screen p-5 box-border">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 rounded w-1/4 mb-4"></div>
          <div className="space-y-3">
            {[1, 2, 3].map((i) => (
              <div key={i} className="flex space-x-4">
                <div className="rounded-full bg-gray-200 h-10 w-10"></div>
                <div className="flex-1 space-y-2 py-1">
                  <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                  <div className="h-4 bg-gray-200 rounded w-5/6"></div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="font-sans bg-gray-100 min-h-screen p-5 box-border">
        <div className="text-center text-red-500">
          <p>Error al cargar las notificaciones. Por favor, intente de nuevo.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="font-sans bg-gray-100 min-h-screen p-5 box-border">
      {/* Header */}
      <div className="flex justify-between items-center mb-5 pb-2.5">
        <button onClick={() => navigate(-1)}>
          <IoChevronForward className="text-2xl text-gray-700 transform rotate-180" />
        </button>
        <h1 className="text-2xl font-bold text-gray-800 m-0">Notificaciones</h1>
        <button onClick={handleMarkAllAsRead}>
          <IoSettingsOutline className="text-2xl text-gray-700" />
        </button>
      </div>

      {/* Notifications sections */}
      {notifications.length === 0 ? (
        <div className="text-center py-8">
          <p className="text-gray-500">No tienes notificaciones</p>
        </div>
      ) : (
        <>
          {groupedNotifications.today.length > 0 && (
            <div className="mb-8">
              <h2 className="text-base font-bold text-gray-600 mb-4 uppercase">Hoy</h2>
              {groupedNotifications.today.map((notification) => (
                <NotificationItem
                  key={notification._id}
                  notification={notification}
                  onDelete={handleDelete}
                />
              ))}
            </div>
          )}

          {groupedNotifications.yesterday.length > 0 && (
            <div className="mb-8">
              <h2 className="text-base font-bold text-gray-600 mb-4 uppercase">Ayer</h2>
              {groupedNotifications.yesterday.map((notification) => (
                <NotificationItem
                  key={notification._id}
                  notification={notification}
                  onDelete={handleDelete}
                />
              ))}
            </div>
          )}

          {groupedNotifications.older.length > 0 && (
            <div className="mb-8">
              <h2 className="text-base font-bold text-gray-600 mb-4 uppercase">Anteriores</h2>
              {groupedNotifications.older.map((notification) => (
                <NotificationItem
                  key={notification._id}
                  notification={notification}
                  onDelete={handleDelete}
                />
              ))}
            </div>
          )}
        </>
      )}
    </div>
  );
};