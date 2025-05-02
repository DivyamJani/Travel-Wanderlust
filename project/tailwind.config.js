/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {},
  },
  plugins: [],
};



/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      // Travel-themed colors
      colors: {
        'travel-blue': {
          100: '#E6F0FA',
          200: '#BFDCF5',
          300: '#99C8F0',
          400: '#4DA0E5',
          500: '#0078D4',  // Main brand color
          600: '#006CBE',
          700: '#005EA8',
          800: '#004F8C',
          900: '#003D6F',
        },
        'travel-accent': {
          500: '#F59E0B',  // Warm accent for CTAs
        },
      },
      // Travel-themed font families
      fontFamily: {
        'sans': ['Inter', 'system-ui', 'sans-serif'],
        'display': ['Poppins', 'sans-serif'],
      },
      // Custom spacing for travel layouts
      spacing: {
        '18': '4.5rem',
        '72': '18rem',
        '84': '21rem',
        '96': '24rem',
      },
      // Travel-specific container settings
      container: {
        center: true,
        padding: {
          DEFAULT: '1rem',
          sm: '2rem',
          lg: '4rem',
          xl: '5rem',
          '2xl': '6rem',
        },
      },
      // Animation extensions
      animation: {
        'fade-in': 'fadeIn 0.5s ease-in-out',
        'slide-up': 'slideUp 0.5s ease-in-out',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideUp: {
          '0%': { transform: 'translateY(20px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
      },
      transitionProperty: {
        'all': 'all',
      },
    },
  },
  plugins: [],
}