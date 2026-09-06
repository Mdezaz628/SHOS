// Notification Center Service Layer

import { MOCK_NOTIFICATIONS } from '../mock/notifications';

export const notificationService = {
  getNotifications: async (role = null) => {
    await new Promise((resolve) => setTimeout(resolve, 150));
    if (role) {
      return MOCK_NOTIFICATIONS.filter((n) => !n.roleTarget || n.roleTarget === role || role === 'admin');
    }
    return [...MOCK_NOTIFICATIONS];
  },

  markAsRead: async (notificationId) => {
    await new Promise((resolve) => setTimeout(resolve, 100));
    return { success: true, notificationId, read: true };
  },

  markAllAsRead: async () => {
    await new Promise((resolve) => setTimeout(resolve, 150));
    return { success: true };
  },
};

export default notificationService;
