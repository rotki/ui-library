/** @type {import('tailwindcss').Config} */
module.exports = {
  mode: 'jit',
  content: ['./src/**/*.vue'],
  theme: {
    extend: {
      colors: {
        brown: '#7E4A3B'
      }
    }
  },
  safelist: [
    {
      pattern: /(bg|text|border)-(brown)(-(100|200|300|400|500))?/,
      variants: ['important', 'hover', 'disabled', 'active', 'focus']
    }
  ],
  plugins: []
};
