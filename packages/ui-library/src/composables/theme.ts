import { defaultWindow, getSSRHandler, useColorMode } from '@vueuse/core';
import { computed, type ComputedRef, type Ref, ref } from 'vue';
import {
  defaultTheme,
  type InitThemeOptions,
  type ThemeConfig,
  type ThemeContent,
  type ThemeData,
  ThemeMode,
} from '@/types/theme';

const config: Ref<ThemeConfig> = ref({ ...defaultTheme });

/**
 * The theme manager: the current mode and palette, and the calls that change
 * them. Shared, so every caller reads and writes the same theme.
 *
 * @returns the theme state and the operations on it
 */
export const useRotkiTheme = createSharedComposable<() => ThemeContent>(() => {
  const updateHTMLAttrs = getSSRHandler(
    'updateHTMLAttrs',
    (selector, attribute, value) => {
      if (typeof selector !== 'string' || !defaultWindow)
        return;

      const el = defaultWindow.document.querySelector(selector);
      if (!el)
        return;

      el.setAttribute(attribute, value);
    },
  );

  const { state, store } = useColorMode<ThemeMode>({
    onChanged(mode, defaultHandler) {
      defaultHandler(mode);
      updateHTMLAttrs('html', 'data-theme', mode);
    },
  });

  /** Whether the system picks the theme rather than the user. */
  const isAutoControlled: ComputedRef<boolean> = computed(() => get(store) === ThemeMode.auto);

  /** Whether the light theme is showing. */
  const isLight: ComputedRef<boolean> = computed(() => get(state) === ThemeMode.light);

  /** Whether the dark theme is showing. */
  const isDark: ComputedRef<boolean> = computed(() => get(state) === ThemeMode.dark);

  /** The palette the current mode reads from. */
  const theme: ComputedRef<ThemeData> = computed(() => {
    if (get(isLight))
      return get(config).light;

    return get(config).dark;
  });

  /**
   * Switches the theme.
   *
   * @param mode - the mode to switch to; an empty mode falls back to auto
   */
  const switchThemeScheme = (mode: ThemeMode): void => {
    set(store, mode || ThemeMode.auto);
  };

  /**
   * toggle between auto|light|dark
   */
  const toggleThemeMode = (): void => {
    if (get(isAutoControlled))
      switchThemeScheme(ThemeMode.light);
    else if (get(isLight))
      switchThemeScheme(ThemeMode.dark);
    else if (get(isDark))
      switchThemeScheme(ThemeMode.auto);
  };

  /**
   * Replaces the palettes the theme draws from.
   *
   * @param newConfig - the light and dark palettes to use
   */
  const setThemeConfig = (newConfig: ThemeConfig): void => {
    set(config, newConfig);
  };

  /**
   * Sets the theme up. Call once, from the app's entry point.
   *
   * @param options - the starting mode and palettes; each falls back to its
   * default when left out
   */
  const init = (options: InitThemeOptions): void => {
    switchThemeScheme(options.mode ?? ThemeMode.auto);
    setThemeConfig(options.config ?? { ...defaultTheme });
  };

  return {
    config,
    init,
    isAutoControlled,
    isDark,
    isLight,
    setThemeConfig,
    state,
    store,
    switchThemeScheme,
    theme,
    toggleThemeMode,
  };
});
