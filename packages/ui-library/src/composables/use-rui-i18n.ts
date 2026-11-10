import { inject, type InjectionKey } from 'vue';

/** The named parameters a translation interpolates. */
export type RuiI18nParams = Record<string, unknown>;

interface I18nProvider {
  t: {
    (key: string, fallback: string): string;
    (key: string, params: RuiI18nParams, fallback: string): string;
  };
}

export interface RuiI18nProvider {
  t: (key: string, params?: RuiI18nParams) => string;
  te: (key: string) => boolean;
}

export const RUI_I18N_INJECTION_KEY: InjectionKey<RuiI18nProvider> = Symbol('rui:i18n');

export function useRuiI8n(): I18nProvider {
  const i18nProvider = inject(RUI_I18N_INJECTION_KEY, undefined);

  const translate = (key: string, params?: RuiI18nParams): string | undefined => {
    if (i18nProvider?.te(key)) {
      return i18nProvider.t(key, params);
    }
    return undefined;
  };

  const t = (
    key: string,
    paramsOrFallback?: RuiI18nParams | string,
    fallback?: string,
  ): string => {
    if (typeof paramsOrFallback === 'string') {
      return translate(key) ?? paramsOrFallback ?? key;
    }
    else {
      return translate(key, paramsOrFallback) ?? fallback ?? key;
    }
  };

  return { t };
}
