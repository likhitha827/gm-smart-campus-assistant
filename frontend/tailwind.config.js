/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        gm: {
          50: '#f0f7ff',
          100: '#e0effe',
          500: '#0052cc',
          600: '#0747a6',
          700: '#003882',
          900: '#091e42'
        }
      },
      keyframes: {
        floaty: {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-6px)' }
        }
      },
      animation: {
        floaty: 'floaty 4s ease-in-out infinite'
      }
    }
  },
  plugins: []
};
