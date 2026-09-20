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
        forest: {
          50: '#F0F7F2',
          100: '#DCEEE2',
          200: '#BDDEC7',
          300: '#94C7A3',
          400: '#64AC7A',
          500: '#3D8F57',
          600: '#2E7D44',
          700: '#226336',
          800: '#1A4F2C',
          900: '#154125',
          950: '#0B2313',
        },
        leaf: {
          50: '#F2F9ED',
          100: '#E1F2D6',
          200: '#C5E6B2',
          300: '#A1D487',
          400: '#7BBE5C',
          500: '#5BA33C',
          600: '#46832D',
          700: '#366624',
          800: '#2C511F',
          900: '#26441D',
        },
        earth: {
          50: '#F9F6F0',
          100: '#EFE9DE',
          200: '#DFD3C0',
          300: '#CBBA9E',
          400: '#B59C7C',
          500: '#9E805E',
          600: '#846648',
          700: '#6A5038',
          800: '#564230',
          900: '#473729',
          950: '#271D15',
        },
        soil: {
          50: '#FAF5F2',
          100: '#F3E8E2',
          200: '#E7D3C7',
          300: '#D6B7A4',
          400: '#C1967E',
          500: '#A87960',
          600: '#8D5F48',
          700: '#714B39',
          800: '#5D3E30',
          900: '#4D3429',
          950: '#2B1A13',
        },
        cream: {
          50: '#FDFCF9',
          100: '#FBF9F4',
          200: '#F5EFE6',
          300: '#EDE4D3',
          400: '#DFD3BC',
          500: '#CFC0A4',
        },
        darkbg: {
          base: '#0B1610',
          card: '#12241A',
          cardHover: '#172E21',
          surface: '#1A3324',
          border: '#244531',
          borderLight: '#2F593F',
          muted: '#8BA695'
        }
      },
      fontFamily: {
        sans: ['Plus Jakarta Sans', 'Inter', 'system-ui', 'sans-serif'],
        tamil: ['Noto Sans Tamil', 'Plus Jakarta Sans', 'system-ui', 'sans-serif'],
      },
      boxShadow: {
        'soft': '0 4px 20px -2px rgba(15, 64, 36, 0.08)',
        'soft-lg': '0 10px 30px -4px rgba(15, 64, 36, 0.12)',
        'glow-green': '0 0 25px -5px rgba(76, 175, 80, 0.3)',
        'glow-leaf': '0 0 25px -5px rgba(91, 163, 60, 0.35)',
      },
      animation: {
        'pulse-subtle': 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'float': 'float 4s ease-in-out infinite',
      },
      keyframes: {
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-6px)' },
        }
      }
    },
  },
  plugins: [],
}
