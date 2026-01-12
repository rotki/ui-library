import { mount } from '@vue/test-utils';
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
  });
});
