export const RUI_I18N_KEYS = {
  dateTimePicker: {
    dateAfterMax: 'rui.date_time_picker.date_after_max',
    dateBeforeMin: 'rui.date_time_picker.date_before_min',
    dateInFuture: 'rui.date_time_picker.date_in_future',
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
