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
        'cyber-yellow': '#FDE047',
        'cyber-yellow-hover': '#FACC15',
        'void': '#0A0A0A',
        'charcoal': '#141414',
        'charcoal-surface': '#171717',
        'charcoal-border': '#262626',
        phantom: {
          bg: '#0A0A0A',
          surface: '#141414',
          border: '#262626',
          text: '#FFFFFF',
          muted: '#A3A3A3',
          subtle: '#737373',
          yellow: '#FDE047',
          red: '#EF4444',
          emerald: '#10B981',
          amber: '#F59E0B',
        }
      },
      borderRadius: {
        '28': '28px',
        '32': '32px',
        '36': '36px',
        '40': '40px',
        '100': '100px',
        '120': '120px',
        '140': '140px',
      },
      fontFamily: {
        sans: ['"Plus Jakarta Sans"', 'Inter', '-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'Roboto', 'sans-serif'],
        mono: ['"JetBrains Mono"', 'Fira Code', 'Courier New', 'monospace'],
        serif: ['"Source Serif 4"', 'Georgia', 'serif'],
      },
      animation: {
        'float': 'float 6s ease-in-out infinite',
        'float-delayed': 'float 6s ease-in-out 3s infinite',
        'pulse-slow': 'pulse 4s cubic-bezier(0.4, 0, 0.6, 1) infinite',
      },
      keyframes: {
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-10px)' },
        }
      }
    },
  },
  plugins: [],
}
