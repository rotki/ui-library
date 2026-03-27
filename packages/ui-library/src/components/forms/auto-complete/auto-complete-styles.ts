import { activatorStyles, type TextInputVariant } from '@/components/forms/text-input-styles';
import { tv } from '@/utils/tv';

export type AutoCompleteVariant = TextInputVariant;

/**
 * Overrides the `value` slot for flex-wrap chip layout.
 */
export const autoCompleteStyles = tv({
  extend: activatorStyles,
  slots: {
    value: 'flex gap-1 flex-wrap flex-1 transition-all duration-75',
  },
  variants: {
    // Re-declare for type inference — actual styles are in activatorStyles
    filled: { true: {} },
  },
});
