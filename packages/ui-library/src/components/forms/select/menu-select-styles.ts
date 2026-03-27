import { activatorStyles, type TextInputVariant } from '@/components/forms/text-input-styles';
import { tv } from '@/utils/tv';

export type MenuSelectVariant = TextInputVariant;

/**
 * tv() styles for RuiMenuSelect. Extends activatorStyles for shared
 * activator/label/fieldset/validation core.
 *
 * IMPORTANT: tv() extend does NOT deduplicate conflicting Tailwind classes.
 */
export const menuSelectStyles = tv({
  extend: activatorStyles,
  slots: {
    menu: 'overflow-y-auto max-h-60 min-w-[2.5rem]',
    highlighted: '!bg-rui-grey-200 dark:!bg-rui-grey-800',
  },
  variants: {
    active: {
      true: {
        highlighted: '!bg-rui-grey-300 dark:!bg-rui-grey-700',
      },
    },
    // Re-declare for type inference — actual styles are in activatorStyles
    filled: {
      true: {},
    },
  },
});
