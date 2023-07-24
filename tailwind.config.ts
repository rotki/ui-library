import { type Config } from 'tailwindcss';
import typographyClasses from './src/consts/typography';
import themePlugin from './src/theme';
import {
  baseColors,
  baseColorsIntensities,
  contextColors,
} from './src/consts/colors';

const isDevelopment =
  process.env.NODE_ENV === 'development' || process.env.STORYBOOK;

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
      pattern: new RegExp(`shadow-(?:[1-9]|1[0-9]|2[0-4])`),
    },
    ...(isDevelopment
      ? [
          // Typography
          ...typographyClasses.map((item) => item.className),
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
