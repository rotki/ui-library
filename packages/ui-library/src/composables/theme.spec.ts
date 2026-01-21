import { mount } from '@vue/test-utils';
import { setSSRHandler } from '@vueuse/core';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { defineComponent, nextTick } from 'vue';
import { useRotkiTheme } from '@/composables/theme';
import { ThemeMode } from '@/types/theme';

// Helper to test composable with proper lifecycle hooks
function withSetup<T>(composable: () => T): { result: T; unmount: () => void } {
  let result!: T;
  const TestComponent = defineComponent({
    setup() {
      result = composable();
      return {};
    },
    template: '<div></div>',
  });
  const wrapper = mount(TestComponent);
  return { result, unmount: () => wrapper.unmount() };
}

describe('composables/theme', () => {
  beforeEach(() => {
    // Clear any existing theme classes and data attributes
    document.documentElement.classList.remove('light', 'dark', 'auto');
    delete document.documentElement.dataset.theme;
  });

  afterEach(() => {
    // Clean up
    document.documentElement.classList.remove('light', 'dark', 'auto');
    delete document.documentElement.dataset.theme;
    vi.restoreAllMocks();
  });

  describe('useRotkiTheme', () => {
    it('should return all expected properties', () => {
      const { result, unmount } = withSetup(() => useRotkiTheme());

      expect(result).toHaveProperty('config');
      expect(result).toHaveProperty('init');
      expect(result).toHaveProperty('isAutoControlled');
      expect(result).toHaveProperty('isDark');
      expect(result).toHaveProperty('isLight');
      expect(result).toHaveProperty('setThemeConfig');
      expect(result).toHaveProperty('state');
      expect(result).toHaveProperty('store');
      expect(result).toHaveProperty('switchThemeScheme');
      expect(result).toHaveProperty('theme');
      expect(result).toHaveProperty('toggleThemeMode');

      unmount();
    });

    it('should set both class and data-theme attribute when switching to light mode', async () => {
      const { result, unmount } = withSetup(() => useRotkiTheme());

      result.switchThemeScheme(ThemeMode.light);
      await nextTick();

      expect(document.documentElement.classList.contains('light')).toBe(true);
      expect(document.documentElement.dataset.theme).toBe('light');
      expect(document.documentElement.getAttribute('data-theme')).toBe('light');

      unmount();
    });

    it('should set both class and data-theme attribute when switching to dark mode', async () => {
      const { result, unmount } = withSetup(() => useRotkiTheme());

      result.switchThemeScheme(ThemeMode.dark);
      await nextTick();

      expect(document.documentElement.classList.contains('dark')).toBe(true);
      expect(document.documentElement.dataset.theme).toBe('dark');
      expect(document.documentElement.getAttribute('data-theme')).toBe('dark');

      unmount();
    });

    it('should update both class and data-theme when toggling theme mode', async () => {
      const { result, unmount } = withSetup(() => useRotkiTheme());

      // Start with light mode
      result.switchThemeScheme(ThemeMode.light);
      await nextTick();

      expect(document.documentElement.classList.contains('light')).toBe(true);
      expect(document.documentElement.dataset.theme).toBe('light');

      // Toggle to dark
      result.toggleThemeMode();
      await nextTick();

      expect(document.documentElement.classList.contains('dark')).toBe(true);
      expect(document.documentElement.dataset.theme).toBe('dark');

      unmount();
    });

    it('should keep class and data-theme in sync through multiple theme changes', async () => {
      const { result, unmount } = withSetup(() => useRotkiTheme());

      const modes: ThemeMode[] = [ThemeMode.light, ThemeMode.dark, ThemeMode.light, ThemeMode.dark];

      for (const mode of modes) {
        result.switchThemeScheme(mode);
        await nextTick();

        const expectedClass = mode === ThemeMode.auto ? 'light' : mode;
        expect(document.documentElement.dataset.theme).toBe(expectedClass);
      }

      unmount();
    });

    it('should correctly report isLight and isDark states', async () => {
      const { result, unmount } = withSetup(() => useRotkiTheme());

      result.switchThemeScheme(ThemeMode.light);
      await nextTick();

      expect(get(result.isLight)).toBe(true);
      expect(get(result.isDark)).toBe(false);

      result.switchThemeScheme(ThemeMode.dark);
      await nextTick();

      expect(get(result.isLight)).toBe(false);
      expect(get(result.isDark)).toBe(true);

      unmount();
    });

    it('should correctly report isAutoControlled state', async () => {
      const { result, unmount } = withSetup(() => useRotkiTheme());

      result.switchThemeScheme(ThemeMode.auto);
      await nextTick();

      expect(get(result.isAutoControlled)).toBe(true);

      result.switchThemeScheme(ThemeMode.light);
      await nextTick();

      expect(get(result.isAutoControlled)).toBe(false);

      unmount();
    });

    it('should work with SSR handler and correctly set data-theme attribute', async () => {
      const ssrCalls: Array<{ selector: string; attribute: string; value: string }> = [];

      // Register SSR handler to capture calls (simulates SSR environment like Nuxt)
      setSSRHandler('updateHTMLAttrs', (selector, attribute, value) => {
        ssrCalls.push({ selector: String(selector), attribute, value });
      });

      // Reset module cache to ensure fresh composable instance with SSR handler
      vi.resetModules();

      // Re-import the composable after setting SSR handler and resetting modules
      const { useRotkiTheme: useRotkiThemeFresh } = await import('@/composables/theme');

      const { result, unmount } = withSetup(() => useRotkiThemeFresh());

      result.switchThemeScheme(ThemeMode.light);
      await nextTick();

      // Verify SSR handler was called with correct data-theme attribute
      const dataThemeCalls = ssrCalls.filter(call => call.attribute === 'data-theme');
      expect(dataThemeCalls.length).toBeGreaterThan(0);
      expect(dataThemeCalls.at(-1)).toEqual({
        selector: 'html',
        attribute: 'data-theme',
        value: 'light',
      });

      // Switch to dark and verify
      ssrCalls.length = 0;
      result.switchThemeScheme(ThemeMode.dark);
      await nextTick();

      const darkThemeCalls = ssrCalls.filter(call => call.attribute === 'data-theme');
      expect(darkThemeCalls.length).toBeGreaterThan(0);
      expect(darkThemeCalls.at(-1)).toEqual({
        selector: 'html',
        attribute: 'data-theme',
        value: 'dark',
      });

      unmount();

      // Reset SSR handler by setting to undefined
      setSSRHandler('updateHTMLAttrs', undefined as any);
    });
  });
});
