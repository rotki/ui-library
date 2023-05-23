import { isVue2, isVue3 } from 'vue-demi';
import { HeadVuePlugin, createHead } from '@vueuse/head';
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
  install: (app: any, options?: InitThemeOptions) => {
    if (isVue3) {
      app.use(createHead());
    } else if (isVue2) {
      const head = createHead();
      app.use(HeadVuePlugin, head);
      app.use(head);
    }
    useRotkiTheme().init({ ...options });
  },
};
