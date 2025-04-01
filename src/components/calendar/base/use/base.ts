import {
  computed,
  type ExtractPropTypes,
  inject,
  type PropType,
  provide,
} from 'vue';
import { Attribute } from '../utils/attribute';
import { addDays, type DayOfWeek } from '../utils/date/helpers';
import { type DarkModeConfig, getDefault } from '../utils/defaults';
import { isObject } from '../utils/helpers';
import { Locale, type LocaleConfig } from '../utils/locale';
import { Theme } from '../utils/theme';

const contextKey = Symbol('__vc_base_context__');

export const propsDef = {
  color: {
    default: () => getDefault('color'),
    type: String,
  },
  disabledDates: null,
  firstDayOfWeek: Number as PropType<DayOfWeek>,
  isDark: {
    default: () => getDefault('isDark'),
    type: [Boolean, String, Object] as PropType<
      DarkModeConfig
    >,
  },
  locale: [String, Object] as PropType<string | Record<string, any> | Locale>,
  masks: Object,
  maxDate: null,
  minDate: null,
  timezone: String,
};

export type BaseProps = Readonly<ExtractPropTypes<typeof propsDef>>;

export type BaseContext = ReturnType<typeof createBase>;

export function createBase(props: BaseProps) {
  // #region Computed

  const color = computed(() => props.color ?? '');
  const isDark = computed(() => props.isDark ?? false);
  const displayMode = computed(() => props.isDark ? 'dark' : 'light');
  const theme = computed(() => new Theme(color.value));

  const locale = computed(() => {
    // Return the locale prop if it is an instance of the Locale class
    if (props.locale instanceof Locale)
      return props.locale;
    // Build up a base config from component props
    const config = (
      isObject(props.locale)
        ? props.locale
        : {
            firstDayOfWeek: props.firstDayOfWeek,
            id: props.locale,
            masks: props.masks,
          }
    ) as Partial<LocaleConfig>;
    // Return new locale
    return new Locale(config, props.timezone);
  });

  const masks = computed(() => locale.value.masks);

  const minDate = computed(() => props.minDate);
  const maxDate = computed(() => props.maxDate);

  const disabledDates = computed(() => {
    const dates: any[] = props.disabledDates ? [...props.disabledDates] : [];
    // Add disabled range for min date
    if (minDate.value != null) {
      dates.push({
        end: addDays(locale.value.toDate(minDate.value), -1),
        start: null,
      });
    }
    // Add disabled range for max date
    if (maxDate.value != null) {
      dates.push({
        end: null,
        start: addDays(locale.value.toDate(maxDate.value), 1),
      });
    }
    return locale.value.ranges(dates);
  });

  const disabledAttribute = computed(() => new Attribute(
    {
      dates: disabledDates.value,
      key: 'disabled',
      order: 100,
    },
    theme.value,
    locale.value,
  ));

  // #endregion Computed

  const context = {
    color,
    disabledAttribute,
    disabledDates,
    displayMode,
    isDark,
    locale,
    masks,
    maxDate,
    minDate,
    theme,
  };
  provide(contextKey, context);
  return context;
}

export function useOrCreateBase(props: BaseProps) {
  return inject<BaseContext>(contextKey, () => createBase(props), true);
}
