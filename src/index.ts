import { type App } from 'vue';
import { createHead } from '@vueuse/head';
import { default as RuiButton } from '@/components/buttons/Button.vue';
import { useRotkiTheme } from '@/composables/theme';
import type { InitThemeOptions } from '@/types/theme';
import './style.css';

export type {
  InitThemeOptions,
  ThemeConfig,
  ThemeContent,
  ThemeData,
  ThemeMode,
} from '@/types/theme';

export { RuiButton, useRotkiTheme };

export const RuiPlugin = {
  install: (app: App, options?: InitThemeOptions) => {
    app.use(createHead());
    useRotkiTheme().init({ ...options });
  },
};
