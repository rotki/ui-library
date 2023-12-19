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

export { type ContextColorsType } from '@/consts/colors';

export * from '@/composables';
export * from '@/components';

export { StepperState };

export interface RuiOptions {
  theme?: InitThemeOptions;
}

export function createRui(options: RuiOptions = {}) {
  const { theme } = options;
  const install = (_app: App) => {
    const { registerIcons } = useIcons();
    registerIcons(theme?.icons || []);
    useRotkiTheme().init({ ...theme });
  };

  return {
    install,
  };
}
