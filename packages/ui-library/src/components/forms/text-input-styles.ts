import { tv } from '@/utils/tv';

/**
 * The bordered box every text input draws: a `fieldset` laid over the field, so consumer overrides
 * that target `[&_fieldset]` keep working. Extended by RuiTextField and RuiTextArea; the activator
 * styles below carry their own copy, keyed by `opened` rather than `focused`.
 *
 * The box is 1px in every state. Hover darkens it, focus colors it and adds a soft ring, and a
 * validation state colors both.
 *
 * The fieldset is forced onto its own GPU layer so its border is rasterized on integer pixel
 * boundaries; at fractional y-coordinates with a device pixel ratio such as 1.25, Chromium otherwise
 * anti-aliases it across two physical pixel rows.
 */
export const textInputBase = tv({
  slots: {
    fieldset: [
      'absolute top-0 left-0 w-full h-full min-w-0',
      'rounded-rui-control pointer-events-none transition-all',
      'border border-rui-outline',
      'transform-gpu',
    ].join(' '),
  },
  variants: {
    // a step past the 3:1 resting edge; a disabled field drops to the divider, as nothing to act on
    hovered: {
      true: { fieldset: 'border-rui-neutral-500 dark:border-rui-neutral-400' },
    },
    focused: {
      true: { fieldset: 'ring-3 ring-rui-primary/20' },
    },
    disabled: {
      true: { fieldset: '!border-rui-divider' },
    },
    validation: {
      error: { fieldset: '!border-rui-error ring-rui-error/20' },
      success: { fieldset: '!border-rui-success ring-rui-success/20' },
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
 * Shared tv() styles for the activator-based components: RuiMenuSelect, RuiAutoComplete,
 * RuiDateTimePicker. A 36px box (32px dense) with 14px text whose content is centred, so only
 * wrapped tags grow it.
 *
 * The wrapper is `w-full inline-flex flex-col` so an activator fills its parent whatever the
 * context. A consumer's own width utility would normally collide with `w-full` on the same element
 * and lose to cascade order, so the components route consumer classes through
 * `ui.wrapper(\{ class \})`, where twMerge deduplicates them and the consumer's width wins.
 */
export const activatorStyles = tv({
  slots: {
    wrapper: 'w-full inline-flex flex-col',
    activator: [
      'group relative inline-flex items-center w-full',
      'outline-hidden focus:outline-hidden focus-within:outline-hidden cursor-pointer',
      'min-h-9 py-0.5 pl-3 pr-8 rounded-rui-control',
      'm-0 transition-colors duration-150 text-sm/5 text-left',
      'bg-white dark:bg-transparent dark:text-rui-text border-none hover:border-none',
    ].join(' '),
    fieldset: [
      'absolute top-0 left-0 w-full h-full min-w-0',
      'rounded-rui-control pointer-events-none transition-all',
      'border border-rui-outline',
      'transform-gpu',
    ].join(' '),
    value: 'w-full block truncate',
    clear: 'ml-auto shrink-0 invisible group-hover:!visible',
    menu: 'overflow-y-auto max-h-60 min-w-[2.5rem]',
    // the grey list button's hover and active tints, so options and menu buttons highlight alike
    highlighted: '!bg-rui-hover',
    progress: 'absolute left-0 bottom-0 w-full',
    icon: 'text-rui-text transition',
    iconWrapper: 'flex items-center justify-end absolute right-2 top-px bottom-0',
  },
  variants: {
    dense: {
      true: { activator: 'min-h-8' },
    },
    // the dark text color is restated, since the base `dark:text-rui-text` outranks a plain color
    disabled: {
      true: {
        activator: 'bg-rui-neutral-50 dark:bg-rui-neutral-900 text-rui-text-disabled dark:text-rui-text-disabled active:text-rui-text-disabled cursor-default pointer-events-none',
        icon: 'text-rui-text-disabled',
        fieldset: '!border-rui-divider',
      },
    },
    readonly: {
      // an inset well: below the card in both themes, where white/10 lifted it above
      true: { activator: 'opacity-80 pointer-events-none cursor-default bg-rui-surface-sunken' },
    },
    hovered: {
      true: { fieldset: 'border-rui-neutral-500 dark:border-rui-neutral-400' },
    },
    opened: {
      true: {
        icon: 'rotate-180',
        fieldset: '!border-rui-primary ring-3 ring-rui-primary/20',
      },
    },
    hasError: {
      true: { fieldset: '!border-rui-error ring-rui-error/20' },
    },
    hasSuccess: {
      true: { fieldset: '!border-rui-success ring-rui-success/20' },
    },
    active: {
      true: { highlighted: '!bg-rui-pressed' },
    },
  },
  defaultVariants: {
    dense: false,
    disabled: false,
    readonly: false,
    opened: false,
  },
});
