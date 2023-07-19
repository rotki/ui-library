import { type BasicColorSchema } from '@vueuse/core';
import { contextColors } from '@/consts/colors';
import { type GeneratedIcon } from '@/types/icons';
import type { ComputedRef, Ref } from 'vue';

export const ThemeMode = {
  auto: 'auto',
  light: 'light',
  dark: 'dark',
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
  theme: Ref<ThemeData | undefined>;
  store: Ref<ThemeMode | BasicColorSchema>;
  state: ComputedRef<ThemeMode | BasicColorSchema>;
  config: Ref<ThemeConfig | undefined>;
  isAutoControlled: ComputedRef<boolean>;
  isDark: ComputedRef<boolean>;
  isLight: ComputedRef<boolean>;
  init: (options: InitThemeOptions) => void;
  switchThemeScheme: (mode: ThemeMode) => void;
  toggleThemeMode: () => void;
  setThemeConfig: (newConfig: ThemeConfig) => void;
}

const createDefaultTheme = (theme: 'light' | 'dark') =>
  Object.fromEntries(
    contextColors.map((color) => [
      color,
      {
        DEFAULT: `var(--rui-${theme}-${color}-main)`,
        lighter: `var(--rui-${theme}-${color}-lighter)`,
        darker: `var(--rui-${theme}-${color}-darker)`,
      },
    ]),
  );

export const defaultTheme: ThemeConfig = {
  light: createDefaultTheme('light'),
  dark: createDefaultTheme('dark'),
};
