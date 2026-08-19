/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        gm: { 50: '#f0f7ff', 100: '#e0effe', 500: '#0052cc', 600: '#0747a6', 700: '#003882', 900: '#091e42' }
      }
    }
  },
  plugins: []
};
