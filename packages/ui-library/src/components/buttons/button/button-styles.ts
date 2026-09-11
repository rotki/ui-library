import { tv } from '@/utils/tv';

/**
 * The button's classes.
 *
 * Three decisions the class lists cannot state themselves:
 *
 * `position: relative` is not in the base root: it is only a positioning
 * context for the loading spinner, so the `loading` variant applies it.
 * Basing it here would collide with consumers pinning the button with
 * `fixed`/`absolute`, since cascade order picks the later utility, usually
 * `relative`, and turns their `right-*`/`bottom-*` into relative offsets,
 * which misplaces FABs.
 *
 * Icon sizing flows through the `--rui-icon-size` custom property, seeded at
 * the md value in the base root and redefined per size variant with `!` so a
 * variant beats the baseline on the same element regardless of source order.
 * RuiIcon's own `size` prop stamps an inline style on the svg, which beats the
 * inherited value, so a consumer always wins. See rotki/ui-library#512.
 *
 * `disabled` on the element covers two states: actually disabled, and loading,
 * since RuiButton sets `disabled = disabled || loading`. Only the cursor is
 * shared between them; the grey disabled palette lives in the `loading: false`
 * compounds, so a loading button keeps its variant color behind the spinner.
 *
 * An icon-only button matches the height of the text button of the same size,
 * with a 60-70% glyph ratio, which is a larger glyph than the same size gives
 * a prepend/append icon so it does not look lost in the square. xs pads by an
 * arbitrary 0.1875rem because no Tailwind token holds the ratio at a 14px
 * glyph:
 *
 * ```
 * xs            p-[0.1875rem] + 0.875rem icon = 1.25rem (20px)   70%
 * sm            p-1           + 1.25rem  icon = 1.75rem (28px)   71%
 * md (default)  p-1.5         + 1.25rem  icon = 2rem    (32px)   63%
 * lg            p-1.5         + 1.5rem   icon = 2.25rem (36px)   67%
 * xl            p-2           + 1.5rem   icon = 2.5rem  (40px)   60%
 * 2xl           p-2           + 1.75rem  icon = 2.75rem (44px)   64%
 * ```
 */
