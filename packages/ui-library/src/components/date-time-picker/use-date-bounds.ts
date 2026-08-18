import type { ComputedRef, Ref } from 'vue';
import dayjs, { type Dayjs } from 'dayjs';
import { resolveBound } from '@/components/date-time-picker/segment-utils';
import { useRuiI8n } from '@/composables/use-rui-i18n';
import { RUI_I18N_KEYS } from '@/i18n/keys';

interface DateBoundsOptions {
  minDate: Date | number | undefined;
  maxDate: Date | number | 'now' | undefined;
  /** Whether a numeric bound is stated in whole seconds rather than milliseconds. */
  epochSeconds: boolean;
  /**
   * The field's own format, so a bound named in an error message is written the
   * same way round as the value the user is looking at.
   */
  dateFormat: Ref<string>;
  /** The clock a `now` maximum follows, kept current by the caller. */
  now: Ref<Dayjs>;
}

interface DateBoundsReturn {
  minAllowedDate: ComputedRef<Date>;
  maxAllowedDate: ComputedRef<Date | undefined>;
  internalErrorMessages: Ref<string[]>;
  isDateValid: (date: Dayjs) => boolean;
}

/**
 * The range a picked date has to sit in, and the message explaining a date that
 * does not.
 */
export function useDateBounds({
  dateFormat,
  epochSeconds,
  maxDate,
  minDate,
  now,
}: DateBoundsOptions): DateBoundsReturn {
  const { t } = useRuiI8n();

  const internalErrorMessages = ref<string[]>([]);

  const minAllowedDate = computed<Date>(
    () => resolveBound(minDate, epochSeconds) ?? new Date(1970, 0, 1),
  );

  const maxAllowedDate = computed<Date | undefined>(
    () => (maxDate === 'now' ? get(now).toDate() : resolveBound(maxDate, epochSeconds)),
  );

  /**
   * Writes a bound the way the field writes its value. `toLocaleDateString()`
   * followed the browser locale and ignored the picker's own format, so a
   * day-first field could report its limit month-first, and it dropped the time
   * entirely, which left a mid-day bound unable to explain itself.
   */
  function formatBound(bound: Date): string {
    return dayjs(bound).format(get(dateFormat));
  }

  function isDateValid(date: Dayjs): boolean {
    const min = get(minAllowedDate);
    const max = get(maxAllowedDate);

    set(internalErrorMessages, []);

    if (min && date.isBefore(min)) {
      const formatted = formatBound(min);
      const errorMessage = t(RUI_I18N_KEYS.dateTimePicker.dateBeforeMin, {
        date: formatted,
      }, `Date cannot be before ${formatted}`);
      set(internalErrorMessages, [...get(internalErrorMessages), errorMessage]);
      return false;
    }

    if (max && date.isAfter(max)) {
      const formatted = formatBound(max);
      const nowError = t(RUI_I18N_KEYS.dateTimePicker.dateInFuture, 'The selected date cannot be in the future');
      const maxError = t(RUI_I18N_KEYS.dateTimePicker.dateAfterMax, { date: formatted }, `Date cannot be after ${formatted}`);
      const errorMessage = maxDate === 'now' ? nowError : maxError;
      set(internalErrorMessages, [...get(internalErrorMessages), errorMessage]);
      return false;
    }

    return true;
  }

  return {
    internalErrorMessages,
    isDateValid,
    maxAllowedDate,
    minAllowedDate,
  };
}
