import type { ComputedRef } from 'vue';

export function useLabelWithQuote(
  label: () => string,
  required: () => boolean,
): ComputedRef<string> {
  return computed<string>(() => {
    const labelVal = label();
    if (!labelVal)
      return '"\\200B"';

    const asterisk = required() ? '﹡' : '';
    return `'  ${labelVal}${asterisk}  '`;
  });
}
