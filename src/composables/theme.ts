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
export const useRotkiTheme = (): ThemeContent => {
  const { store, state } = useColorMode<ThemeMode>();

  /**
   * whether the current theme is controlled by system or user
   * @type {ComputedRef<boolean>}
   */
  const isAutoControlled: ComputedRef<boolean> = computed(
    () => get(store) === ThemeMode.auto,
  );

  /**
   * truthy for light theme
   * @type {ComputedRef<boolean>}
   */
  const isLight: ComputedRef<boolean> = computed(
    () => get(state) === ThemeMode.light,
  );

  /**
   * truthy for dark theme
   * @type {ComputedRef<boolean>}
   */
  const isDark: ComputedRef<boolean> = computed(
    () => get(state) === ThemeMode.dark,
  );

  /**
   * current theme based on light or dark mode
   * @type {ComputedRef<ThemeData>}
   */
  const theme: ComputedRef<ThemeData> = computed(() => {
    if (get(isLight)) {
      return get(config).light;
    }

    return get(config).dark;
  });

  /**
   * switch theme through dark/light/auto modes
   * @param {ThemeMode} mode
   */
  const switchThemeScheme = (mode: ThemeMode) => {
    set(store, mode);
  };

  /**
   * toggle between auto|light|dark
   */
  const toggleThemeMode = () => {
    if (get(isAutoControlled)) {
      switchThemeScheme(ThemeMode.light);
    } else if (get(isLight)) {
      switchThemeScheme(ThemeMode.dark);
    } else if (get(isDark)) {
      switchThemeScheme(ThemeMode.auto);
    }
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
   * after initializing @unhead/vue
   * @param {InitThemeOptions} options
   */
  const init = (options: InitThemeOptions) => {
    switchThemeScheme(options.mode ?? ThemeMode.auto);
    setThemeConfig(options.config ?? { ...defaultTheme });

    // here, we can add all the variables we need to use in styling our components
    // these keys must match what is also in the tailwind.config.css file
    useHead(
      {
        style: [
          {
            key: 'rui-root',
            textContent: () => {
              const variables = Object.entries(get(theme))
                .map(
                  ([context, contextObject]: [string, ColorIntensity]) => `
                  --rui-${context}-main: ${contextObject.DEFAULT};
                  --rui-${context}-lighter: ${contextObject.lighter};
                  --rui-${context}-darker: ${contextObject.darker};
                `,
                )
                .join('\n');

              return `
                :root {
                  ${variables}
                }
              `;
            },
          },
        ],
      },
      { mode: 'client' },
    );
  };

  return {
    isAutoControlled,
    isLight,
    isDark,
    config,
    theme,
    store,
    state,
    init,
    setThemeConfig,
    toggleThemeMode,
    switchThemeScheme,
  };
};
