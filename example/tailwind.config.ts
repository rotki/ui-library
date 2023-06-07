import type { Config } from 'tailwindcss';

export default {
  mode: 'jit',
  content: ['./index.html', './src/**/*.{vue,ts}'],
  plugins: [],
} as Partial<Config>;
