/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{vue,js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          light: '#E57373',
          DEFAULT: '#E57373',
          dark: '#C62828',
        },
        secondary: {
          light: '#81C784',
          DEFAULT: '#81C784',
          dark: '#2E7D32',
        },
        accent: '#FFB74D',
        background: '#FFF8F0',
      },
      fontFamily: {
        sans: ['Poppins', 'sans-serif'],
        display: ['Playfair Display', 'serif'],
      },
    },
  },
  plugins: [],
}