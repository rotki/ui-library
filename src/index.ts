import type { InitThemeOptions } from '@/types/theme';
import type { App } from 'vue';
import {
  createTableDefaults,
  type TableOptions,
  TableSymbol,
} from '@/composables/defaults/table';
import { createIconDefaults, IconsSymbol } from '@/composables/icons';
import { useRotkiTheme } from '@/composables/theme';
import { StepperState } from '@/types/stepper';
import dayjs from 'dayjs';
import timezone from 'dayjs/plugin/timezone';
import utc from 'dayjs/plugin/utc';
import '@/style.scss';

export * from '@/components';

export * from '@/composables';

export { contextColors, type ContextColorsType } from '@/consts/colors';

export * from '@/icons';

export {
  type InitThemeOptions,
  type ThemeConfig,
  type ThemeContent,
  type ThemeData,
  ThemeMode,
} from '@/types/theme';

export { StepperState };

export interface RuiOptions {
  theme?: InitThemeOptions;
  defaults?: {
    table?: Partial<TableOptions>;
  };
}

export function createRui(options: RuiOptions = {}) {
  const { theme } = options;

  const defaults = Object.freeze({
    icons: createIconDefaults({
      registeredIcons: options.theme?.icons,
    }),
    table: createTableDefaults(options.defaults?.table),
  });

  const install = (app: App) => {
    useRotkiTheme().init({ ...theme });

    app.provide(TableSymbol, defaults.table);
    app.provide(IconsSymbol, defaults.icons);
    dayjs.extend(utc);
    dayjs.extend(timezone);
  };

  return {
    defaults,
    install,
  };
}
