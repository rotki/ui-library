import type { Config } from 'tailwindcss';
import process from 'node:process';
import {
  baseColors,
  baseColorsIntensities,
  contextColors,
} from './src/consts/colors.js';
import { typographyClasses } from './src/consts/typography.js';
import themePlugin from './src/theme/index.js';

const isDevelopment = process.env.NODE_ENV === 'development' || process.env.STORYBOOK;

const safeListedColorVariants = [
  'important',
  'hover',
  'disabled',
  'active',
  'focus',
];

export default {
  mode: 'jit',
  darkMode: ['class', '[data-theme="dark"]'],
  content: [
    './src/**/*.vue',
    './src/**/!(*spec|*stories).ts',
    '!./src/__test__/**',
    ...(!isDevelopment
      ? []
      : ['./src/stories/themes/*.mdx', './src/**/*.stories.ts']),
  ],
  safelist: [
    // Shadows
    {
      // eslint-disable-next-line regexp/no-dupe-disjunctions
      pattern: /shadow-(?:[1-9]|1\d|2[0-4])/,
    },
    ...(isDevelopment
      ? [
          // Typography
          ...typographyClasses.map(({ className }) => className),
          // Colors
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
              `(bg|text|border)-rui(-(light|dark))?-(${contextColors.join(
                '|',
              )})(-(darker|lighter|tint|shade))?`,
            ),
            variants: safeListedColorVariants,
          },
        ]
      : []),
  ],
  theme: {
    extend: {
      backgroundImage: {
        'hue-spectrum': 'linear-gradient(to right, red 0%, yellow 16.66%, lime 33.33%, cyan 50%, blue 66.66%, magenta 83.33%, red 100%)',
      },
    },
  },
  plugins: [themePlugin],
} satisfies Config;
