/**
 * Student Module Theme
 * Color Palette: Deep Purple + Indigo
 * Personality: Learning, Energy, Modernity
 * Use for: Student Dashboard, Resources, Discussions, Submissions
 */

import { baseTokens } from './base';

export const studentTheme = {
  ...baseTokens,

  // Student-specific color palette
  colors: {
    // Primary colors - Deep Purple
    primary: {
      50: '#FAF5FF',
      100: '#F3E8FF',
      200: '#E9D5FF',
      300: '#D8B4FE',
      400: '#C084FC',
      500: '#A855F7',   // Purple base
      600: '#9333EA',
      700: '#7E22CE',
      800: '#6B21A8',
      900: '#3F0F5C',   // Deep Purple dark
    },

    // Accent colors - Indigo
    accent: {
      50: '#EEF2FF',
      100: '#E0E7FF',
      200: '#C7D2FE',
      300: '#A5B4FC',
      400: '#818CF8',
      500: '#6366F1',   // Indigo (main)
      600: '#4F46E5',
      700: '#4338CA',
      800: '#3730A3',
      900: '#312E81',
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
      light: '#E0E7FF',
      base: '#6366F1',
      dark: '#4338CA',
    },

    // Neutral/Gray palette with purple tint
    neutral: {
      50: '#FAFBFF',
      100: '#F3F4F8',
      200: '#E5E7F0',
      300: '#D1D5DB',
      400: '#9CA3AF',
      500: '#6B7280',
      600: '#4B5563',
      700: '#374151',
      800: '#1F2937',
      900: '#0F172A',
    },

    // Semantic colors
    surface: {
      light: '#FAFBFF',
      base: '#FFFFFF',
      dark: '#1E1040',
      hover: '#F3F4F8',
      active: '#E5E7F0',
      disabled: '#F3F4F8',
    },

    // Text colors
    text: {
      primary: '#0F172A',        // Main text
      secondary: '#4B5563',      // Secondary text
      tertiary: '#9CA3AF',       // Tertiary text
      disabled: '#D1D5DB',       // Disabled text
      inverse: '#FFFFFF',        // On dark backgrounds
    },

    // Border colors
    border: {
      light: '#E5E7F0',
      base: '#D1D5DB',
      dark: '#9CA3AF',
    },

    // Backgrounds
    background: {
      primary: '#FFFFFF',
      secondary: '#FAFBFF',
      tertiary: '#F3F4F8',
    },
  },

  // Student-specific component tokens
  components: {
    // Button states
    button: {
      primary: {
        bg: '#6366F1',        // Indigo
        bgHover: '#4F46E5',
        bgActive: '#4338CA',
        text: '#FFFFFF',
      },
      secondary: {
        bg: '#F3F4F8',
        bgHover: '#E5E7F0',
        bgActive: '#D1D5DB',
        text: '#0F172A',
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
        bgHover: '#F3F4F8',
        text: '#0F172A',
      },
    },

    // Input states
    input: {
      bg: '#FFFFFF',
      border: '#D1D5DB',
      borderHover: '#9CA3AF',
      borderFocus: '#6366F1',
      text: '#0F172A',
      placeholder: '#9CA3AF',
      disabled: '#F3F4F8',
      error: '#EF4444',
    },

    // Card styles
    card: {
      bg: '#FFFFFF',
      border: '#E5E7F0',
      shadow: '0 4px 6px -1px rgba(30, 16, 64, 0.08)',
      shadowHover: '0 10px 15px -3px rgba(30, 16, 64, 0.12)',
    },

    // Badge colors
    badge: {
      primary: { bg: '#EEF2FF', text: '#3730A3' },
      secondary: { bg: '#F3F4F8', text: '#374151' },
      success: { bg: '#D1FAE5', text: '#047857' },
      warning: { bg: '#FEF3C7', text: '#92400E' },
      error: { bg: '#FEE2E2', text: '#991B1B' },
      info: { bg: '#E0E7FF', text: '#3730A3' },
    },

    // Table styles
    table: {
      headerBg: '#FAFBFF',
      headerBorder: '#E5E7F0',
      rowBg: '#FFFFFF',
      rowBgHover: '#FAFBFF',
      rowBorder: '#E5E7F0',
      text: '#0F172A',
    },

    // Modal overlay
    modal: {
      overlayBg: 'rgba(30, 16, 64, 0.5)',
      bg: '#FFFFFF',
      border: '#E5E7F0',
    },
  },

  // Student-specific animations & micro-interactions (more playful)
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
    pulse: {
      duration: '2s',
      timingFunction: 'cubic-bezier(0.4, 0, 0.6, 1)',
    },
  },
};

export default studentTheme;
