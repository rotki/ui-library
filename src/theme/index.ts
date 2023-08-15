import plugin from 'tailwindcss/plugin';
import {
  baseColors,
  baseColorsIntensities,
  contextColors,
} from '../consts/colors';

const baseColorsCombination = Object.fromEntries(
  baseColors.map((color: string) => [
    color,
    Object.fromEntries(
      baseColorsIntensities.map((intensity: string) => [
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

const textColorsCombination = Object.fromEntries(
  ['light', 'dark'].map((theme) => [
    theme,
    {
      text: {
        DEFAULT: `var(--rui-${theme}-text-primary)`,
        secondary: `var(--rui-${theme}-text-secondary)`,
        disabled: `var(--rui-${theme}-text-disabled)`,
      },
    },
  ]),
);

const adaptiveTextColorsCombination = {
  text: {
    DEFAULT: `var(--rui-text-primary)`,
    secondary: `var(--rui-text-secondary)`,
    disabled: `var(--rui-text-disabled)`,
  },
};

const themePlugin = plugin(
  ({ addUtilities, matchUtilities, addVariant }) => {
    // Typography
    addUtilities({
      '.text-body-1': {
        '@apply text-base': {},
      },
      '.text-body-2': {
        '@apply text-sm': {},
      },
      '.text-subtitle-1': {
        '@apply text-base': {},
        'line-height': '1.75rem',
      },
      '.text-subtitle-2': {
        '@apply text-sm font-medium': {},
        'line-height': '1.25rem',
      },
      '.text-caption': {
        '@apply text-xs': {},
        'line-height': '1.25rem',
      },
      '.text-overline': {
        '@apply text-xs uppercase': {},
        'line-height': '2rem',
      },
      '.text-h1': {
        '@apply text-8xl font-light': {},
        'line-height': '7rem',
      },
      '.text-h2': {
        '@apply text-6xl font-light': {},
        'line-height': '4.5rem',
      },
      '.text-h3': {
        '@apply text-5xl': {},
        'line-height': '3.5rem',
      },
      '.text-h4': {
        '@apply text-4xl font-semibold': {},
        'line-height': '2.625rem',
      },
      '.text-h5': {
        '@apply text-2xl': {},
        'line-height': '2rem',
      },
      '.text-h6': {
        '@apply text-xl font-medium': {},
        'line-height': '2rem',
      },
    });

    // Tint and Shade Colors
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
  },
  {
    theme: {
      extend: {
        colors: {
          rui: {
            ...baseColorsCombination,
            ...contextColorsCombination,
            ...textColorsCombination,
            light: {
              ...contextColorsCombination.light,
              ...textColorsCombination.light,
            },
            dark: {
              ...contextColorsCombination.dark,
              ...textColorsCombination.dark,
            },
            ...adaptiveContextColorCombination,
            ...adaptiveTextColorsCombination,
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
  },
);

export default themePlugin;
