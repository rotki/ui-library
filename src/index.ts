import { PiniaVuePlugin, createPinia } from 'pinia';
import { isVue2, isVue3 } from 'vue-demi';
import { HeadVuePlugin, createHead } from '@vueuse/head';
import { default as RuiButton } from '@/components/buttons/Button.vue';
import { useThemeStore } from '@/stores/theme';
import type { InitThemeOptions } from '@/types/theme';

export type {
  InitThemeOptions,
  ThemeConfig,
  ThemeContent,
  ThemeController,
  ThemeData,
  ThemeMode
} from '@/types/theme';

export { RuiButton, useThemeStore };

export default {
  install: (app: any, options?: InitThemeOptions) => {
    if (isVue3) {
      app.use(createHead());
      app.use(createPinia());
      useThemeStore().init({ ...options });
    } else if (isVue2) {
      const head = createHead();
      app.use(HeadVuePlugin, head);
      app.use(head);
      app.use(PiniaVuePlugin);
      app.nextTick().then(() => {
        useThemeStore().init({ ...options });
      });
    }
  }
};
