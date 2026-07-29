export const RUI_I18N_KEYS = {
  dateTimePicker: {
    clear: 'rui.date_time_picker.clear',
    clearValue: 'rui.date_time_picker.clear_value',
    closeCalendar: 'rui.date_time_picker.close_calendar',
    dateAfterMax: 'rui.date_time_picker.date_after_max',
    dateBeforeMin: 'rui.date_time_picker.date_before_min',
    dateInFuture: 'rui.date_time_picker.date_in_future',
    label: 'rui.date_time_picker.label',
    now: 'rui.date_time_picker.now',
    openCalendar: 'rui.date_time_picker.open_calendar',
    today: 'rui.date_time_picker.today',
  },
  timezoneSelect: {
    label: 'rui.timezone_select.label',
  },
} as const;

function flattenKeys(obj: Record<string, any>): string[] {
  return Object.values(obj).flatMap(value =>
    typeof value === 'string' ? [value] : flattenKeys(value),
  );
}

/**
 * Retrieves all translation keys available in the library.
 *
 * @return {string[]} An array of strings representing flattened translation keys.
 */
export function translationKeys(): string[] {
  return flattenKeys(RUI_I18N_KEYS);
}
