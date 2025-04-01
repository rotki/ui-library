import { type App, computed, reactive } from 'vue';
import { defaultsDeep, get, has, mapValues } from '../helpers';
import locales from './locales';
import masks from './masks.json';
import touch from './touch.json';

declare const window: any;

interface DatePickerPopoverDefaults {
  visibility?: string;
  placement?: string;
  isInteractive?: boolean;
}

interface DatePickerDefaults {
  updateOnInput?: boolean;
  inputDebounce?: number;
  popover?: DatePickerPopoverDefaults;
}

interface DarkModeClassConfig {
  selector: string;
  darkClass: string;
}

export type DarkModeConfig = boolean | 'system' | Partial<DarkModeClassConfig>;

export interface Defaults {
  componentPrefix?: string;
  color?: string;
  isDark?: DarkModeConfig;
  navVisibility?: string;
  titlePosition?: string;
  transition?: string;
  touch?: object;
  masks?: object;
  locales?: any;
  datePicker?: DatePickerDefaults;
}

const defaultConfig: Defaults = {
  color: 'blue',
  componentPrefix: 'V',
  datePicker: {
    inputDebounce: 1000,
    popover: {
      isInteractive: true,
      placement: 'bottom-start',
      visibility: 'hover-focus',
    },
    updateOnInput: true,
  },
  isDark: false,
  locales,
  masks,
  navVisibility: 'click',
  titlePosition: 'center',
  touch,
  transition: 'slide-h',
};

const state = reactive(defaultConfig);

const defaultLocales = computed(() => mapValues(state.locales, (l: any) => {
  l.masks = defaultsDeep(l.masks, state.masks);
  return l;
}));

export { defaultLocales };

export function getDefault(path: string) {
  if (typeof window !== 'undefined' && has(window.__vcalendar__, path)) {
    return get(window.__vcalendar__, path);
  }
  return get(state, path);
}

export function setupDefaults(app: App, userDefaults: Defaults | undefined) {
  app.config.globalProperties.$VCalendar = state;
  return Object.assign(state, defaultsDeep(userDefaults, state));
}
