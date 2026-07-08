/**
 * Auth Store (Zustand)
 * Manages authentication state across the application
 * Handles: user login, logout, permissions, role-based access
 */

import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export const useAuthStore = create(
  persist(
    (set) => ({
      // State
      user: null,
      token: null,
      role: null, // 'admin', 'formateur', 'student'
      isAuthenticated: false,
      isLoading: false,
      error: null,

      // Actions
      setUser: (user) =>
        set({
          user,
          isAuthenticated: !!user,
        }),

      setToken: (token) =>
        set({
          token,
          isAuthenticated: !!token,
        }),

      setRole: (role) =>
        set({ role }),

      setLoading: (isLoading) =>
        set({ isLoading }),

      setError: (error) =>
        set({ error }),

      login: async (credentials, loginFn) => {
        set({ isLoading: true, error: null });
        try {
          const response = await loginFn(credentials);
          set({
            user: response.user,
            token: response.token,
            role: response.role,
            isAuthenticated: true,
            isLoading: false,
          });
          return response;
        } catch (err) {
          set({
            error: err.message || 'Login failed',
            isLoading: false,
          });
          throw err;
        }
      },

      logout: () =>
        set({
          user: null,
          token: null,
          role: null,
          isAuthenticated: false,
          error: null,
        }),

      clearError: () =>
        set({ error: null }),

      // Check if user has specific permission
      hasPermission: (permission) => {
        // This can be expanded based on your permission system
        return true; // Placeholder
      },

      // Check if user is admin
      isAdmin: () => (state) => state.role === 'admin',
      isFormateur: () => (state) => state.role === 'formateur',
      isStudent: () => (state) => state.role === 'student',
    }),
    {
      name: 'auth-storage', // Name of localStorage key
      partialize: (state) => ({
        user: state.user,
        token: state.token,
        role: state.role,
        isAuthenticated: state.isAuthenticated,
      }),
    }
  )
);

export default useAuthStore;
