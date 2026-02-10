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
 * Theme manager
 * @returns {ThemeContent}
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

  /**
   * whether the current theme is controlled by system or user
   * @type {ComputedRef<boolean>}
   */
  const isAutoControlled: ComputedRef<boolean> = computed(() => get(store) === ThemeMode.auto);

  /**
   * truthy for light theme
   * @type {ComputedRef<boolean>}
   */
  const isLight: ComputedRef<boolean> = computed(() => get(state) === ThemeMode.light);

  /**
   * truthy for dark theme
   * @type {ComputedRef<boolean>}
   */
  const isDark: ComputedRef<boolean> = computed(() => get(state) === ThemeMode.dark);

  /**
   * current theme based on light or dark mode
   * @type {ComputedRef<ThemeData>}
   */
  const theme: ComputedRef<ThemeData> = computed(() => {
    if (get(isLight))
      return get(config).light;

    return get(config).dark;
  });

  /**
   * switch theme through dark/light/auto modes
   * @param {ThemeMode} mode
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
   * sets the configuration for the theme
   * @param {ThemeConfig} newConfig
   */
  const setThemeConfig = (newConfig: ThemeConfig): void => {
    set(config, newConfig);
  };

  /**
   * theme initializer, must be called once from the app's entry
   * @param {InitThemeOptions} options
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
