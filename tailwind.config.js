/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        woody: {
          50: '#FBF9F5',
          100: '#F5F2EB',
          200: '#E5DFD3',
          300: '#C8BCAB',
          400: '#A4937B',
          500: '#8B5A2B', // Primary Wood
          600: '#704214', // Dark Rich Wood
          700: '#54320F',
          800: '#3A210A',
        },
        nature: {
          sage: '#A3B18E',
          moss: '#588157',
          forest: '#3A5A40',
          dark: '#283618',
          cream: '#FEFAE0',
        }
      },
      borderRadius: {
        'ios': '1.75rem',
        'ios-sm': '1rem',
      }
    },
  },
  plugins: [],
}