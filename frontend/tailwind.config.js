/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          light: '#5a9ef0',
          DEFAULT: '#3783e6',
          dark: '#2563c4',
        },
        secondary: {
          light: '#8fa4bf',
          DEFAULT: '#4a6080',
          dark: '#0f1e2e',
        },
        accent: {
          teal: '#00a896',
          purple: '#7c3aed',
        },
        surface: {
          light: '#f4f7fb',
          DEFAULT: '#ffffff',
          dark: '#0d2744',
        }
      },
      fontFamily: {
        display: ['Outfit', 'system-ui', 'sans-serif'],
        sans: ['Plus Jakarta Sans', 'system-ui', 'sans-serif'],
      },
      borderRadius: {
        'xl': '1rem',
        '2xl': '1.5rem',
        '3xl': '2rem',
      },
      boxShadow: {
        'premium': '0 12px 32px rgba(13, 39, 68, 0.08), 0 4px 8px rgba(13, 39, 68, 0.04)',
        'premium-hover': '0 20px 48px rgba(13, 39, 68, 0.12), 0 6px 12px rgba(13, 39, 68, 0.06)',
      },
      keyframes: {
        'fade-up': {
          '0%': { opacity: '0', transform: 'translateY(20px) scale(0.98)' },
          '100%': { opacity: '1', transform: 'translateY(0) scale(1)' },
        },
        'shimmer': {
          '0%': { backgroundPosition: '-200% 0' },
          '100%': { backgroundPosition: '200% 0' },
        }
      },
      animation: {
        'fade-up': 'fade-up 0.5s cubic-bezier(0.16, 1, 0.3, 1) forwards',
        'shimmer': 'shimmer 2s infinite',
      }
    },
  },
  darkMode: 'class',
  plugins: [],
}
