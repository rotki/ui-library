import { type BasicColorSchema } from '@vueuse/core';
import type { ComputedRef, Ref } from 'vue-demi';

export const enum ThemeMode {
  auto = 'auto',
  light = 'light',
  dark = 'dark'
}

export interface ThemeData {
  primaryLight: string;
  primary: string;
  primaryDark: string;
  secondaryLight: string;
  secondary: string;
  secondaryDark: string;
  errorLight: string;
  error: string;
  errorDark: string;
}

export interface ThemeConfig {
  light: ThemeData;
  dark: ThemeData;
}

export interface InitThemeOptions {
  mode?: ThemeMode;
  config?: ThemeConfig;
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

export const defaultTheme: ThemeConfig = {
  light: {
    primaryLight: '176 107 87',
    primary: '126 74 59',
    primaryDark: '99 58 46',
    secondaryLight: '66 165 245',
    secondary: '25 118 210',
    secondaryDark: '21 110 192',
    errorLight: '239 83 80',
    error: '211 47 47',
    errorDark: '198 40 40'
  },
  dark: {
    primaryLight: '226 201 194',
    primary: '208 166 154',
    primaryDark: '189 131 114',
    secondaryLight: '227 242 253',
    secondary: '144 202 249',
    secondaryDark: '66 165 245',
    errorLight: '229 115 115',
    error: '244 67 54',
    errorDark: '211 47 47'
  }
};
