import type { Config } from 'tailwindcss';
import theme from '@rotki/ui-library/theme';

export default {
  mode: 'jit',
  content: ['./index.html', './src/**/*.{vue,ts}'],
  plugins: [theme],
} satisfies Partial<Config>;
