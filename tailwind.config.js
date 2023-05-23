const {
  baseColors,
  baseColorsIntensities,
  contextColors
} = require('./src/consts/colors');

const isDevelopment = process.env.NODE_ENV === 'development';

const baseColorsCombination = Object.fromEntries(
  baseColors.map(color => [
    color,
    Object.fromEntries(
      baseColorsIntensities.map(intensity => [
        intensity,
        `rgba(var(--rui-${color}-${intensity}), <alpha-value>)`
      ])
    )
  ])
);

const contextColorsCombination = Object.fromEntries(
  ['light', 'dark'].map(theme => [
    theme,
    Object.fromEntries(
      contextColors.map(color => [
        color,
        {
          DEFAULT: `rgba(var(--rui-${theme}-${color}-main), <alpha-value>)`,
          darker: `rgba(var(--rui-${theme}-${color}-darker), <alpha-value>)`,
          lighter: `rgba(var(--rui-${theme}-${color}-lighter), <alpha-value>)`
        }
      ])
    )
  ])
);

const adaptiveContextColorCombination = Object.fromEntries(
  contextColors.map(color => [
    color,
    {
      DEFAULT: `rgba(var(--rui-${color}-main), <alpha-value>)`,
      darker: `rgba(var(--rui-${color}-darker), <alpha-value>)`,
      lighter: `rgba(var(--rui-${color}-lighter), <alpha-value>)`
    }
  ])
);

/** @type {import('tailwindcss').Config} */
module.exports = {
  mode: 'jit',
  content: ['./src/**/*.vue', ...(!isDevelopment ? [] : ['./src/**/*.mdx'])],
  theme: {
    extend: {
      colors: {
        rui: {
          ...baseColorsCombination,
          ...contextColorsCombination,
          ...adaptiveContextColorCombination
        }
      }
    }
  },
  safelist: !isDevelopment
    ? []
    : [
        {
          pattern: new RegExp(
            `(bg|text|border)-rui-(${baseColors.join(
              '|'
            )})(-(${baseColorsIntensities.join('|')}))?`
          ),
          variants: ['important', 'hover', 'disabled', 'active', 'focus']
        },
        {
          pattern: new RegExp(
            `(bg|text|border)-rui-(light|dark)-(${contextColors.join(
              '|'
            )})(-(darker|lighter))?`
          ),
          variants: ['important', 'hover', 'disabled', 'active', 'focus']
        },
        {
          pattern: new RegExp(
            `(bg|text|border)-rui-(${contextColors.join(
              '|'
            )})(-(darker|lighter))?`
          ),
          variants: ['important', 'hover', 'disabled', 'active', 'focus']
        }
      ],
  plugins: []
};
