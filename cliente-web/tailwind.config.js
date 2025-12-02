/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          50: '#fdf8f3',
          100: '#faf0e6',
          200: '#f4e0c8',
          300: '#ecc99a',
          400: '#e2a85f',
          500: '#d8943a',
          600: '#c97a2a',
          700: '#a85f25',
          800: '#8a4c25',
          900: '#724023',
        },
        coffee: {
          50: '#fdf8f3',
          100: '#faf0e6',
          200: '#f4e0c8',
          300: '#ecc99a',
          400: '#e2a85f',
          500: '#8B4513',
          600: '#7a3d11',
          700: '#69350f',
          800: '#582d0d',
          900: '#47250b',
        },
        crepe: {
          50: '#fefcf8',
          100: '#fdf9f0',
          200: '#faf0d8',
          300: '#f6e3b8',
          400: '#f0d08c',
          500: '#e8b85a',
          600: '#dda23a',
          700: '#b87f2e',
          800: '#94652a',
          900: '#785426',
        },
        accent: {
          red: '#dc2626',
          brown: '#8B4513',
          tan: '#d2b48c',
        }
      },
      fontFamily: {
        'serif': ['Georgia', 'serif'],
        'elegant': ['Playfair Display', 'Georgia', 'serif'],
        'logo': ['Crimson Text', 'Georgia', 'serif'],
      },
      backgroundImage: {
        'gradient-crepe': 'linear-gradient(135deg, #fefcf8 0%, #fdf9f0 100%)',
        'gradient-coffee': 'linear-gradient(135deg, #fdf8f3 0%, #faf0e6 100%)',
        'gradient-warm': 'linear-gradient(135deg, #fefcf8 0%, #fdf8f3 50%, #faf0e6 100%)',
      }
    },
  },
  plugins: [],
} 