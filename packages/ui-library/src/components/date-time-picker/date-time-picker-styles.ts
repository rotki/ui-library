import { activatorStyles, type TextInputVariant } from '@/components/forms/text-input-styles';
import { tv } from '@/utils/tv';

export type DateTimePickerVariant = TextInputVariant;

/**
 * Overrides the `value` slot for flex-wrap + left padding (prepend icon),
 * and adds `iconPrepend` slot for the calendar icon.
 */
export const dateTimePickerStyles = tv({
  extend: activatorStyles,
  slots: {
    value: 'flex gap-1 flex-wrap flex-1 ps-8 transition-all duration-75',
    iconPrepend: 'flex items-center justify-end absolute top-px bottom-0 left-3',
  },
  variants: {
    // Re-declare for type inference — actual styles are in activatorStyles
    filled: { true: {} },
  },
});
