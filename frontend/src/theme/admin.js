/**
 * Admin Module Theme
 * Color Palette: Deep Navy + Royal Blue
 * Personality: Authority, Control, Professionalism
 * Use for: Dashboard, User Management, Pedagogy Management, Scheduling
 */

import { baseTokens } from './base';

export const adminTheme = {
  ...baseTokens,

  // Admin-specific color palette
  colors: {
    // Primary colors - Deep Navy
    primary: {
      50: '#F0F4F9',
      100: '#D4DDE8',
      200: '#B8C6D7',
      300: '#7A94B0',
      400: '#5A7B95',
      500: '#3A617A',   // Deep Navy base
      600: '#2B4860',
      700: '#1C2F45',
      800: '#0F172A',   // Deep Navy dark (main)
      900: '#0A0F1A',
    },

    // Accent colors - Royal Blue
    accent: {
      50: '#EEF5FF',
      100: '#D4E6FF',
      200: '#A8CCFF',
      300: '#7CB3FF',
      400: '#5199FF',
      500: '#2563EB',   // Royal Blue (main)
      600: '#1D4ED8',
      700: '#1E40AF',
      800: '#1E3A8A',
      900: '#172554',
    },

    // Status colors
    success: {
      light: '#D1FAE5',
      base: '#10B981',
      dark: '#047857',
    },
    warning: {
      light: '#FEF3C7',
      base: '#F59E0B',
      dark: '#D97706',
    },
    error: {
      light: '#FEE2E2',
      base: '#EF4444',
      dark: '#DC2626',
    },
    info: {
      light: '#DBEAFE',
      base: '#3B82F6',
      dark: '#1D4ED8',
    },

    // Neutral/Gray palette
    neutral: {
      50: '#F9FAFB',
      100: '#F3F4F6',
      200: '#E5E7EB',
      300: '#D1D5DB',
      400: '#9CA3AF',
      500: '#6B7280',
      600: '#4B5563',
      700: '#374151',
      800: '#1F2937',
      900: '#111827',
    },

    // Semantic colors
    surface: {
      light: '#F9FAFB',
      base: '#FFFFFF',
      dark: '#0F172A',
      hover: '#F3F4F6',
      active: '#E5E7EB',
      disabled: '#F3F4F6',
    },

    // Text colors
    text: {
      primary: '#111827',        // Main text
      secondary: '#6B7280',      // Secondary text
      tertiary: '#9CA3AF',       // Tertiary text
      disabled: '#D1D5DB',       // Disabled text
      inverse: '#FFFFFF',        // On dark backgrounds
    },

    // Border colors
    border: {
      light: '#E5E7EB',
      base: '#D1D5DB',
      dark: '#9CA3AF',
    },

    // Backgrounds
    background: {
      primary: '#FFFFFF',
      secondary: '#F9FAFB',
      tertiary: '#F3F4F6',
    },
  },

  // Admin-specific component tokens
  components: {
    // Button states
    button: {
      primary: {
        bg: '#2563EB',        // Royal Blue
        bgHover: '#1D4ED8',
        bgActive: '#1E40AF',
        text: '#FFFFFF',
      },
      secondary: {
        bg: '#F3F4F6',
        bgHover: '#E5E7EB',
        bgActive: '#D1D5DB',
        text: '#111827',
        border: '#D1D5DB',
      },
      danger: {
        bg: '#EF4444',
        bgHover: '#DC2626',
        bgActive: '#B91C1C',
        text: '#FFFFFF',
      },
      ghost: {
        bg: 'transparent',
        bgHover: '#F3F4F6',
        text: '#111827',
      },
    },

    // Input states
    input: {
      bg: '#FFFFFF',
      border: '#D1D5DB',
      borderHover: '#9CA3AF',
      borderFocus: '#2563EB',
      text: '#111827',
      placeholder: '#9CA3AF',
      disabled: '#F3F4F6',
      error: '#EF4444',
    },

    // Card styles
    card: {
      bg: '#FFFFFF',
      border: '#E5E7EB',
      shadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
      shadowHover: '0 10px 15px -3px rgba(0, 0, 0, 0.1)',
    },

    // Badge colors
    badge: {
      primary: { bg: '#EEF5FF', text: '#1E3A8A' },
      secondary: { bg: '#F3F4F6', text: '#374151' },
      success: { bg: '#D1FAE5', text: '#047857' },
      warning: { bg: '#FEF3C7', text: '#92400E' },
      error: { bg: '#FEE2E2', text: '#991B1B' },
      info: { bg: '#DBEAFE', text: '#1E40AF' },
    },

    // Table styles
    table: {
      headerBg: '#F9FAFB',
      headerBorder: '#E5E7EB',
      rowBg: '#FFFFFF',
      rowBgHover: '#F9FAFB',
      rowBorder: '#E5E7EB',
      text: '#111827',
    },

    // Modal overlay
    modal: {
      overlayBg: 'rgba(0, 0, 0, 0.5)',
      bg: '#FFFFFF',
      border: '#E5E7EB',
    },
  },

  // Admin-specific animations & micro-interactions
  animations: {
    fadeIn: {
      duration: '300ms',
      timingFunction: 'ease-in-out',
    },
    slideUp: {
      duration: '300ms',
      timingFunction: 'cubic-bezier(0.4, 0, 0.2, 1)',
    },
    slideDown: {
      duration: '300ms',
      timingFunction: 'cubic-bezier(0.4, 0, 0.2, 1)',
    },
    slideIn: {
      duration: '300ms',
      timingFunction: 'cubic-bezier(0.4, 0, 0.2, 1)',
    },
    scaleIn: {
      duration: '200ms',
      timingFunction: 'ease-out',
    },
  },
};

export default adminTheme;
