/**
 * Notification Store (Zustand)
 * Manages application notifications and toasts
 * Separate from UI store for better modularity
 */

import { create } from 'zustand';

export const useNotificationStore = create((set, get) => ({
  // State
  notifications: [],
  maxNotifications: 5, // Max notifications displayed at once

  // Actions
  addNotification: (notification) => {
    const {
      message,
      type = 'info', // 'info', 'success', 'warning', 'error'
      duration = 5000, // milliseconds, 0 for persistent
      action = null, // Optional action button
      id = Date.now(),
    } = notification;

    const newNotification = {
      id,
      message,
      type,
      duration,
      action,
      timestamp: Date.now(),
    };

    set((state) => {
      const notifications = [...state.notifications, newNotification];
      // Remove oldest if max reached
      if (notifications.length > state.maxNotifications) {
        notifications.shift();
      }
      return { notifications };
    });

    // Auto-remove after duration
    if (duration > 0) {
      setTimeout(() => {
        get().removeNotification(id);
      }, duration);
    }

    return id;
  },

  removeNotification: (id) =>
    set((state) => ({
      notifications: state.notifications.filter((n) => n.id !== id),
    })),

  clearNotifications: () =>
    set({ notifications: [] }),

  // Convenience methods
  success: (message, duration) =>
    get().addNotification({ message, type: 'success', duration }),

  error: (message, duration = 7000) =>
    get().addNotification({ message, type: 'error', duration }),

  warning: (message, duration = 6000) =>
    get().addNotification({ message, type: 'warning', duration }),

  info: (message, duration) =>
    get().addNotification({ message, type: 'info', duration }),

  // Set max notifications display limit
  setMaxNotifications: (max) =>
    set({ maxNotifications: max }),
}));

export default useNotificationStore;
