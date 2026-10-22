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
 * md (default)  p-2           + 1.25rem  icon = 2.25rem (36px)   56%
 * lg            p-1.5         + 1.5rem   icon = 2.25rem (36px)   67%
 * xl            p-2           + 1.5rem   icon = 2.5rem  (40px)   60%
 * 2xl           p-2           + 1.75rem  icon = 2.75rem (44px)   64%
 * ```
 */
export const buttonStyles = tv({
  slots: {
    root: [
      'text-sm leading-5 font-medium inset-ring inset-ring-transparent',
      'flex items-center justify-center gap-x-2',
      // md is 36px, the height of a text field or select, so a button lines up with them in a row
      'px-4 py-2 rounded-rui-control transition-colors duration-150',
      '[--rui-icon-size:1rem]',
      'disabled:cursor-not-allowed',
      'focus-visible:focus-ring',
    ].join(' '),
    label: 'inline-block text-nowrap',
    // inline in the prepend icon's place; an icon-only button centers it over its hidden glyph instead
    spinner: 'shrink-0',
  },
  variants: {
    variant: {
      default: {},
      outlined: {},
      text: { root: 'px-2' },
      fab: { root: 'rounded-full py-2 shadow-rui-control disabled:shadow-none' },
      // The label's 16px line-box matches the md icon box, so the two share an optical center (rotki/ui-library#515)
      list: { root: 'p-3 px-3 rounded-rui-sm w-full justify-start text-left', label: 'w-full leading-4' },
      // An action inside running text: no box, so its size, padding and fills are reset in the link compounds at the end
      link: { root: 'inline-flex align-baseline gap-x-1 underline-offset-2 not-disabled:hover:underline' },
    },
    size: {
      'xs': { root: 'px-2 py-[0.125rem] text-[.75rem] leading-4 ![--rui-icon-size:0.75rem]' },
      'sm': { root: 'px-2.5 py-1 text-[.8125rem] leading-5 ![--rui-icon-size:0.875rem]' },
      'lg': { root: 'px-6 py-2 text-[1rem] leading-5 ![--rui-icon-size:1.25rem]' },
      // 40px, to line up with RuiTextField / RuiMenuSelect in a toolbar; a 44px jumbo CTA is `2xl`
      'xl': { root: 'px-6 py-2 text-[1rem] leading-6 ![--rui-icon-size:1.375rem]' },
      '2xl': { root: 'px-6 py-2.5 text-[1rem] leading-6 ![--rui-icon-size:1.375rem]' },
    },
    color: {
      grey: { root: 'bg-rui-neutral-100 hover:bg-rui-neutral-200 active:bg-rui-neutral-300 text-rui-text dark:bg-rui-neutral-800 dark:hover:bg-rui-neutral-700 dark:active:bg-rui-neutral-600' },
      // hover is a tint laid over the fill (see the filled compound below); pressed sinks to `darker`
      primary: { root: 'bg-rui-primary active:bg-rui-primary-darker text-rui-dark-text dark:text-rui-text' },
      secondary: { root: 'bg-rui-secondary active:bg-rui-secondary-darker text-rui-dark-text dark:text-rui-text' },
      error: { root: 'bg-rui-error active:bg-rui-error-darker text-rui-dark-text dark:text-rui-text' },
      warning: { root: 'bg-rui-warning active:bg-rui-warning-darker text-rui-dark-text dark:text-rui-text' },
      info: { root: 'bg-rui-info active:bg-rui-info-darker text-rui-dark-text dark:text-rui-text' },
      success: { root: 'bg-rui-success active:bg-rui-success-darker text-rui-dark-text dark:text-rui-text' },
    },
    rounded: {
      true: { root: 'rounded-full' },
    },
    icon: {
      /*
       * Only the round shape; the `icon + size` compounds below carry padding and icon sizing. The
       * label holds no text, so it lays out as a flex box: a line box would put a wrapped icon (a
       * badge) on the text baseline and grow the button by the descender gap.
       */
      true: { root: 'rounded-full', label: 'inline-flex' },
    },
    active: {
      true: {},
      false: {},
    },
    loading: {
      true: { root: 'relative !cursor-progress' },
      false: {},
    },
    hideFocusIndicator: {
      true: { root: 'focus-visible:!outline-hidden' },
    },
    /*
     * Below the breakpoint the label turns `sr-only`, so it still names the button, and the button
     * takes its icon-only padding and glyph from the two properties the `collapsed` compounds seed
     * per size. One static list per breakpoint, since Tailwind cannot see a generated class.
     */
    collapseBelow: {
      'sm': { root: 'max-sm:gap-x-0 max-sm:p-(--rui-btn-collapsed-p) max-sm:![--rui-icon-size:var(--rui-btn-collapsed-icon)]', label: 'max-sm:sr-only' },
      'md': { root: 'max-md:gap-x-0 max-md:p-(--rui-btn-collapsed-p) max-md:![--rui-icon-size:var(--rui-btn-collapsed-icon)]', label: 'max-md:sr-only' },
      'lg': { root: 'max-lg:gap-x-0 max-lg:p-(--rui-btn-collapsed-p) max-lg:![--rui-icon-size:var(--rui-btn-collapsed-icon)]', label: 'max-lg:sr-only' },
      'xl': { root: 'max-xl:gap-x-0 max-xl:p-(--rui-btn-collapsed-p) max-xl:![--rui-icon-size:var(--rui-btn-collapsed-icon)]', label: 'max-xl:sr-only' },
      '2xl': { root: 'max-2xl:gap-x-0 max-2xl:p-(--rui-btn-collapsed-p) max-2xl:![--rui-icon-size:var(--rui-btn-collapsed-icon)]', label: 'max-2xl:sr-only' },
    },
  },
  compoundVariants: [
    /*
     * Filled hover: the pressed state layer (10% black in light, 12% white in dark) over the fill, a
     * step of about a tenth rather than the jump to `darker`, which stays for the pressed state.
     * `not-disabled:` keeps a disabled or loading button flat; an `<a>` is never `:disabled`.
     */
    { variant: ['default', 'fab'], color: ['primary', 'secondary', 'error', 'warning', 'info', 'success'], class: { root: 'not-disabled:hover:state-layer-pressed' } },
    // An icon-only button has no label to keep, so its glyph goes transparent (still in the accessibility tree) under a centered spinner
    { loading: true, icon: true, class: { root: '[&>*:not([data-spinner])]:opacity-0', spinner: 'absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2' } },
    // Disabled appearance: a flat neutral fill, skipped while loading so the variant color shows behind the spinner
    { loading: false, class: { root: 'disabled:!bg-rui-neutral-100 dark:disabled:!bg-rui-neutral-800 disabled:!text-rui-text-disabled disabled:active:!text-rui-text-disabled' } },
    { loading: false, variant: 'outlined', class: { root: 'disabled:!bg-transparent dark:disabled:!bg-transparent disabled:active:!bg-transparent disabled:inset-ring-rui-text-disabled dark:disabled:inset-ring-rui-text-disabled' } },
    { loading: false, variant: ['text', 'link'], class: { root: 'disabled:!bg-transparent dark:disabled:!bg-transparent disabled:active:!bg-transparent' } },
    { loading: false, variant: 'list', class: { root: 'disabled:!bg-transparent dark:disabled:!bg-transparent disabled:active:!bg-transparent' } },

    // === Grey color variants ===
    { color: 'grey', active: true, class: { root: 'bg-rui-neutral-200 dark:bg-rui-neutral-700' } },
    // the same hover and pressed tints as a highlighted menu option
    { color: 'grey', variant: ['outlined', 'text', 'list'], class: { root: 'bg-transparent hover:bg-rui-hover active:bg-rui-pressed dark:bg-transparent dark:text-rui-text' } },
    { color: 'grey', variant: ['outlined', 'text', 'list'], active: true, class: { root: 'bg-rui-pressed dark:bg-rui-pressed' } },
    // the shared control edge, 3:1 against the page like the 50% context colours beside it
    { color: 'grey', variant: 'outlined', class: { root: 'inset-ring-rui-outline' } },
    // the dark variant overrides the shared compound's `dark:text-rui-text`, so a grey text button stays secondary in both themes
    { color: 'grey', variant: 'text', class: { root: 'text-rui-text-secondary dark:text-rui-text-secondary' } },

    // `dark:text-rui-<color>` beats the filled buttons' `dark:text-rui-text`; primary, secondary and error use their lighter tone in dark for 4.5:1
    { color: 'primary', variant: ['outlined', 'text', 'list'], class: { root: 'bg-transparent hover:bg-rui-primary/6 active:bg-rui-primary/10 text-rui-primary dark:text-rui-primary-lighter' } },
    { color: 'secondary', variant: ['outlined', 'text', 'list'], class: { root: 'bg-transparent hover:bg-rui-secondary/6 active:bg-rui-secondary/10 text-rui-secondary dark:text-rui-secondary-lighter' } },
    { color: 'error', variant: ['outlined', 'text', 'list'], class: { root: 'bg-transparent hover:bg-rui-error/6 active:bg-rui-error/10 text-rui-error dark:text-rui-error-lighter' } },
    { color: 'warning', variant: ['outlined', 'text', 'list'], class: { root: 'bg-transparent hover:bg-rui-warning/6 active:bg-rui-warning/10 text-rui-warning dark:text-rui-warning' } },
    { color: 'info', variant: ['outlined', 'text', 'list'], class: { root: 'bg-transparent hover:bg-rui-info/6 active:bg-rui-info/10 text-rui-info dark:text-rui-info' } },
    { color: 'success', variant: ['outlined', 'text', 'list'], class: { root: 'bg-transparent hover:bg-rui-success/6 active:bg-rui-success/10 text-rui-success dark:text-rui-success' } },

    // === Context colors: active default ===
    { color: 'primary', active: true, class: { root: 'bg-rui-primary-darker' } },
    { color: 'secondary', active: true, class: { root: 'bg-rui-secondary-darker' } },
    { color: 'error', active: true, class: { root: 'bg-rui-error-darker' } },
    { color: 'warning', active: true, class: { root: 'bg-rui-warning-darker' } },
    { color: 'info', active: true, class: { root: 'bg-rui-info-darker' } },
    { color: 'success', active: true, class: { root: 'bg-rui-success-darker' } },

    // Active outlined/text: a quiet tint with the deeper tone as the label, which keeps 4.5:1 for every color
    { color: 'primary', variant: ['outlined', 'text', 'list'], active: true, class: { root: 'bg-rui-primary/[0.08] text-rui-primary-darker' } },
    { color: 'secondary', variant: ['outlined', 'text', 'list'], active: true, class: { root: 'bg-rui-secondary/[0.08] text-rui-secondary-darker' } },
    { color: 'error', variant: ['outlined', 'text', 'list'], active: true, class: { root: 'bg-rui-error/[0.08] text-rui-error-darker' } },
    { color: 'warning', variant: ['outlined', 'text', 'list'], active: true, class: { root: 'bg-rui-warning/[0.08] text-rui-warning-darker' } },
    { color: 'info', variant: ['outlined', 'text', 'list'], active: true, class: { root: 'bg-rui-info/[0.08] text-rui-info-darker' } },
    { color: 'success', variant: ['outlined', 'text', 'list'], active: true, class: { root: 'bg-rui-success/[0.08] text-rui-success-darker' } },

    // === Context colors: outlined border (dark draws primary and secondary solid; at 50% their deep fills sink into the page and look alike) ===
    { color: 'primary', variant: 'outlined', class: { root: 'inset-ring-rui-primary/50 dark:inset-ring-rui-primary' } },
    { color: 'secondary', variant: 'outlined', class: { root: 'inset-ring-rui-secondary/50 dark:inset-ring-rui-secondary' } },
    { color: 'error', variant: 'outlined', class: { root: 'inset-ring-rui-error/50' } },
    { color: 'warning', variant: 'outlined', class: { root: 'inset-ring-rui-warning/50' } },
    { color: 'info', variant: 'outlined', class: { root: 'inset-ring-rui-info/50' } },
    { color: 'success', variant: 'outlined', class: { root: 'inset-ring-rui-success/50' } },

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
    // 32px: a dense select's option row, which `getOptionHeight` reserves in the virtual list
    { variant: 'list', size: 'sm', class: { root: 'px-3 py-2' } },
    // Icon-only sizing, per the padding and glyph table on buttonStyles above
    { icon: true, class: { root: 'p-2 ![--rui-icon-size:1.25rem]' } },
    { icon: true, size: 'xs', class: { root: 'p-[0.1875rem] ![--rui-icon-size:0.875rem]' } },
    { icon: true, size: 'sm', class: { root: 'p-1 ![--rui-icon-size:1.25rem]' } },
    { icon: true, size: 'lg', class: { root: 'p-1.5 ![--rui-icon-size:1.5rem]' } },
    { icon: true, size: 'xl', class: { root: 'p-2 ![--rui-icon-size:1.5rem]' } },
    { icon: true, size: '2xl', class: { root: 'p-2 ![--rui-icon-size:1.75rem]' } },
    { variant: 'fab', icon: true, size: 'sm', class: { root: 'px-2 py-2' } },
    // A collapsed button's icon-only padding and glyph, the same table as `icon` above
    { collapseBelow: ['sm', 'md', 'lg', 'xl', '2xl'], class: { root: '[--rui-btn-collapsed-p:0.5rem] [--rui-btn-collapsed-icon:1.25rem]' } },
    { collapseBelow: ['sm', 'md', 'lg', 'xl', '2xl'], size: 'xs', class: { root: '[--rui-btn-collapsed-p:0.1875rem] [--rui-btn-collapsed-icon:0.875rem]' } },
    { collapseBelow: ['sm', 'md', 'lg', 'xl', '2xl'], size: 'sm', class: { root: '[--rui-btn-collapsed-p:0.25rem] [--rui-btn-collapsed-icon:1.25rem]' } },
    { collapseBelow: ['sm', 'md', 'lg', 'xl', '2xl'], size: 'lg', class: { root: '[--rui-btn-collapsed-p:0.375rem] [--rui-btn-collapsed-icon:1.5rem]' } },
    { collapseBelow: ['sm', 'md', 'lg', 'xl', '2xl'], size: 'xl', class: { root: '[--rui-btn-collapsed-p:0.5rem] [--rui-btn-collapsed-icon:1.5rem]' } },
    { collapseBelow: ['sm', 'md', 'lg', 'xl', '2xl'], size: '2xl', class: { root: '[--rui-btn-collapsed-p:0.5rem] [--rui-btn-collapsed-icon:1.75rem]' } },

    /*
     * === Link ===
     * Last, so they win over the size, colour and active entries above. Font size and line height
     * come from the surrounding text; a size only changes the spinner. The colour matches the
     * outlined/text compounds, with no fill or tint.
     */
    {
      variant: 'link',
      class: {
        root: [
          'p-0 text-[length:inherit] leading-[inherit] ![--rui-icon-size:1em]',
          'bg-transparent hover:bg-transparent active:bg-transparent',
          'dark:bg-transparent dark:hover:bg-transparent dark:active:bg-transparent',
        ].join(' '),
      },
    },
    { color: 'grey', variant: 'link', class: { root: 'text-rui-text dark:text-rui-text' } },
    { color: 'primary', variant: 'link', class: { root: 'text-rui-primary dark:text-rui-primary-lighter' } },
    { color: 'secondary', variant: 'link', class: { root: 'text-rui-secondary dark:text-rui-secondary-lighter' } },
    { color: 'error', variant: 'link', class: { root: 'text-rui-error dark:text-rui-error-lighter' } },
    { color: 'warning', variant: 'link', class: { root: 'text-rui-warning dark:text-rui-warning' } },
    { color: 'info', variant: 'link', class: { root: 'text-rui-info dark:text-rui-info' } },
    { color: 'success', variant: 'link', class: { root: 'text-rui-success dark:text-rui-success' } },
  ],
  compoundSlots: [
    // In dark a status color's `main` is a text tone, so a filled status button takes the deep `darker` fill
    { slots: ['root'], color: 'error', variant: ['default', 'fab'], class: 'dark:bg-rui-error-darker dark:active:bg-rui-error-darker/75' },
    { slots: ['root'], color: 'warning', variant: ['default', 'fab'], class: 'dark:bg-rui-warning-darker dark:active:bg-rui-warning-darker/75' },
    { slots: ['root'], color: 'info', variant: ['default', 'fab'], class: 'dark:bg-rui-info-darker dark:active:bg-rui-info-darker/75' },
    { slots: ['root'], color: 'success', variant: ['default', 'fab'], class: 'dark:bg-rui-success-darker dark:active:bg-rui-success-darker/75' },
    // Dark mode active outlined/text: the same quiet tint, with the lighter tone as the label
    { slots: ['root'], color: 'primary', variant: ['outlined', 'text', 'list'], active: true, class: 'dark:bg-rui-primary/[0.16] dark:text-rui-primary-lighter' },
    { slots: ['root'], color: 'secondary', variant: ['outlined', 'text', 'list'], active: true, class: 'dark:bg-rui-secondary/[0.16] dark:text-rui-secondary-lighter' },
    { slots: ['root'], color: 'error', variant: ['outlined', 'text', 'list'], active: true, class: 'dark:bg-rui-error/[0.16] dark:text-rui-error-lighter' },
    { slots: ['root'], color: 'warning', variant: ['outlined', 'text', 'list'], active: true, class: 'dark:bg-rui-warning/[0.16] dark:text-rui-warning-lighter' },
    { slots: ['root'], color: 'info', variant: ['outlined', 'text', 'list'], active: true, class: 'dark:bg-rui-info/[0.16] dark:text-rui-info-lighter' },
    { slots: ['root'], color: 'success', variant: ['outlined', 'text', 'list'], active: true, class: 'dark:bg-rui-success/[0.16] dark:text-rui-success-lighter' },
  ],
  defaultVariants: {
    variant: 'default',
    color: 'grey',
    active: false,
  },
});
