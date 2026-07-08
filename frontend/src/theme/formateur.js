/**
 * Formateur Module Theme
 * Color Palette: Dark Sage Green + Emerald
 * Personality: Knowledge, Calm, Organization
 * Use for: Teaching Workspace, Classes, Grading, Resources
 */

import { baseTokens } from './base';

export const formateurTheme = {
  ...baseTokens,

  // Formateur-specific color palette
  colors: {
    // Primary colors - Dark Sage Green
    primary: {
      50: '#F0F7F4',
      100: '#D4E6DE',
      200: '#B8D5C8',
      300: '#7FA590',
      400: '#5A8B72',
      500: '#35705A',   // Dark Sage Green base
      600: '#2A5847',
      700: '#1F4034',
      800: '#1C3B2A',   // Dark Sage Green dark (main)
      900: '#0F1F16',
    },

    // Accent colors - Emerald
    accent: {
      50: '#F0FDF4',
      100: '#DCFCE7',
      200: '#BBFBEE',
      300: '#99F6E4',
      400: '#6EE7B7',
      500: '#10B981',   // Emerald (main)
      600: '#059669',
      700: '#047857',
      800: '#065F46',
      900: '#064E3B',
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
      light: '#D1F2EB',
      base: '#14B8A6',
      dark: '#0D9488',
    },

    // Neutral/Gray palette
    neutral: {
      50: '#F8FAFB',
      100: '#F1F5F3',
      200: '#E0EAE6',
      300: '#CED9D3',
      400: '#9DB39D',
      500: '#7A8D82',
      600: '#556B61',
      700: '#3D524A',
      800: '#2A3731',
      900: '#151D1A',
    },

    // Semantic colors
    surface: {
      light: '#F8FAFB',
      base: '#FFFFFF',
      dark: '#1C3B2A',
      hover: '#F1F5F3',
      active: '#E0EAE6',
      disabled: '#F1F5F3',
    },

    // Text colors
    text: {
      primary: '#151D1A',        // Main text
      secondary: '#556B61',      // Secondary text
      tertiary: '#7A8D82',       // Tertiary text
      disabled: '#CED9D3',       // Disabled text
      inverse: '#FFFFFF',        // On dark backgrounds
    },

    // Border colors
    border: {
      light: '#E0EAE6',
      base: '#CED9D3',
      dark: '#9DB39D',
    },

    // Backgrounds
    background: {
      primary: '#FFFFFF',
      secondary: '#F8FAFB',
      tertiary: '#F1F5F3',
    },
  },

  // Formateur-specific component tokens
  components: {
    // Button states
    button: {
      primary: {
        bg: '#10B981',        // Emerald
        bgHover: '#059669',
        bgActive: '#047857',
        text: '#FFFFFF',
      },
      secondary: {
        bg: '#F1F5F3',
        bgHover: '#E0EAE6',
        bgActive: '#CED9D3',
        text: '#151D1A',
        border: '#CED9D3',
      },
      danger: {
        bg: '#EF4444',
        bgHover: '#DC2626',
        bgActive: '#B91C1C',
        text: '#FFFFFF',
      },
      ghost: {
        bg: 'transparent',
        bgHover: '#F1F5F3',
        text: '#151D1A',
      },
    },

    // Input states
    input: {
      bg: '#FFFFFF',
      border: '#CED9D3',
      borderHover: '#9DB39D',
      borderFocus: '#10B981',
      text: '#151D1A',
      placeholder: '#9DB39D',
      disabled: '#F1F5F3',
      error: '#EF4444',
    },

    // Card styles
    card: {
      bg: '#FFFFFF',
      border: '#E0EAE6',
      shadow: '0 4px 6px -1px rgba(12, 39, 29, 0.08)',
      shadowHover: '0 10px 15px -3px rgba(12, 39, 29, 0.12)',
    },

    // Badge colors
    badge: {
      primary: { bg: '#F0FDF4', text: '#065F46' },
      secondary: { bg: '#F1F5F3', text: '#3D524A' },
      success: { bg: '#DCFCE7', text: '#065F46' },
      warning: { bg: '#FEF3C7', text: '#92400E' },
      error: { bg: '#FEE2E2', text: '#991B1B' },
      info: { bg: '#CCFBF1', text: '#134E4A' },
    },

    // Table styles
    table: {
      headerBg: '#F8FAFB',
      headerBorder: '#E0EAE6',
      rowBg: '#FFFFFF',
      rowBgHover: '#F8FAFB',
      rowBorder: '#E0EAE6',
      text: '#151D1A',
    },

    // Modal overlay
    modal: {
      overlayBg: 'rgba(15, 23, 42, 0.5)',
      bg: '#FFFFFF',
      border: '#E0EAE6',
    },
  },

  // Formateur-specific animations & micro-interactions
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

export default formateurTheme;
