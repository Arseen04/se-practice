/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Nunito', 'ui-rounded', 'system-ui', 'sans-serif'],
      },
      colors: {
        cream: { 50: '#FBF9F4', 100: '#F4F1EA' },
        ink: { 500: '#6E6A7C', 700: '#4B4758', 900: '#262334' },
        lavender: { 100: '#ECE8FB', 200: '#DCD5F6', 700: '#5B4FA8' },
        coral: { 100: '#FDE3DC', 600: '#C9503C', 700: '#A93F2D' },
        mint: { 100: '#D5F3E6', 200: '#B5E8D2', 800: '#1F5C44' },
        sky: { 100: '#DCEEFD', 800: '#1F4A6E' },
        peach: { 100: '#FDE9D2', 800: '#7A4A1C' },
      },
      boxShadow: {
        soft: '0 12px 32px -14px rgba(38, 35, 52, 0.22)',
      },
      keyframes: {
        'fade-up': {
          '0%': { opacity: '0', transform: 'translateY(8px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
      },
      animation: {
        'fade-up': 'fade-up 0.4s ease-out both',
      },
    },
  },
  plugins: [],
};
