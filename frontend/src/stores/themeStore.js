/**
 * Theme Store (Zustand)
 * Manages theme and color palette state
 * Handles: current module theme, dark mode toggle, color scheme switching
 */

import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { adminTheme } from '../theme/admin';
import { formateurTheme } from '../theme/formateur';
import { studentTheme } from '../theme/student';

const THEME_MODULES = {
  admin: adminTheme,
  formateur: formateurTheme,
  student: studentTheme,
};

export const useThemeStore = create(
  persist(
    (set, get) => ({
      // State
      currentModule: 'admin', // Current active module theme
      currentTheme: adminTheme,
      isDarkMode: false,
      themes: THEME_MODULES,

      // Actions
      setModule: (module) => {
        if (THEME_MODULES[module]) {
          set({
            currentModule: module,
            currentTheme: THEME_MODULES[module],
          });
        }
      },

      switchToAdmin: () =>
        set({
          currentModule: 'admin',
          currentTheme: THEME_MODULES.admin,
        }),

      switchToFormateur: () =>
        set({
          currentModule: 'formateur',
          currentTheme: THEME_MODULES.formateur,
        }),

      switchToStudent: () =>
        set({
          currentModule: 'student',
          currentTheme: THEME_MODULES.student,
        }),

      toggleDarkMode: () =>
        set((state) => ({
          isDarkMode: !state.isDarkMode,
        })),

      setDarkMode: (isDark) =>
        set({ isDarkMode: isDark }),

      // Get current theme colors
      getColors: () => get().currentTheme.colors,

      // Get current theme components
      getComponents: () => get().currentTheme.components,

      // Get specific color
      getColor: (colorPath) => {
        const theme = get().currentTheme;
        const parts = colorPath.split('.');
        let value = theme.colors;

        for (const part of parts) {
          if (value && typeof value === 'object') {
            value = value[part];
          } else {
            return null;
          }
        }

        return value;
      },

      // Get component color
      getComponentColor: (componentPath) => {
        const theme = get().currentTheme;
        const parts = componentPath.split('.');
        let value = theme.components;

        for (const part of parts) {
          if (value && typeof value === 'object') {
            value = value[part];
          } else {
            return null;
          }
        }

        return value;
      },

      // Get all available modules
      getAvailableModules: () => Object.keys(THEME_MODULES),
    }),
    {
      name: 'theme-storage', // Name of localStorage key
      partialize: (state) => ({
        currentModule: state.currentModule,
        isDarkMode: state.isDarkMode,
      }),
    }
  )
);

export default useThemeStore;
