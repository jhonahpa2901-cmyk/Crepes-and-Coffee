/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        coffee: {
          50: '#fdf8f3',
          100: '#faf0e6',
          200: '#f4e0c8',
          300: '#ecc99a',
          400: '#e2a85f',
          500: '#d8943a',
          600: '#8B4513',
          700: '#7a3d11',
          800: '#69350f',
          900: '#582d0d',
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
      },
      animation: {
        'fade-in': 'fadeIn 0.3s ease-out',
        'slide-in': 'slideIn 0.3s ease-out',
        'pulse-slow': 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0', transform: 'translateY(10px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        slideIn: {
          '0%': { opacity: '0', transform: 'translateX(-20px)' },
          '100%': { opacity: '1', transform: 'translateX(0)' },
        },
      },
      boxShadow: {
        'coffee': '0 4px 6px -1px rgba(139, 69, 19, 0.1), 0 2px 4px -1px rgba(139, 69, 19, 0.06)',
        'coffee-lg': '0 10px 15px -3px rgba(139, 69, 19, 0.1), 0 4px 6px -2px rgba(139, 69, 19, 0.05)',
      },
    },
  },
  plugins: [],
} 