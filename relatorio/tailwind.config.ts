import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './index.html',
    './src/**/*.{js,ts,jsx,tsx}',
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: '#2D2D8F',
          50: '#EEEEFF',
          100: '#DCDCFF',
          200: '#ABABEF',
          300: '#7A7ACF',
          400: '#4A4AAF',
          500: '#2D2D8F',
          600: '#222275',
          700: '#18185B',
          800: '#0E0E41',
          900: '#040427',
        },
        orange: {
          DEFAULT: '#F97316',
          50: '#FFF7ED',
          500: '#F97316',
          600: '#EA580C',
        },
      },
      fontFamily: {
        sans: ['Montserrat', 'system-ui', 'sans-serif'],
      },
    },
  },
  plugins: [],
}

export default config
