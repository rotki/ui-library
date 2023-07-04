import { type App } from 'vue';
import { createHead } from '@vueuse/head';
import { default as RuiButton } from '@/components/buttons/Button.vue';
import { default as RuiIcon } from '@/components/icons/Icon.vue';
import { default as RuiCheckbox } from '@/components/forms/checkbox/Checkbox.vue';
import { useRotkiTheme } from '@/composables/theme';
import type { InitThemeOptions } from '@/types/theme';
import '@/style.css';

export * from '@/all-icons';

export {
  type InitThemeOptions,
  type ThemeConfig,
  type ThemeContent,
  type ThemeData,
  ThemeMode,
} from '@/types/theme';

export { RuiButton, RuiIcon, RuiCheckbox, useRotkiTheme };

export const RuiPlugin = {
  install: (app: App, options?: InitThemeOptions) => {
    app.use(createHead());
    const { registerIcons } = useIcons();
    registerIcons(options?.icons || []);
    useRotkiTheme().init({ ...options });
  },
};
