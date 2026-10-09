import { textInputBase } from '@/components/forms/text-input-styles';
import { tv } from '@/utils/tv';

/**
 * tv() styles for RuiTextArea: an even 8px padding, 14px text and the text field's bordered
 * `fieldset`, focus and disabled treatment from textInputBase. The label sits above in
 * RuiFieldLabel, so the placeholder is always shown.
 *
 * The append area is absolutely placed, so the textarea reserves its width (`--append-w`) as right
 * padding.
 *
 * IMPORTANT: tv() extend does NOT deduplicate conflicting Tailwind classes between base and
 * extension, so the fieldset's classes live only in textInputBase.
 */
export const textAreaStyles = tv({
  extend: textInputBase,
  slots: {
    fieldset: '',
    wrapper: 'relative w-full min-w-[12.5rem] flex items-start rounded-rui-control bg-white dark:bg-transparent',
    inputWrapper: 'flex flex-1 pt-2',
    textarea: [
      'peer w-full bg-transparent pt-0 pb-2 px-3 [padding-right:calc(0.75rem+var(--append-w,0px))]',
      'text-sm/6 text-rui-text outline-hidden',
      'placeholder:text-rui-neutral-500 dark:placeholder:text-rui-neutral-400',
    ].join(' '),
    textareaSizer: 'invisible absolute top-0 left-0 w-full h-0 -z-10 pointer-events-none px-3 text-sm',
    // both sides are one 24px line tall and start where the text does, so icons center on the first line
    prepend: 'flex items-center gap-1 shrink-0 h-6 mt-2 ml-3',
    append: 'flex items-center gap-1 shrink-0 absolute right-0 h-6 mt-2 mr-3',
    icon: 'text-rui-neutral-500 dark:text-rui-neutral-400',
    details: 'pt-1',
    // 24px round a 16px glyph; as the last control it pulls into the inset by its own padding
    clearButton: [
      '!p-1 last:-mr-1',
      'text-rui-neutral-500 dark:text-rui-neutral-400 hover:text-rui-text dark:hover:text-rui-text',
    ].join(' '),
  },
  variants: {
    // 4px above and below the text rather than 8px, the 4px the dense text field drops
    dense: {
      true: {
        inputWrapper: 'pt-1',
        textarea: 'pb-1',
        textareaSizer: 'pb-1',
        prepend: 'mt-1',
        append: 'mt-1',
      },
    },
    noResize: {
      true: { textarea: 'resize-none' },
      false: { textarea: 'resize-y' },
    },
    // Icons keep the neutral tone; the color goes to the text around them
    textColor: {
      primary: { prepend: 'text-rui-primary', append: 'text-rui-primary', textarea: 'text-rui-primary' },
      secondary: { prepend: 'text-rui-secondary', append: 'text-rui-secondary', textarea: 'text-rui-secondary' },
      error: { prepend: 'text-rui-error', append: 'text-rui-error', textarea: 'text-rui-error' },
      warning: { prepend: 'text-rui-warning', append: 'text-rui-warning', textarea: 'text-rui-warning' },
      info: { prepend: 'text-rui-info', append: 'text-rui-info', textarea: 'text-rui-info' },
      success: { prepend: 'text-rui-success', append: 'text-rui-success', textarea: 'text-rui-success' },
    },
    disabled: {
      true: { wrapper: 'bg-rui-neutral-50 dark:bg-rui-neutral-900' },
    },
    // the activators' read-only fill, restated for dark over the base `dark:bg-transparent`
    readonly: {
      true: { wrapper: 'bg-rui-surface-muted dark:bg-rui-surface-muted' },
    },
  },
  defaultVariants: {
    noResize: false,
  },
});
