import type { Config } from 'tailwindcss';
import process from 'node:process';
import {
  baseColors,
  baseColorsIntensities,
  contextColors,
} from './src/consts/colors';
import { typographyClasses } from './src/consts/typography';
import themePlugin from './src/theme';

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
  darkMode: 'class',
  content: [
    './src/**/*.vue',
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
          ...typographyClasses.map(item => item.className),
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
  plugins: [themePlugin],
} satisfies Config;
