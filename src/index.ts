import type { InitThemeOptions } from '@/types/theme';
import type { App } from 'vue';
import {
  createTableDefaults,
  type TableOptions,
  TableSymbol,
} from '@/composables/defaults/table';
import { createIconDefaults, IconsSymbol } from '@/composables/icons';
import { useRotkiTheme } from '@/composables/theme';
import { RUI_I18N_INJECTION_KEY } from '@/composables/use-rui-i18n';
import { StepperState } from '@/types/stepper';
import dayjs from 'dayjs';
import customParseFormat from 'dayjs/plugin/customParseFormat';
import timezone from 'dayjs/plugin/timezone';
import utc from 'dayjs/plugin/utc';
import '@/style.scss';

export * from '@/components';

export * from '@/composables';

export { contextColors, type ContextColorsType } from '@/consts/colors';

export { translationKeys } from '@/i18n/keys';

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
    dayjs.extend(customParseFormat);
  };

  return {
    defaults,
    install,
  };
}

export function createRuiI8nPlugin(i18nInstance: any) {
  if (!i18nInstance || typeof i18nInstance !== 'object') {
    throw new Error('i18nInstance must be an object');
  }

  if (!i18nInstance.global || typeof i18nInstance.global !== 'object') {
    throw new Error('i18nInstance must have a global property');
  }

  if (!i18nInstance.global.t || typeof i18nInstance.global.t !== 'function') {
    throw new Error('i18nInstance.global.t must be a function');
  }

  if (!i18nInstance.global.te || typeof i18nInstance.global.te !== 'function') {
    throw new Error('i18nInstance.global.te must be a function');
  }

  return {
    install: (app: App) => {
      app.provide(RUI_I18N_INJECTION_KEY, {
        t: i18nInstance.global.t.bind(i18nInstance.global),
        te: i18nInstance.global.te.bind(i18nInstance.global),
      });
    },
  };
}
