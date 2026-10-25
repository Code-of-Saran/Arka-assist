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
        // Brown Agricultural Environment
        brown: {
          DEFAULT: '#765341',
          bg: '#765341',
          dark: '#654536',
          light: '#8C6752',
          surface: '#5B3D2F',
        },
        // Deep Green Action / Primary
        forest: {
          DEFAULT: '#0B6623',
          50: '#F0F9F3',
          100: '#DDF0E3',
          200: '#BCE2C7',
          300: '#8DCFA0',
          400: '#4F8F5B',
          500: '#0B6623',
          600: '#08752A',
          700: '#06571E',
          800: '#043D15',
          900: '#02260D',
        },
        deepgreen: {
          DEFAULT: '#0B6623',
          light: '#4F8F5B',
          dark: '#06571E',
        },
        leaf: {
          DEFAULT: '#4F8F5B',
          light: '#72AD7E',
          dark: '#3B7345',
          300: '#95C9A0',
          400: '#72AD7E',
          500: '#4F8F5B',
          600: '#3B7345',
        },
        olive: {
          DEFAULT: '#8A9660',
          light: '#A3B077',
          dark: '#6E7849',
        },
        beige: {
          DEFAULT: '#D8C7AE',
          light: '#E6DBC9',
          dark: '#C7B294',
        },
        khaki: {
          DEFAULT: '#B8A77A',
          light: '#C9BB94',
          dark: '#9E8E62',
        },
        cream: {
          DEFAULT: '#F1E8DF',
          50: '#FFFFFF',
          100: '#F7F2EB',
          200: '#F1E8DF',
          300: '#E5D8CC',
          400: '#D7C7BA',
          500: '#B8A77A',
        },
        terracotta: {
          DEFAULT: '#C46F52',
          light: '#D67F62',
          dark: '#A8573D',
        },
        // Purpose-Specific Semantic Colors
        weather: {
          DEFAULT: '#0284C7',
          light: '#38BDF8',
          dark: '#0369A1',
        },
        market: {
          DEFAULT: '#D97706',
          light: '#FBBF24',
          dark: '#B45309',
        },
        voice: {
          DEFAULT: '#0B6623',
          light: '#4F8F5B',
          dark: '#06571E',
        },
        sell: {
          DEFAULT: '#C46F52',
          light: '#D67F62',
          dark: '#A8573D',
        },
        wait: {
          DEFAULT: '#0B6623',
          light: '#4F8F5B',
          dark: '#06571E',
        },
      },
      fontFamily: {
        sans: ['Plus Jakarta Sans', 'Noto Sans Tamil', '-apple-system', 'BlinkMacSystemFont', 'sans-serif'],
      },
      boxShadow: {
        'glass': '0 10px 30px rgba(0, 0, 0, 0.15), inset 0 1px 0 rgba(255, 255, 255, 0.12)',
        'glass-hover': '0 15px 35px rgba(0, 0, 0, 0.25), inset 0 1px 0 rgba(255, 255, 255, 0.20)',
        'glass-button': '0 8px 20px rgba(11, 102, 35, 0.28), inset 0 1px 0 rgba(255, 255, 255, 0.25)',
        'glass-card': '0 12px 30px rgba(0, 0, 0, 0.20), inset 0 1px 0 rgba(255, 255, 255, 0.15)',
      },
      animation: {
        'fade-in': 'fadeIn 0.3s ease-out forwards',
        'fade-in-up': 'fadeInUp 0.45s cubic-bezier(0.16, 1, 0.3, 1) forwards',
        'float-slow': 'floatSlow 6s ease-in-out infinite',
        'zoom-subtle': 'zoomSubtle 20s ease-in-out infinite alternate',
        'pulse-glow': 'pulseGlow 3s ease-in-out infinite',
      },
      keyframes: {
        floatSlow: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-10px)' },
        },
        zoomSubtle: {
          '0%': { transform: 'scale(1)' },
          '100%': { transform: 'scale(1.06)' },
        },
        pulseGlow: {
          '0%, 100%': { opacity: '0.6', transform: 'scale(1)' },
          '50%': { opacity: '1', transform: 'scale(1.02)' },
        },
      },
    },
  },
  plugins: [],
};
