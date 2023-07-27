/* eslint-disable max-lines,import/max-dependencies */
import { type App } from 'vue';
import { useRotkiTheme } from '@/composables/theme';
import { StepperState } from '@/types/stepper';
import type { InitThemeOptions } from '@/types/theme';
import '@/style.scss';

export * from '@/all-icons';

export {
  type InitThemeOptions,
  type ThemeConfig,
  type ThemeContent,
  type ThemeData,
  ThemeMode,
} from '@/types/theme';

export * from '@/composables';
export * from '@/components';

export { StepperState };

export const RuiPlugin = {
  install: (app: App, options?: InitThemeOptions) => {
    const { registerIcons } = useIcons();
    registerIcons(options?.icons || []);
    useRotkiTheme().init({ ...options });
  },
};
