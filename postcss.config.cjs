module.exports = {
  plugins: {
    tailwindcss: {},
    autoprefixer: {},
    'postcss-color-mod-function': {
      importFrom: ['src/styles/colors.scss'],
    },
  },
};
