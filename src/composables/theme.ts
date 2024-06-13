import { type ComputedRef, type Ref, computed, ref } from 'vue';
import { useColorMode } from '@vueuse/core';
import {
  type ColorIntensity,
  type InitThemeOptions,
  type ThemeConfig,
  type ThemeContent,
  type ThemeData,
  ThemeMode,
  defaultTheme,
} from '@/types/theme';

const config: Ref<ThemeConfig> = ref({ ...defaultTheme });

/**
 * Theme manager
 * @returns {ThemeContent}
 */
export const useRotkiTheme = createSharedComposable<() => ThemeContent>(() => {
  const { state, store } = useColorMode<ThemeMode>();

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
  const switchThemeScheme = (mode: ThemeMode) => {
    set(store, mode || ThemeMode.auto);
  };

  /**
   * toggle between auto|light|dark
   */
  const toggleThemeMode = () => {
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
  const setThemeConfig = (newConfig: ThemeConfig) => {
    set(config, newConfig);
  };

  /**
   * theme initializer, must be called once from the app's entry
   * @param {InitThemeOptions} options
   */
  const init = (options: InitThemeOptions) => {
    switchThemeScheme(options.mode ?? ThemeMode.auto);
    setThemeConfig(options.config ?? { ...defaultTheme });

    if (typeof window !== 'undefined') {
      watch([isLight, theme], ([isLight, theme]) => {
        const styleVariables = new Map();

        // Compute context variables
        Object.entries(theme).forEach(([context, contextObject]: [string, ColorIntensity]) => {
          styleVariables.set(`--rui-${context}-darker`, contextObject.darker);
          styleVariables.set(`--rui-${context}-lighter`, contextObject.lighter);
          styleVariables.set(`--rui-${context}-main`, contextObject.DEFAULT);
        });

        // Determine the theme mode
        const state = isLight ? ThemeMode.light : ThemeMode.dark;

        // Add text color variables
        styleVariables.set('--rui-text-disabled', `var(--rui-${state}-text-disabled)`);
        styleVariables.set('--rui-text-primary', `var(--rui-${state}-text-primary)`);
        styleVariables.set('--rui-text-secondary', `var(--rui-${state}-text-secondary)`);

        // Apply all style variables in one operation
        const rootStyle = document.documentElement.style;
        styleVariables.forEach((value, variableName) => {
          rootStyle.setProperty(variableName, value);
        });
      }, { immediate: true });
    }
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
