const defaultTheme = require('tailwindcss/defaultTheme');
const colors = require('tailwindcss/colors');

module.exports = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx}',
    './src/components/**/*.{js,ts,jsx,tsx}',
  ],
  theme: {
    extend: {
      colors: {
        'royal-red': {
          100: '#ff0000',
          200: '#c80000',
          300: '#c80000',
          400: '#c80000',
          500: '#b10000',
          600: '#b10000',
          700: '#b10000',
          800: '#7b0000',
          900: '#300000',
        },
      },
      fontFamily: {
        sans: ['Quicksand', ...defaultTheme.fontFamily.sans],
      },
      maxWidth: {
        '8xl': '90rem',
      },
    },
  },
  plugins: [require('@tailwindcss/typography')],
};
