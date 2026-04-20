import { tv } from '@/utils/tv';

export const TextInputVariant = {
  default: 'default',
  filled: 'filled',
  outlined: 'outlined',
} as const;

export type TextInputVariant = (typeof TextInputVariant)[keyof typeof TextInputVariant];

/**
 * Shared underline pseudo-element classes for default and filled variants.
 * Used by TextField and TextArea label slots.
 */
export const underlinePseudo = [
  'border-b border-black/[0.42] dark:border-white/[0.42]',
  'after:content-[\'\'] after:absolute after:bottom-0 after:left-0 after:block after:w-full',
  'after:scale-x-0 after:border-b-2 after:mb-[-1px] after:transition-transform after:duration-300',
  'after:border-black dark:after:border-white',
].join(' ');

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
    legend: 'invisible text-[0.75rem] truncate [max-width:calc(100%-1rem)] leading-[0]',
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
 * IMPORTANT: tv() extend does NOT deduplicate conflicting Tailwind classes.
 * Never put a class in the base slot that a variant needs to override.
 *
 * State-driven via JS refs: `outlined`, `float` (open || hasValue),
 * `opened`, `disabled`, `readonly`, `dense`.
 */
export const activatorStyles = tv({
  extend: textInputBase,
  slots: {
    // Re-declare base slots for type inference
    fieldset: '',
    legend: '',
    // `w-full inline-flex flex-col` so the activator fills its parent
    // regardless of context (block, flex-row, grid). A consumer-passed
    // width utility like `w-[20rem]` would normally collide with `w-full`
    // on the same element and lose to cascade order; RuiAutoComplete /
    // RuiMenuSelect / RuiDateTimePicker route consumer classes through
    // `ui.wrapper({ class })` so tailwind-variants' twMerge deduplicates
    // and the consumer's width wins.
    wrapper: 'w-full inline-flex flex-col',
    activator: [
      'group relative inline-flex items-center w-full',
      'outline-none focus:outline-none focus-within:outline-none cursor-pointer',
      'min-h-14 pl-4 py-2 pr-8 rounded',
      'm-0 transition-all text-body-1 text-left',
      'dark:text-rui-text',
    ].join(' '),
    label: [
      'text-rui-text-secondary [max-width:calc(100%-2.5rem)]',
      'block truncate transition-all duration-75',
    ].join(' '),
    value: 'w-full block truncate transition-all duration-75',
    clear: 'ml-auto shrink-0 invisible group-hover:!visible',
    menu: 'overflow-y-auto max-h-60 min-w-[2.5rem]',
    highlighted: '!bg-rui-grey-200 dark:!bg-rui-grey-800',
    progress: 'absolute left-0 bottom-0 w-full',
    icon: 'text-rui-text transition',
    iconWrapper: 'flex items-center justify-end absolute right-3 top-px bottom-0',
    required: 'text-rui-error',
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
    filled: {
      true: {
        activator: [
          '!rounded-t !rounded-b-none !bg-black/[0.06]',
          '!hover:bg-black/[0.09] !focus-within:bg-black/[0.09]',
          'dark:!bg-white/[0.09]',
          'dark:!hover:bg-white/[0.13] dark:!focus-within:bg-white/[0.13]',
          underlinePseudo,
        ].join(' '),
      },
    },
    outlined: {
      true: {
        activator: 'bg-white dark:bg-transparent border-none hover:border-none',
        label: 'absolute',
        fieldset: '!mt-0 !h-full',
      },
      false: {
        activator: `!rounded-none ${underlinePseudo}`,
      },
    },
    float: {
      true: {
        label: '-translate-y-2 top-0 text-[0.75rem] leading-4',
      },
    },
    opened: {
      true: {
        icon: 'rotate-180',
      },
    },
    active: {
      true: {
        highlighted: '!bg-rui-grey-300 dark:!bg-rui-grey-700',
      },
    },
    hasError: {
      true: {},
    },
    hasSuccess: {
      true: {},
    },
  },
  compoundVariants: [
    // Legend padding when label is floated
    { float: true, class: { legend: 'px-2' } },

    // Non-outlined + opened → underline scales up
    { outlined: false, opened: true, class: { activator: 'after:scale-x-100 after:border-rui-primary' } },

    // Non-outlined + error → underline color
    { outlined: false, hasError: true, class: { activator: 'after:scale-x-100 after:!border-rui-error' } },

    // Non-outlined + success → underline color
    { outlined: false, hasSuccess: true, class: { activator: 'after:scale-x-100 after:!border-rui-success' } },

    // Non-outlined + disabled in dark mode
    { outlined: false, disabled: true, class: { activator: 'dark:bg-white/10' } },

    // Filled + disabled
    { filled: true, disabled: true, class: { activator: 'bg-black/[0.03] dark:bg-white/[0.05]' } },

    // Outlined + hovered → fieldset border
    { outlined: true, hovered: true, class: { fieldset: 'border-black dark:border-white' } },

    // Outlined + opened/focused → primary border
    { outlined: true, opened: true, class: {
      fieldset: '!border-rui-primary !border-2',
      label: 'text-rui-primary',
    } },

    // Outlined + error → fieldset + label
    { outlined: true, hasError: true, class: {
      fieldset: '!border-rui-error',
      label: '!text-rui-error',
    } },
    // Outlined + success → fieldset + label
    { outlined: true, hasSuccess: true, class: {
      fieldset: '!border-rui-success',
      label: '!text-rui-success',
    } },

    // Outlined + disabled → dotted fieldset
    { outlined: true, disabled: true, class: {
      fieldset: '!border-dotted !border-black/[0.23] dark:!border-white/[0.23]',
    } },

    // Float + opened → label color
    { float: true, opened: true, class: { label: 'text-rui-primary' } },
  ],
  defaultVariants: {
    filled: false,
    outlined: false,
    dense: false,
    disabled: false,
    readonly: false,
    float: false,
    opened: false,
  },
});