export const buttonStyles = tv({
  slots: {
    root: [
      'text-sm leading-5 font-medium outline outline-1 outline-transparent outline-offset-[-1px]',
      'flex items-center justify-center gap-x-2',
      'px-4 py-1.5 rounded transition-all',
      '[--rui-icon-size:1.125rem]',
      'disabled:cursor-not-allowed',
      'focus-visible:!ring-2',
    ].join(' '),
    label: 'inline-block text-nowrap',
    spinner: 'absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2',
  },
  variants: {
    variant: {
      default: {},
      outlined: {},
      text: { root: 'px-2' },
      fab: { root: 'rounded-full py-2' },
      // The label's 18px line-box matches the md icon box, so the two share an optical center (rotki/ui-library#515)
      list: { root: 'p-3 px-3 rounded-none w-full justify-start text-left', label: 'w-full leading-[1.125rem]' },
    },
    size: {
      'xs': { root: 'px-2 py-[0.125rem] text-[.75rem] leading-4 ![--rui-icon-size:0.75rem]' },
      'sm': { root: 'px-2.5 py-1 text-[.8125rem] leading-5 ![--rui-icon-size:1rem]' },
      'lg': { root: 'px-6 py-2 text-[1rem] leading-5 ![--rui-icon-size:1.25rem]' },
      // 40px, to line up with RuiTextField / RuiMenuSelect in a toolbar; a 44px jumbo CTA is `2xl`
      'xl': { root: 'px-6 py-2 text-[1rem] leading-6 ![--rui-icon-size:1.375rem]' },
      '2xl': { root: 'px-6 py-2.5 text-[1rem] leading-6 ![--rui-icon-size:1.375rem]' },
    },
    color: {
      grey: { root: 'bg-rui-grey-200 hover:bg-rui-grey-100 active:bg-rui-grey-50 text-rui-text ring-rui-grey-400 dark:bg-rui-grey-300 dark:text-rui-light-text dark:ring-rui-grey-600' },
      primary: { root: 'bg-rui-primary hover:bg-rui-primary-darker active:bg-rui-primary-darker/90 text-rui-dark-text ring-rui-primary/40 dark:text-rui-text dark:ring-rui-primary/60' },
      secondary: { root: 'bg-rui-secondary hover:bg-rui-secondary-darker active:bg-rui-secondary-darker/90 text-rui-dark-text ring-rui-secondary/40 dark:text-rui-text dark:ring-rui-secondary/60' },
      error: { root: 'bg-rui-error hover:bg-rui-error-darker active:bg-rui-error-darker/90 text-rui-dark-text ring-rui-error/40 dark:text-rui-text dark:ring-rui-error/60' },
      warning: { root: 'bg-rui-warning hover:bg-rui-warning-darker active:bg-rui-warning-darker/90 text-rui-dark-text ring-rui-warning/40 dark:text-rui-text dark:ring-rui-warning/60' },
      info: { root: 'bg-rui-info hover:bg-rui-info-darker active:bg-rui-info-darker/90 text-rui-dark-text ring-rui-info/40 dark:text-rui-text dark:ring-rui-info/60' },
      success: { root: 'bg-rui-success hover:bg-rui-success-darker active:bg-rui-success-darker/90 text-rui-dark-text ring-rui-success/40 dark:text-rui-text dark:ring-rui-success/60' },
    },
    rounded: {
      true: { root: 'rounded-full' },
    },
    icon: {
      // Only the round shape; the `icon + size` compounds below carry padding and icon sizing
      true: { root: 'rounded-full' },
    },
    active: {
      true: {},
      false: {},
    },
    loading: {
      true: { root: 'relative !cursor-progress space-x-0 [&>*:not([data-spinner])]:opacity-0 [&>*:not([data-spinner])]:invisible' },
      false: {},
    },
    hideFocusIndicator: {
      true: { root: 'focus-visible:!ring-0' },
    },
  },
  compoundVariants: [
    // Disabled appearance: the Material disabled palette, skipped while loading so the variant color shows behind the spinner
    { loading: false, class: { root: 'disabled:!bg-black/[.12] dark:disabled:!bg-white/[.12] disabled:!text-rui-text-disabled disabled:active:!text-rui-text-disabled' } },
    { loading: false, variant: 'outlined', class: { root: 'disabled:!bg-transparent dark:disabled:!bg-transparent disabled:active:!bg-transparent disabled:outline-rui-text-disabled' } },
    { loading: false, variant: 'text', class: { root: 'disabled:!bg-transparent dark:disabled:!bg-transparent disabled:active:!bg-transparent' } },
    { loading: false, variant: 'list', class: { root: 'disabled:!bg-transparent dark:disabled:!bg-transparent disabled:active:!bg-transparent' } },

    // === Grey color variants ===
    { color: 'grey', active: true, class: { root: 'bg-rui-grey-50' } },
    { color: 'grey', variant: ['outlined', 'text', 'list'], class: { root: 'bg-transparent hover:bg-black/[.04] active:bg-black/10 dark:bg-transparent dark:active:bg-white/10 dark:hover:bg-white/[.04] dark:text-rui-text' } },
    { color: 'grey', variant: ['outlined', 'text', 'list'], active: true, class: { root: 'bg-black/10 dark:bg-white/30' } },
    // Material's 23% outline: at full strength a neutral edge reads as an error state next to the 50% context colours
    { color: 'grey', variant: 'outlined', class: { root: 'outline-black/[0.23] dark:outline-white/[0.23]' } },
    { color: 'grey', variant: 'text', class: { root: 'text-rui-text-secondary' } },

    // Context colors: `dark:text-rui-<color>` beats the base variant's `dark:text-rui-text`, which is meant for filled buttons
    { color: 'primary', variant: ['outlined', 'text', 'list'], class: { root: 'bg-transparent hover:bg-rui-primary-lighter/[.04] active:bg-rui-primary-lighter/10 text-rui-primary dark:text-rui-primary' } },
    { color: 'secondary', variant: ['outlined', 'text', 'list'], class: { root: 'bg-transparent hover:bg-rui-secondary-lighter/[.04] active:bg-rui-secondary-lighter/10 text-rui-secondary dark:text-rui-secondary' } },
    { color: 'error', variant: ['outlined', 'text', 'list'], class: { root: 'bg-transparent hover:bg-rui-error-lighter/[.04] active:bg-rui-error-lighter/10 text-rui-error dark:text-rui-error' } },
    { color: 'warning', variant: ['outlined', 'text', 'list'], class: { root: 'bg-transparent hover:bg-rui-warning-lighter/[.04] active:bg-rui-warning-lighter/10 text-rui-warning dark:text-rui-warning' } },
    { color: 'info', variant: ['outlined', 'text', 'list'], class: { root: 'bg-transparent hover:bg-rui-info-lighter/[.04] active:bg-rui-info-lighter/10 text-rui-info dark:text-rui-info' } },
    { color: 'success', variant: ['outlined', 'text', 'list'], class: { root: 'bg-transparent hover:bg-rui-success-lighter/[.04] active:bg-rui-success-lighter/10 text-rui-success dark:text-rui-success' } },

    // === Context colors — active default ===
    { color: 'primary', active: true, class: { root: 'bg-rui-primary-darker' } },
    { color: 'secondary', active: true, class: { root: 'bg-rui-secondary-darker' } },
    { color: 'error', active: true, class: { root: 'bg-rui-error-darker' } },
    { color: 'warning', active: true, class: { root: 'bg-rui-warning-darker' } },
    { color: 'info', active: true, class: { root: 'bg-rui-info-darker' } },
    { color: 'success', active: true, class: { root: 'bg-rui-success-darker' } },

    // === Context colors — active outlined/text ===
    { color: 'primary', variant: ['outlined', 'text', 'list'], active: true, class: { root: 'bg-rui-primary-lighter/30' } },
    { color: 'secondary', variant: ['outlined', 'text', 'list'], active: true, class: { root: 'bg-rui-secondary-lighter/30' } },
    { color: 'error', variant: ['outlined', 'text', 'list'], active: true, class: { root: 'bg-rui-error-lighter/30' } },
    { color: 'warning', variant: ['outlined', 'text', 'list'], active: true, class: { root: 'bg-rui-warning-lighter/30' } },
    { color: 'info', variant: ['outlined', 'text', 'list'], active: true, class: { root: 'bg-rui-info-lighter/30' } },
    { color: 'success', variant: ['outlined', 'text', 'list'], active: true, class: { root: 'bg-rui-success-lighter/30' } },

    // === Context colors — outlined border ===
    { color: 'primary', variant: 'outlined', class: { root: 'outline-rui-primary/[0.5]' } },
    { color: 'secondary', variant: 'outlined', class: { root: 'outline-rui-secondary/[0.5]' } },
    { color: 'error', variant: 'outlined', class: { root: 'outline-rui-error/[0.5]' } },
    { color: 'warning', variant: 'outlined', class: { root: 'outline-rui-warning/[0.5]' } },
    { color: 'info', variant: 'outlined', class: { root: 'outline-rui-info/[0.5]' } },
    { color: 'success', variant: 'outlined', class: { root: 'outline-rui-success/[0.5]' } },

    // === Size overrides per variant ===
    { variant: 'text', size: 'xs', class: { root: 'px-1' } },
    { variant: 'text', size: 'sm', class: { root: 'px-1.5' } },
    { variant: 'text', size: 'lg', class: { root: 'px-2.5' } },
    { variant: 'text', size: 'xl', class: { root: 'px-2.5' } },
    { variant: 'text', size: '2xl', class: { root: 'px-2.5' } },
    { variant: 'fab', size: 'xs', class: { root: 'py-1 px-1' } },
    { variant: 'fab', size: 'sm', class: { root: 'py-1.5 px-2' } },
    { variant: 'fab', size: 'lg', class: { root: 'py-3' } },
    { variant: 'list', size: 'xs', class: { root: 'px-3 py-0.5' } },
    { variant: 'list', size: 'sm', class: { root: 'px-3 py-1' } },
    // Icon-only sizing, per the padding and glyph table on buttonStyles above
    { icon: true, class: { root: 'p-1.5 ![--rui-icon-size:1.25rem]' } },
    { icon: true, size: 'xs', class: { root: 'p-[0.1875rem] ![--rui-icon-size:0.875rem]' } },
    { icon: true, size: 'sm', class: { root: 'p-1 ![--rui-icon-size:1.25rem]' } },
    { icon: true, size: 'lg', class: { root: 'p-1.5 ![--rui-icon-size:1.5rem]' } },
    { icon: true, size: 'xl', class: { root: 'p-2 ![--rui-icon-size:1.5rem]' } },
    { icon: true, size: '2xl', class: { root: 'p-2 ![--rui-icon-size:1.75rem]' } },
    { variant: 'fab', icon: true, size: 'sm', class: { root: 'px-2 py-2' } },
  ],
  compoundSlots: [
    // Dark mode default variant text override for warning/success/info
    { slots: ['root'], color: ['warning', 'success', 'info'], variant: 'default', class: 'dark:text-rui-light-text' },
    // Dark mode active outlined/text override for primary/secondary
    { slots: ['root'], color: 'primary', variant: ['outlined', 'text', 'list'], active: true, class: 'dark:bg-rui-primary-darker/60 dark:text-rui-primary-lighter' },
    { slots: ['root'], color: 'secondary', variant: ['outlined', 'text', 'list'], active: true, class: 'dark:bg-rui-secondary-darker/60 dark:text-rui-secondary-lighter' },
  ],
  defaultVariants: {
    variant: 'default',
    color: 'grey',
    active: false,
  },
});
