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
        phantom: {
          bg: '#FAFAF9',
          surface: '#FFFFFF',
          border: '#E7E5E4',
          text: '#1C1917',
          muted: '#78716C',
          subtle: '#A8A29E',
          indigo: '#4F46E5',
          'indigo-light': '#EEF2FF',
          red: '#DC2626',
          'red-light': '#FEF2F2',
          amber: '#D97706',
          'amber-light': '#FFFBEB',
          emerald: '#059669',
          'emerald-light': '#ECFDF5',
        }
      },
      fontFamily: {
        sans: ['Inter', '-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'Roboto', 'sans-serif'],
        mono: ['JetBrains Mono', 'Fira Code', 'Courier New', 'monospace'],
        serif: ['Source Serif 4', 'Georgia', 'serif'],
      }
    },
  },
  plugins: [],
}
