import { activatorStyles } from '@/components/forms/text-input-styles';
import { tv } from '@/utils/tv';

/**
 * Overrides the `value` slot for flex-wrap chip layout.
 */
export const autoCompleteStyles = tv({
  extend: activatorStyles,
  slots: {
    value: 'flex gap-1 flex-wrap flex-1 transition-all duration-75',
    prepend: 'flex items-center shrink-0 me-2 text-rui-neutral-500 dark:text-rui-neutral-400',
  },
});
