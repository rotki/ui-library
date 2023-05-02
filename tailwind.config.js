/** @type {import('tailwindcss').Config} */
module.exports = {
  mode: 'jit',
  content: ['./src/**/*.vue'],
  theme: {
    extend: {
      colors: {
        'rui-primary': {
          300: 'rgb(var(--rui-primary-light) / <alpha-value>)',
          500: 'rgb(var(--rui-primary) / <alpha-value>)',
          600: 'rgb(var(--rui-primary-dark) / <alpha-value>)'
        },
        'rui-secondary': {
          300: 'rgb(var(--rui-secondary-light) / <alpha-value>)',
          500: 'rgb(var(--rui-secondary) / <alpha-value>)',
          600: 'rgb(var(--rui-secondary-dark) / <alpha-value>)'
        },
        'rui-error': {
          300: 'rgb(var(--rui-error-light) / <alpha-value>)',
          500: 'rgb(var(--rui-error) / <alpha-value>)',
          600: 'rgb(var(--rui-error-dark) / <alpha-value>)'
        }
      }
    }
  },
  plugins: []
};
