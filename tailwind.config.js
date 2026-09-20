/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        base: {
          light: '#FAFAF9',
          dark: '#18181B',
        },
        surface: {
          light: '#FFFFFF',
          dark: '#27272A',
        },
        border: {
          light: '#E7E5E4',
          dark: '#3F3F46',
        },
        primary: {
          light: '#1C1917',
          dark: '#F4F4F5',
        },
        secondary: {
          light: '#78716C',
          dark: '#A1A1AA',
        },
        accent: {
          DEFAULT: '#4F46E5',
          hover: '#4338CA',
          tint: '#EEF2FF',
          darkTint: 'rgba(79, 70, 229, 0.15)',
        },
        threat: {
          DEFAULT: '#DC2626',
          light: '#FEF2F2',
          dark: 'rgba(220, 38, 38, 0.15)',
        },
        safe: {
          DEFAULT: '#059669',
          light: '#ECFDF5',
          dark: 'rgba(5, 150, 105, 0.15)',
        },
        warning: {
          DEFAULT: '#D97706',
          light: '#FFFBEB',
          dark: 'rgba(217, 119, 6, 0.15)',
        },
      },
      fontFamily: {
        sans: ['Inter', 'sans-serif'],
        mono: ['"JetBrains Mono"', 'monospace'],
        serif: ['"Source Serif 4"', 'serif'],
      },
      spacing: {
        '1': '8px',
        '2': '16px',
        '3': '24px',
        '4': '32px',
        '6': '48px',
        '8': '64px',
      },
      borderRadius: {
        'card': '12px',
      },
      maxWidth: {
        'page': '1440px',
      },
      transitionDuration: {
        '150': '150ms',
        '200': '200ms',
      },
    },
  },
  plugins: [],
}
