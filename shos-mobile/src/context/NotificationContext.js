// SHOS Mobile Notification Stream Context

import React, { createContext, useContext, useState, useEffect } from 'react';
import { MOCK_NOTIFICATIONS } from '../mock/notifications';
import { useAuth } from './AuthContext';

const NotificationContext = createContext();

export const NotificationProvider = ({ children }) => {
  const { currentRole } = useAuth();
  const [notifications, setNotifications] = useState(Array.isArray(MOCK_NOTIFICATIONS) ? MOCK_NOTIFICATIONS : []);

  // Filter notifications relevant to current active role
  const roleNotifications = (Array.isArray(notifications) ? notifications : []).filter(
    (n) => !n.roleTarget || n.roleTarget === currentRole || currentRole === 'admin' || currentRole === 'superadmin'
  );

  const unreadCount = roleNotifications.filter((n) => !n.read).length;

  const markAsRead = (id) => {
    setNotifications((prev) =>
      prev.map((n) => (n.id === id ? { ...n, read: true } : n))
    );
  };

  const markAllAsRead = () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
  };

  const addNotification = ({ title, message, category = 'General', priority = 'Normal' }) => {
    const newNotif = {
      id: 'NOTIF-' + Date.now(),
      title,
      message,
      category,
      priority,
      time: 'Just now',
      read: false,
      roleTarget: currentRole,
    };
    setNotifications((prev) => [newNotif, ...prev]);
  };

  const clearNotifications = () => {
    setNotifications([]);
  };

  return (
    <NotificationContext.Provider
      value={{
        notifications: roleNotifications,
        unreadCount,
        markAsRead,
        markAllAsRead,
        addNotification,
        clearNotifications,
      }}
    >
      {children}
    </NotificationContext.Provider>
  );
};

export const useNotifications = () => useContext(NotificationContext);
export default NotificationContext;
