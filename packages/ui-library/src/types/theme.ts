import type { BasicColorMode, BasicColorSchema } from '@vueuse/core';
import type { ComputedRef, Ref } from 'vue';
import type { GeneratedIcon } from '@/types/icons';
import { contextColors } from '@/consts/colors';

export const ThemeMode = {
  auto: 'auto',
  dark: 'dark',
  light: 'light',
} as const;

export type ThemeMode = (typeof ThemeMode)[keyof typeof ThemeMode];

export interface ColorIntensity {
  DEFAULT: string;
  lighter: string;
  darker: string;
}

export type ThemeData = {
  [key in string]: ColorIntensity;
};

export interface ThemeConfig {
  light: ThemeData;
  dark: ThemeData;
}

export interface InitThemeOptions {
  mode?: ThemeMode;
  config?: ThemeConfig;
  icons?: GeneratedIcon[];
}

export interface ThemeContent {
  config: Ref<ThemeConfig>;
  init: (options: InitThemeOptions) => void;
  isAutoControlled: ComputedRef<boolean>;
  isDark: ComputedRef<boolean>;
  isLight: ComputedRef<boolean>;
  setThemeConfig: (newConfig: ThemeConfig) => void;
  state: ComputedRef<ThemeMode | BasicColorMode>;
  store: Ref<ThemeMode | BasicColorSchema>;
  switchThemeScheme: (mode: ThemeMode) => void;
  theme: ComputedRef<ThemeData>;
  toggleThemeMode: () => void;
}

function createDefaultTheme(theme: 'light' | 'dark') {
  return Object.fromEntries(
    contextColors.map(color => [
      color,
      {
        darker: `var(--rui-${theme}-${color}-darker)`,
        DEFAULT: `var(--rui-${theme}-${color}-main)`,
        lighter: `var(--rui-${theme}-${color}-lighter)`,
      },
    ]),
  );
}

export const defaultTheme: ThemeConfig = {
  dark: createDefaultTheme('dark'),
  light: createDefaultTheme('light'),
};
