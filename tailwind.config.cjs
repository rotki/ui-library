const plugin = require('tailwindcss/plugin');
const {
  baseColors,
  baseColorsIntensities,
  contextColors,
} = require('./src/consts/colors');

const isDevelopment =
  process.env.NODE_ENV === 'development' || process.env.STORYBOOK;

const baseColorsCombination = Object.fromEntries(
  baseColors.map((color) => [
    color,
    Object.fromEntries(
      baseColorsIntensities.map((intensity) => [
        intensity,
        `rgba(var(--rui-${color}-${intensity}), <alpha-value>)`,
      ]),
    ),
  ]),
);

const contextColorsCombination = Object.fromEntries(
  ['light', 'dark'].map((theme) => [
    theme,
    Object.fromEntries(
      contextColors.map((color) => [
        color,
        {
          DEFAULT: `rgba(var(--rui-${theme}-${color}-main), <alpha-value>)`,
          darker: `rgba(var(--rui-${theme}-${color}-darker), <alpha-value>)`,
          lighter: `rgba(var(--rui-${theme}-${color}-lighter), <alpha-value>)`,
          tint: `color-mix(in srgb, white calc(<alpha-value> * 100%), rgb(var(--rui-${theme}-${color}-main)))`,
          shade: `color-mix(in srgb, black calc(<alpha-value> * 100%), rgb(var(--rui-${theme}-${color}-main)))`,
        },
      ]),
    ),
  ]),
);

const adaptiveContextColorCombination = Object.fromEntries(
  contextColors.map((color) => [
    color,
    {
      DEFAULT: `rgba(var(--rui-${color}-main), <alpha-value>)`,
      darker: `rgba(var(--rui-${color}-darker), <alpha-value>)`,
      lighter: `rgba(var(--rui-${color}-lighter), <alpha-value>)`,
      tint: `color-mix(in srgb, white calc(<alpha-value> * 100%), rgb(var(--rui-${color}-main)))`,
      shade: `color-mix(in srgb, black calc(<alpha-value> * 100%), rgb(var(--rui-${color}-main)))`,
    },
  ]),
);

const safeListedColorVariants = [
  'important',
  'hover',
  'disabled',
  'active',
  'focus',
];

