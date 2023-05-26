import { type App } from 'vue';
import { createHead } from '@vueuse/head';
import { default as RuiButton } from '@/components/buttons/Button.vue';
import { default as RuiIcon } from '@/components/icons/Icon.vue';
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

export { RuiButton, RuiIcon, useRotkiTheme };

export const RuiPlugin = {
  install: (app: App, options?: InitThemeOptions) => {
    app.use(createHead());
    const { registerIcons } = useIcons();
    registerIcons(options?.icons || []);
    useRotkiTheme().init({ ...options });
  },
};
