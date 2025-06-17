import { inject } from 'vue';

export const RUI_I18N_INJECTION_KEY = Symbol('rui:i18n');

interface I18nProvider {
  t: {
    (key: string, fallback: string): string;
    (key: string, params: Record<string, any>, fallback: string): string;
  };
}

export interface RuiI18nProvider {
  t: (key: string, params?: Record<string, any>) => string;
  te: (key: string) => boolean;
}

export function useRuiI8n(): I18nProvider {
  const i18nProvider = inject<RuiI18nProvider>(RUI_I18N_INJECTION_KEY);

  const translate = (key: string, params?: Record<string, any>): string | undefined => {
    if (i18nProvider?.te(key)) {
      return i18nProvider?.t(key, params);
    }
    return undefined;
  };

  const t = (
    key: string,
    paramsOrFallback?: Record<string, any> | string,
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
