import theme from '@rotki/ui-library/theme';
import type { Config } from 'tailwindcss';

export default {
  mode: 'jit',
  content: ['./index.html', './src/**/*.{vue,ts}'],
  plugins: [theme],
} satisfies Partial<Config>;
