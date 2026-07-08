/**
 * UI Store (Zustand)
 * Manages UI state across the application
 * Handles: sidebar toggle, modals, notifications, dropdowns, etc.
 */

import { create } from 'zustand';

export const useUIStore = create((set, get) => ({
  // Sidebar state
  sidebarOpen: true,
  setSidebarOpen: (isOpen) => set({ sidebarOpen: isOpen }),
  toggleSidebar: () =>
    set((state) => ({ sidebarOpen: !state.sidebarOpen })),

  // Notifications
  notifications: [],
  addNotification: (notification) => {
    const id = Date.now();
    const newNotification = { ...notification, id };
    set((state) => ({
      notifications: [...state.notifications, newNotification],
    }));
    // Auto remove after 5 seconds if no duration specified
    const duration = notification.duration || 5000;
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
  clearNotifications: () => set({ notifications: [] }),

  // Modals
  modals: {},
  openModal: (modalId, data = {}) =>
    set((state) => ({
      modals: {
        ...state.modals,
        [modalId]: { isOpen: true, data },
      },
    })),
  closeModal: (modalId) =>
    set((state) => ({
      modals: {
        ...state.modals,
        [modalId]: { isOpen: false, data: {} },
      },
    })),
  toggleModal: (modalId, data = {}) =>
    set((state) => {
      const isOpen = state.modals[modalId]?.isOpen || false;
      return {
        modals: {
          ...state.modals,
          [modalId]: { isOpen: !isOpen, data },
        },
      };
    }),
  isModalOpen: (modalId) => {
    const state = get();
    return state.modals[modalId]?.isOpen || false;
  },
  getModalData: (modalId) => {
    const state = get();
    return state.modals[modalId]?.data || {};
  },

  // Loading states
  loadingStates: {},
  setLoading: (key, isLoading) =>
    set((state) => ({
      loadingStates: {
        ...state.loadingStates,
        [key]: isLoading,
      },
    })),
  isLoading: (key) => {
    const state = get();
    return state.loadingStates[key] || false;
  },

  // Dropdown menus
  openDropdowns: {},
  openDropdown: (dropdownId) =>
    set((state) => ({
      openDropdowns: {
        ...state.openDropdowns,
        [dropdownId]: true,
      },
    })),
  closeDropdown: (dropdownId) =>
    set((state) => ({
      openDropdowns: {
        ...state.openDropdowns,
        [dropdownId]: false,
      },
    })),
  toggleDropdown: (dropdownId) =>
    set((state) => ({
      openDropdowns: {
        ...state.openDropdowns,
        [dropdownId]: !state.openDropdowns[dropdownId],
      },
    })),
  isDropdownOpen: (dropdownId) => {
    const state = get();
    return state.openDropdowns[dropdownId] || false;
  },
  closeAllDropdowns: () => set({ openDropdowns: {} }),

  // Confirm dialogs
  confirmDialog: null,
  showConfirm: (config) => set({ confirmDialog: config }),
  closeConfirm: () => set({ confirmDialog: null }),

  // Search/Filter states
  searchQuery: '',
  setSearchQuery: (query) => set({ searchQuery: query }),
  clearSearchQuery: () => set({ searchQuery: '' }),

  // Filter states
  activeFilters: {},
  setFilter: (filterKey, value) =>
    set((state) => ({
      activeFilters: {
        ...state.activeFilters,
        [filterKey]: value,
      },
    })),
  removeFilter: (filterKey) =>
    set((state) => {
      const { [filterKey]: _, ...rest } = state.activeFilters;
      return { activeFilters: rest };
    }),
  clearAllFilters: () => set({ activeFilters: {} }),

  // Pagination
  currentPage: 1,
  pageSize: 20,
  setCurrentPage: (page) => set({ currentPage: page }),
  setPageSize: (size) => set({ pageSize: size }),
}));

export default useUIStore;
