import type { App } from 'vue';
import type { InitThemeOptions } from '@/types/theme';
import {
  createTableDefaults,
  type TableOptions,
  TableSymbol,
} from '@/composables/defaults/table';
import { createIconDefaults, IconsSymbol } from '@/composables/icons';
import { useRotkiTheme } from '@/composables/theme';
import { RUI_I18N_INJECTION_KEY } from '@/composables/use-rui-i18n';
import { StepperState } from '@/types/stepper';
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

export { createBlockie } from '@/utils/blockie';

export interface RuiOptions {
  theme?: InitThemeOptions;
  defaults?: {
    table?: Partial<TableOptions>;
  };
}

export function createRui(options: RuiOptions = {}) {
  const { theme, defaults: defaultOptions } = options;

  const defaults = Object.freeze({
    icons: createIconDefaults({
      registeredIcons: theme?.icons,
    }),
    table: createTableDefaults(defaultOptions?.table),
  });

  const install = (app: App) => {
    useRotkiTheme().init({ ...theme });

    app.provide(TableSymbol, defaults.table);
    app.provide(IconsSymbol, defaults.icons);
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