/** @type {import('tailwindcss').Config} */
module.exports = {
  mode: 'jit',
  darkMode: 'class',
  content: [
    './src/**/*.vue',
    ...(!isDevelopment ? [] : ['./src/**/*.mdx', './src/**/*.stories.ts']),
  ],
  theme: {
    extend: {
      colors: {
        rui: {
          ...baseColorsCombination,
          ...contextColorsCombination,
          ...adaptiveContextColorCombination,
        },
      },
      boxShadow: {
        1: '0px 2px 1px -1px var(--rui-shadow-primary), 0px 1px 1px var(--rui-shadow-secondary), 0px 1px 3px var(--rui-shadow-tertiary)',
        2: '0px 3px 1px -2px var(--rui-shadow-primary), 0px 2px 2px var(--rui-shadow-secondary), 0px 1px 5px var(--rui-shadow-tertiary)',
        3: '0px 3px 3px -2px var(--rui-shadow-primary), 0px 3px 4px var(--rui-shadow-secondary), 0px 1px 8px var(--rui-shadow-tertiary)',
        4: '0px 2px 4px -1px var(--rui-shadow-primary), 0px 4px 5px var(--rui-shadow-secondary), 0px 1px 10px var(--rui-shadow-tertiary)',
        5: '0px 3px 5px -1px var(--rui-shadow-primary), 0px 5px 8px var(--rui-shadow-secondary), 0px 1px 14px var(--rui-shadow-tertiary)',
        6: '0px 3px 5px -1px var(--rui-shadow-primary), 0px 6px 10px var(--rui-shadow-secondary), 0px 1px 18px var(--rui-shadow-tertiary)',
        7: '0px 4px 5px -2px var(--rui-shadow-primary), 0px 7px 10px 1px var(--rui-shadow-secondary), 0px 2px 16px 1px var(--rui-shadow-tertiary)',
        8: '0px 5px 5px -3px var(--rui-shadow-primary), 0px 8px 10px 1px var(--rui-shadow-secondary), 0px 3px 14px 2px var(--rui-shadow-tertiary)',
        9: '0px 5px 6px -3px var(--rui-shadow-primary), 0px 9px 12px 1px var(--rui-shadow-secondary), 0px 3px 16px 2px var(--rui-shadow-tertiary)',
        10: '0px 6px 6px -3px var(--rui-shadow-primary), 0px 10px 14px 1px var(--rui-shadow-secondary), 0px 4px 18px 3px var(--rui-shadow-tertiary)',
        11: '0px 6px 7px -4px var(--rui-shadow-primary), 0px 11px 15px 1px var(--rui-shadow-secondary), 0px 4px 20px 3px var(--rui-shadow-tertiary)',
        12: '0px 7px 8px -4px var(--rui-shadow-primary), 0px 12px 17px 2px var(--rui-shadow-secondary), 0px 5px 22px 4px var(--rui-shadow-tertiary)',
        13: '0px 7px 8px -4px var(--rui-shadow-primary), 0px 13px 19px 2px var(--rui-shadow-secondary), 0px 5px 24px 4px var(--rui-shadow-tertiary)',
        14: '0px 7px 9px -4px var(--rui-shadow-primary), 0px 14px 21px 2px var(--rui-shadow-secondary), 0px 5px 26px 4px var(--rui-shadow-tertiary)',
        15: '0px 8px 9px -5px var(--rui-shadow-primary), 0px 15px 22px 2px var(--rui-shadow-secondary), 0px 6px 28px 5px var(--rui-shadow-tertiary)',
        16: '0px 8px 10px -5px var(--rui-shadow-primary), 0px 16px 24px 2px var(--rui-shadow-secondary), 0px 6px 30px 5px var(--rui-shadow-tertiary)',
        17: '0px 8px 11px -5px var(--rui-shadow-primary), 0px 17px 26px 2px var(--rui-shadow-secondary), 0px 6px 32px 5px var(--rui-shadow-tertiary)',
        18: '0px 9px 11px -5px var(--rui-shadow-primary), 0px 18px 28px 2px var(--rui-shadow-secondary), 0px 7px 34px 6px var(--rui-shadow-tertiary)',
        19: '0px 9px 12px -6px var(--rui-shadow-primary), 0px 19px 29px 2px var(--rui-shadow-secondary), 0px 7px 36px 6px var(--rui-shadow-tertiary)',
        20: '0px 10px 13px -6px var(--rui-shadow-primary), 0px 20px 31px 3px var(--rui-shadow-secondary), 0px 8px 38px 7px var(--rui-shadow-tertiary)',
        21: '0px 10px 13px -6px var(--rui-shadow-primary), 0px 21px 33px 3px var(--rui-shadow-secondary), 0px 8px 40px 7px var(--rui-shadow-tertiary)',
        22: '0px 10px 14px -6px var(--rui-shadow-primary), 0px 22px 35px 3px var(--rui-shadow-secondary), 0px 8px 42px 7px var(--rui-shadow-tertiary)',
        23: '0px 11px 14px -7px var(--rui-shadow-primary), 0px 23px 36px 3px var(--rui-shadow-secondary), 0px 9px 44px 8px var(--rui-shadow-tertiary)',
        24: '0px 11px 15px -7px var(--rui-shadow-primary), 0px 24px 38px 3px var(--rui-shadow-secondary), 0px 9px 46px 8px var(--rui-shadow-tertiary)',
      },
    },
  },
  safelist: [
    {
      pattern: new RegExp(`shadow-(?:[1-9]|1[0-9]|2[0-4])`),
    },
    ...(isDevelopment
      ? [
          {
            pattern: new RegExp(
              `(bg|text|border)-rui-(${baseColors.join(
                '|',
              )})(-(${baseColorsIntensities.join('|')}))?`,
            ),
            variants: safeListedColorVariants,
          },
          {
            pattern: new RegExp(
              `(bg|text|border)-rui-(light|dark)-(${contextColors.join(
                '|',
              )})(-(darker|lighter|tint|shade))?`,
            ),
            variants: safeListedColorVariants,
          },
          {
            pattern: new RegExp(
              `(bg|text|border)-rui-(${contextColors.join(
                '|',
              )})(-(darker|lighter|tint|shade))?`,
            ),
            variants: safeListedColorVariants,
          },
        ]
      : []),
  ],
  plugins: [
    plugin(({ matchUtilities, addVariant }) => {
      matchUtilities(
        Object.fromEntries(
          ['bg-tint', 'bg-shade', 'text-tint', 'text-shade'].map((item) => [
            item,
            (value) => ({
              animation: `${item} 1s calc(${value} * -1s) linear forwards paused`,
            }),
          ]),
        ),
      );
      addVariant('color-mix-supported', '@supports (color-mix())');
    }),
  ],
};
