import type { App } from 'vue';
import type { InitThemeOptions } from '@/types/theme';
import { createFieldDefaults, type FieldOptions, FieldSymbol } from '@/composables/defaults/field';
import { type LogoOptions, LogoSymbol } from '@/composables/defaults/logo';
import {
  createTableDefaults,
  type TableOptions,
  TableSymbol,
} from '@/composables/defaults/table';
import { createIconDefaults, IconsSymbol } from '@/composables/icons';
import { useRotkiTheme } from '@/composables/theme';
import { RUI_I18N_INJECTION_KEY, type RuiI18nParams, type RuiI18nProvider } from '@/composables/use-rui-i18n';
import { StepperOrientation, StepperState, type StepperStep } from '@/types/stepper';
import '@/style.css';

export * from '@/components';

export { activatorHandlers, type ActivatorHandlers } from '@/components/overlays/menu/activator-handlers';

export * from '@/composables';

export { type FieldOptions, type FieldScopeOptions, type LabelPlacement, provideFieldDefaults } from '@/composables/defaults/field';

export type { LogoOptions, LogoResolver } from '@/composables/defaults/logo';

export type { RuiI18nParams, RuiI18nProvider };

export { contextColors, type ContextColorsType } from '@/consts/colors';

export { translationKeys } from '@/i18n/keys';

export * from '@/icons';

export { StepperOrientation, StepperState, type StepperStep };

export type { VueClassValue } from '@/types/class-value';

export {
  type InitThemeOptions,
  type ThemeConfig,
  type ThemeContent,
  type ThemeData,
  ThemeMode,
} from '@/types/theme';

export { createBlockie } from '@/utils/blockie';

export type { FormDetails } from '@/utils/form-text-detail';

export { cn, tv } from '@/utils/tv';

export type { VariantProps } from 'tailwind-variants';

export interface RuiOptions {
  theme?: InitThemeOptions;
  defaults?: {
    table?: Partial<TableOptions>;
    /**
     * `labelPlacement` for every text field, text area, select and picker (`top` when unset),
     * and `details` for every form control (`reserve` when unset).
     */
    field?: Partial<FieldOptions>;
  };
  /**
   * Where `RuiLogo` gets the image for its `logo` prop. Without it every
   * `RuiLogo` shows the bundled logo, and the library makes no network request.
   */
  logo?: LogoOptions;
}

export function createRui(options: RuiOptions = {}) {
  const { theme, defaults: defaultOptions, logo } = options;

  const defaults = Object.freeze({
    icons: createIconDefaults({
      registeredIcons: theme?.icons,
    }),
    table: createTableDefaults(defaultOptions?.table),
    field: createFieldDefaults(defaultOptions?.field),
  });

  const install = (app: App) => {
    useRotkiTheme().init({ ...theme });

    app.provide(TableSymbol, defaults.table);
    app.provide(IconsSymbol, defaults.icons);
    app.provide(FieldSymbol, defaults.field);

    if (logo)
      app.provide(LogoSymbol, logo);
  };

  return {
    defaults,
    install,
  };
}

/** What the i18n plugin reads from a vue-i18n instance (the result of `createI18n`). */
export interface RuiI18nInstance {
  global: RuiI18nProvider;
}

/**
 * Checks the instance at runtime too, for callers the types do not reach.
 */
function assertI18nInstance(i18nInstance: unknown): asserts i18nInstance is RuiI18nInstance {
  if (!i18nInstance || typeof i18nInstance !== 'object')
    throw new Error('i18nInstance must be an object');

  if (!('global' in i18nInstance) || !i18nInstance.global || typeof i18nInstance.global !== 'object')
    throw new Error('i18nInstance must have a global property');

  const global = i18nInstance.global;

  if (!('t' in global) || typeof global.t !== 'function')
    throw new Error('i18nInstance.global.t must be a function');

  if (!('te' in global) || typeof global.te !== 'function')
    throw new Error('i18nInstance.global.te must be a function');
}

export function createRuiI8nPlugin(i18nInstance: RuiI18nInstance): { install: (app: App) => void } {
  assertI18nInstance(i18nInstance);
  const { global } = i18nInstance;

  return {
    install: (app: App): void => {
      app.provide(RUI_I18N_INJECTION_KEY, {
        t: global.t.bind(global),
        te: global.te.bind(global),
      });
    },
  };
}
