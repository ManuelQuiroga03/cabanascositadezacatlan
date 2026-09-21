/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        forest: {
          dark: '#1E3A2B',
          DEFAULT: '#2D5A40',
          light: '#427A59',
        },
        wood: {
          DEFAULT: '#8B4513',
          dark: '#5C2E0B',
          light: '#A0522D',
        },
        terracotta: {
          DEFAULT: '#C86D51',
          light: '#E29578',
        },
        stone: {
          light: '#F4F6F0',
          muted: '#E6E9E0',
          charcoal: '#2C302E',
        },
        warmGold: {
          DEFAULT: '#DAA520',
          hover: '#B8860B',
        }
      },
      fontFamily: {
        serif: ['Georgia', 'Cambria', 'serif'],
        sans: ['Inter', 'system-ui', 'sans-serif'],
      }
    },
  },
  plugins: [],
}
