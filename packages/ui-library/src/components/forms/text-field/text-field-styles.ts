import { textInputBase } from '@/components/forms/text-input-styles';
import { tv } from '@/utils/tv';

/**
 * tv() styles for RuiTextField: a 36px box (32px dense) with 14px text and the bordered `fieldset`
 * from textInputBase. The label sits above in RuiFieldLabel, so the placeholder is always shown.
 *
 * `text-sm/6` rather than `text-sm`: the bare class sets a 20px line, which makes a 32px box.
 *
 * IMPORTANT: tv() extend does NOT deduplicate conflicting Tailwind classes between base and
 * extension, so the fieldset's classes live only in textInputBase.
 */
export const textFieldStyles = tv({
  extend: textInputBase,
  slots: {
    // Re-declare the base slot for type inference (extend merges classes at runtime)
    fieldset: '',
    wrapper: 'relative w-full flex items-center rounded-rui-control bg-white dark:bg-transparent',
    input: [
      'peer w-full bg-transparent px-3 py-1.5 text-sm/6 text-rui-text outline-hidden',
      'placeholder:text-rui-neutral-500 dark:placeholder:text-rui-neutral-400',
    ].join(' '),
    inputWrapper: 'flex flex-1',
    prepend: 'flex items-center gap-1 shrink-0 pl-3',
    append: 'flex items-center gap-1 shrink-0 pr-1.5',
    icon: 'text-rui-neutral-500 dark:text-rui-neutral-400',
    details: 'pt-1',
    clearButton: '!p-1.5',
  },
  variants: {
    dense: {
      true: { input: 'py-1' },
    },
    // Icons keep the neutral tone; the color goes to the text around them
    textColor: {
      primary: { prepend: 'text-rui-primary', append: 'text-rui-primary', input: 'text-rui-primary' },
      secondary: { prepend: 'text-rui-secondary', append: 'text-rui-secondary', input: 'text-rui-secondary' },
      error: { prepend: 'text-rui-error', append: 'text-rui-error', input: 'text-rui-error' },
      warning: { prepend: 'text-rui-warning', append: 'text-rui-warning', input: 'text-rui-warning' },
      info: { prepend: 'text-rui-info', append: 'text-rui-info', input: 'text-rui-info' },
      success: { prepend: 'text-rui-success', append: 'text-rui-success', input: 'text-rui-success' },
    },
    disabled: {
      true: { wrapper: 'bg-rui-neutral-50 dark:bg-rui-neutral-900' },
    },
  },
});
