import { describe, expect, it } from 'vitest';
import { createApp } from 'vue';
import { useRuiI8n } from '@/composables/use-rui-i18n';
import { createRuiI8nPlugin, type RuiI18nInstance } from '@/index';

function createI18n(messages: Record<string, string>): RuiI18nInstance {
  return {
    global: {
      t: (key: string, params?: Record<string, unknown>): string =>
        (messages[key] ?? key).replace(/\{(\w+)\}/g, (_, name: string) => String(params?.[name] ?? '')),
      te: (key: string): boolean => key in messages,
    },
  };
}

describe('createRuiI8nPlugin', () => {
  it('should provide the instance translations to the library', () => {
    const app = createApp({});
    app.use(createRuiI8nPlugin(createI18n({ greeting: 'Hello {name}' })));

    const { t } = app.runWithContext(() => useRuiI8n());

    expect(t('greeting', { name: 'rotki' }, 'fallback')).toBe('Hello rotki');
    expect(t('missing', 'fallback')).toBe('fallback');
  });

  it('should reject an instance without the translation functions', () => {
    // @ts-expect-error a JavaScript caller can pass anything
    expect(() => createRuiI8nPlugin(undefined)).toThrow('i18nInstance must be an object');
    // @ts-expect-error a JavaScript caller can pass anything
    expect(() => createRuiI8nPlugin({})).toThrow('i18nInstance must have a global property');
    // @ts-expect-error a JavaScript caller can pass anything
    expect(() => createRuiI8nPlugin({ global: { te: () => true } })).toThrow('i18nInstance.global.t must be a function');
    // @ts-expect-error a JavaScript caller can pass anything
    expect(() => createRuiI8nPlugin({ global: { t: () => '' } })).toThrow('i18nInstance.global.te must be a function');
  });
});
