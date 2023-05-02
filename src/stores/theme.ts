import { defineStore } from 'pinia';
import { type ComputedRef, type Ref, computed, ref } from 'vue-demi';
import { get, set, useDark } from '@vueuse/core';
import { useHead } from '@vueuse/head';
import {
  type InitThemeOptions,
  type ThemeConfig,
  type ThemeContent,
  ThemeController,
  type ThemeData,
  ThemeMode,
  defaultTheme
} from '@/types/theme';

/**
 * Theme manager
 * @type {StoreDefinition<"rui-theme", _ExtractStateFromSetupStore<ThemeContent>, _ExtractGettersFromSetupStore<ThemeContent>, _ExtractActionsFromSetupStore<ThemeContent>>}
 */
export const useThemeStore = defineStore('rui-theme', (): ThemeContent => {
  const controller: Ref<ThemeController | undefined> = ref();
  const themeMode: Ref<ThemeMode | undefined> = ref();
  const config: Ref<ThemeConfig | undefined> = ref();

  /**
   * whether the current theme is controlled by system or user
   * @type {ComputedRef<boolean>}
   */
  const isAutoControlled: ComputedRef<boolean> = computed(
    () => get(controller) === ThemeController.system
  );

  /**
   * truthy for light theme
   * @type {ComputedRef<boolean>}
   */
  const isLight: ComputedRef<boolean> = computed(
    () => get(themeMode) === ThemeMode.light
  );

  /**
   * truthy for dark theme
   * @type {ComputedRef<boolean>}
   */
  const isDark: ComputedRef<boolean> = computed(
    () => get(themeMode) === ThemeMode.dark
  );

  /**
   * current theme based on light or dark mode
   * @type {ComputedRef<ThemeData | undefined>}
   */
  const theme: ComputedRef<ThemeData | undefined> = computed(() => {
    if (get(isLight)) {
      return get(config)?.light;
    }

    return get(config)?.dark;
  });

  /**
   * switch theme through dark/light modes
   * @param {ThemeMode} mode
   */
  const switchThemeMode = (mode: ThemeMode) => {
    set(themeMode, mode);
  };

  /**
   * toggle between light or dark
   * @param {boolean} light
   */
  const toggleThemeMode = (light: boolean = get(isLight)) => {
    switchThemeMode(light ? ThemeMode.dark : ThemeMode.light);
  };

  /**
   * uses the composable to manage dark mode changes from platform/system control
   * @type {WritableComputedRef<boolean>}
   */
  const autoDark = useDark({
    onChanged: (darkMode: boolean) => {
      if (get(isAutoControlled)) {
        switchThemeMode(darkMode ? ThemeMode.dark : ThemeMode.light);
      }
    }
  });

  /**
   * switch between auto controlled or user controlled theme
   * when switched to auto controlled, we set the theme based on what is saved on the system
   * @param {ThemeController} ctrl
   */
  const switchController = (ctrl: ThemeController) => {
    set(controller, ctrl);
    if (get(isAutoControlled)) {
      toggleThemeMode(get(autoDark));
    }
  };

  /**
   * set auto controlled theme
   */
  const setAutoController = () => {
    switchController(ThemeController.system);
  };

  /**
   * toggle between auto controlled and app controlled theme
   */
  const toggleAutoController = () => {
    switchController(
      get(isAutoControlled) ? ThemeController.app : ThemeController.system
    );
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
   * after initializing pinia and @vueuse/head
   * @param {InitThemeOptions} options
   */
  const initTheme = (options: InitThemeOptions) => {
    switchThemeMode(options.mode ?? ThemeMode.auto);
    setThemeConfig(options.config ?? { ...defaultTheme });
    switchController(options.controller ?? ThemeController.system);

    // here, we can add all the variables we need to use in styling our components
    // these keys must match what is also in the tailwind.config.css file
    useHead(
      {
        style: [
          {
            key: 'rui-root',
            textContent: () => `
            :root {
              --rui-primary-light: ${get(theme)?.primaryLight};
              --rui-primary: ${get(theme)?.primary};
              --rui-primary-dark: ${get(theme)?.primaryDark};
              --rui-secondary-light: ${get(theme)?.secondaryLight};
              --rui-secondary: ${get(theme)?.secondary};
              --rui-secondary-dark: ${get(theme)?.secondaryDark};
              --rui-error-light: ${get(theme)?.errorLight};
              --rui-error: ${get(theme)?.error};
              --rui-error-dark: ${get(theme)?.errorDark};
            }
          `
          }
        ]
      },
      { mode: 'client' }
    );
  };

  return {
    themeMode,
    theme,
    config,
    isDark,
    isLight,
    init: initTheme,
    switchThemeMode,
    toggleThemeMode,
    switchController,
    setAutoController,
    toggleAutoController,
    setThemeConfig
  };
});
