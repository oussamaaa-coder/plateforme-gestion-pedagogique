/**
 * Zustand Stores Index
 * Centralized export of all application stores
 * Usage: import { useAuthStore, useThemeStore } from 'src/stores';
 */

export { useAuthStore, default as useAuthStoreDefault } from './authStore';
export { useThemeStore, default as useThemeStoreDefault } from './themeStore';
export { useUIStore, default as useUIStoreDefault } from './uiStore';
export { useNotificationStore, default as useNotificationStoreDefault } from './notificationStore';

// Combined hook for easier use
import { useAuthStore } from './authStore';
import { useThemeStore } from './themeStore';
import { useUIStore } from './uiStore';
import { useNotificationStore } from './notificationStore';

export const useStores = () => ({
  auth: useAuthStore(),
  theme: useThemeStore(),
  ui: useUIStore(),
  notification: useNotificationStore(),
});

export default useStores;
