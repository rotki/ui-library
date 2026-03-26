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
      keyframes: {
        'buffer-pulse': {
          '0%': { opacity: '0.2', left: '-100%' },
          '50%': { opacity: '1.5', left: '-100%' },
          '60%': { opacity: '0.4', left: '-75%' },
          '100%': { opacity: '0.2', left: '-100%' },
        },
        'slide-rail': {
          '0%': { left: '-35%', right: '100%' },
          '60%': { left: '100%', right: '-90%' },
          '100%': { left: '100%', right: '-90%' },
        },
        'collapse-stroke': {
          '0%': { 'stroke-dasharray': '1px, 200px', 'stroke-dashoffset': '0' },
          '50%': { 'stroke-dasharray': '100px, 200px', 'stroke-dashoffset': '-15px' },
          '100%': { 'stroke-dasharray': '100px, 200px', 'stroke-dashoffset': '-125px' },
        },
      },
      animation: {
        'buffer-pulse': 'buffer-pulse 3s ease-in-out 3s infinite',
        'slide-rail': 'slide-rail 1.6s cubic-bezier(0.65, 0.815, 0.735, 0.395) infinite',
        'collapse-stroke': 'collapse-stroke 1.4s ease-in-out infinite',
        'circular-spin': 'spin 1.4s linear infinite',
      },
    },
  },
  plugins: [themePlugin],
} satisfies Config;
