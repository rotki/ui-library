import { tv } from '@/utils/tv';

/**
 * Shared base tv() for all text-input-family components.
 * Extended by: TextField, TextArea, MenuSelect, AutoComplete, DateTimePicker.
 *
 * Provides the common core: floating label, fieldset/legend (outlined),
 * validation colors, disabled state, dark mode, and focus color.
 *
 * ## State approach (JS-driven for all 5 components)
 *
 * - `focused`: from useFocus (Group A) or computed from isOpen (Group B)
 * - `active`: focused || hasValue — drives label float
 * - `hovered`: mouseenter/mouseleave ref
 *
 * ## Legend content
 *
 * The legend's `after:content` uses CSS variable `--rui-legend`.
 * Bind via `:style="{ '--rui-legend': labelWithQuote }"` on the legend element.
 */
export const textInputBase = tv({
  slots: {
    label: 'text-rui-text-secondary transition-all duration-75',
    fieldset: [
      'absolute w-full min-w-0 h-[calc(100%+0.5rem)] top-0 left-0',
      'rounded pointer-events-none px-2 transition-all -mt-2',
      'border border-black/[0.23]',
      'dark:border-white/[0.23]',
    ].join(' '),
    legend: 'invisible text-xs truncate [max-width:calc(100%-1rem)] leading-[0]',
  },
  variants: {
    focused: {
      true: {
        fieldset: '!border-2',
      },
    },
    hovered: {
      true: {
        fieldset: 'border-black dark:border-white',
      },
    },
    disabled: {
      true: {
        fieldset: '!border-dotted !border-black/[0.23] dark:!border-white/[0.23]',
        label: 'text-rui-text-disabled',
      },
    },
    active: {
      true: {},
    },
    showLabel: {
      true: {},
    },
    validation: {
      error: {
        fieldset: '!border-rui-error',
        label: '!text-rui-error',
      },
      success: {
        fieldset: '!border-rui-success',
        label: '!text-rui-success',
      },
    },
    color: {
      primary: {},
      secondary: {},
      error: {},
      warning: {},
      info: {},
      success: {},
    },
  },
  compoundVariants: [
    // Legend padding only when label is floated (active + has label)
    { showLabel: true, active: true, class: { legend: 'px-2' } },
    // Focused + color → fieldset border takes the color
    { focused: true, color: 'primary', class: { fieldset: '!border-rui-primary' } },
    { focused: true, color: 'secondary', class: { fieldset: '!border-rui-secondary' } },
    { focused: true, color: 'error', class: { fieldset: '!border-rui-error' } },
    { focused: true, color: 'warning', class: { fieldset: '!border-rui-warning' } },
    { focused: true, color: 'info', class: { fieldset: '!border-rui-info' } },
    { focused: true, color: 'success', class: { fieldset: '!border-rui-success' } },
  ],
  defaultVariants: {
    color: 'primary',
  },
});

/**
 * Shared tv() styles for the activator-based components (Group B):
 * MenuSelect, AutoComplete, DateTimePicker.
 *
 * These use a button/div activator instead of an input element,
 * with class-based float state instead of CSS sibling combinators.
 */
export const activatorStyles = tv({
  extend: textInputBase,
  slots: {
    wrapper: 'w-full inline-flex flex-col',
    activator: [
      'relative inline-flex items-center w-full',
      'outline-none focus:outline-none focus-within:outline-none cursor-pointer',
      'min-h-14 pl-3 py-2 pr-8 rounded',
      'm-0 bg-white transition-all text-body-1 text-left',
      'dark:bg-transparent dark:text-rui-text',
    ].join(' '),
    label: '-translate-y-2 top-0 text-xs px-1',
    value: 'block truncate transition-all duration-75',
    clear: 'ml-auto shrink-0 invisible',
    icon: 'text-rui-text transition',
    iconWrapper: 'flex items-center justify-end absolute right-3 top-px bottom-0',
  },
  variants: {
    dense: {
      true: {
        activator: 'py-1.5 min-h-10',
      },
    },
    disabled: {
      true: {
        activator: 'opacity-65 text-rui-text-disabled active:text-rui-text-disabled cursor-default pointer-events-none',
      },
    },
    readonly: {
      true: {
        activator: 'opacity-80 pointer-events-none cursor-default bg-gray-50 dark:bg-white/10',
      },
    },
    outlined: {
      true: {
        activator: 'border-none hover:border-none',
      },
      false: {
        activator: [
          'hover:bg-gray-100 focus-within:bg-gray-100',
          'dark:hover:bg-white/10 dark:focus-within:bg-white/10',
        ].join(' '),
      },
    },
  },
  compoundVariants: [
    // Focused → label gets primary color (Group B default)
    { focused: true, class: { label: 'text-rui-primary' } },
    // Non-outlined + disabled in dark mode
    { outlined: false, disabled: true, class: { activator: 'dark:bg-white/10' } },
  ],
  defaultVariants: {
    outlined: false,
    dense: false,
    disabled: false,
    readonly: false,
  },
});

/**
 * Shared tv() styles for dropdown menu items.
 * Used by MenuSelect and AutoComplete.
 */
export const dropdownMenuStyles = tv({
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
  },
});
