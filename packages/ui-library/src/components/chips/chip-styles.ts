import { tv } from '@/utils/tv';

export const chipStyles = tv({
  slots: {
    // min-h sets the height and items-center the rest, so a prefix or a border never adds to it
    root: 'inline-flex items-center justify-between px-2 transition duration-150 cursor-default outline-hidden max-w-full truncate',
    // the avatar's neutral pair, so initials stay readable on any chip color
    prepend: 'rounded-full flex items-center justify-center shrink-0 w-6 h-6 text-[0.625rem] font-semibold text-rui-neutral-700 bg-rui-neutral-200 dark:text-rui-neutral-200 dark:bg-rui-neutral-700 overflow-hidden',
    label: 'truncate px-2 text-[0.8125rem]/5',
    // a round hover fill marks the close icon as its own button
    close: 'rounded-full flex items-center p-0.5 inset-y-0 focus:outline-hidden transition-colors hover:bg-rui-pressed',
    // 80% keeps the icon at 3:1 on a filled chip and on the page; full on hover
    closeIcon: 'opacity-80 hover:opacity-100 transition-opacity',
  },
  variants: {
    tile: {
      true: { root: 'rounded-rui-sm' },
      false: { root: 'rounded-full' },
    },
    size: {
      // 28px, to sit in a 44px table row; sm is 24px with 12px text
      md: { root: 'min-h-7' },
      sm: {
        root: 'min-h-6',
        prepend: 'text-[0.5rem] p-[0.08rem] w-4 h-4',
        label: 'px-1.5 text-xs/4',
        close: 'p-px',
      },
      // 20px for a count: 11px tabular figures keep a changing number from shifting the row
      xs: {
        root: 'min-h-5 px-1',
        prepend: 'text-[0.5rem] p-[0.08rem] w-4 h-4',
        label: 'px-1 text-[0.6875rem]/4 tabular-nums',
        close: 'p-px',
      },
    },
    // a leading circle sits as far from the start edge as from the top, like an avatar in a pill
    prepended: {
      true: { root: 'pl-0.5' },
      false: {},
    },
    closeable: {
      true: {},
      false: {},
    },
    disabled: {
      true: { root: '!text-rui-text-disabled cursor-default', close: 'cursor-default hover:bg-transparent dark:hover:bg-transparent' },
      false: {},
    },
    clickable: {
      true: { root: 'cursor-pointer' },
      false: { root: 'cursor-default', close: 'cursor-default' },
    },
    variant: {
      filled: {},
      outlined: {},
      tonal: {},
    },
    color: {
      grey: { root: 'text-rui-text' },
      primary: {},
      secondary: {},
      error: {},
      warning: {},
      info: {},
      success: {},
    },
  },
  compoundVariants: [
    // Interactive states (clickable + not disabled): a tint over any fill, which keeps the text color
    { clickable: true, disabled: false, class: { root: 'hover:state-layer active:state-layer-pressed focus-visible:focus-ring' } },

    // Grey filled: a solid step above the tonal tint
    { color: 'grey', variant: 'filled', class: { root: 'bg-rui-neutral-200 dark:bg-rui-neutral-700' } },

    // Outlined: the border is the text color at 40%, so it follows the brighter text tone in dark
    { variant: 'outlined', class: { root: 'border border-current/40 bg-transparent' } },

    // Context colors: filled bg
    { color: 'primary', variant: 'filled', class: { root: 'bg-rui-primary' } },
    { color: 'secondary', variant: 'filled', class: { root: 'bg-rui-secondary' } },
    // in dark a status color's `main` is a text tone, so the fill is its deep `darker`
    { color: 'error', variant: 'filled', class: { root: 'bg-rui-error dark:bg-rui-error-darker' } },
    { color: 'warning', variant: 'filled', class: { root: 'bg-rui-warning dark:bg-rui-warning-darker' } },
    { color: 'info', variant: 'filled', class: { root: 'bg-rui-info dark:bg-rui-info-darker' } },
    { color: 'success', variant: 'filled', class: { root: 'bg-rui-success dark:bg-rui-success-darker' } },

    // Context colors: outlined text
    { color: 'primary', variant: 'outlined', class: { root: 'text-rui-primary dark:text-rui-primary-lighter' } },
    { color: 'secondary', variant: 'outlined', class: { root: 'text-rui-secondary dark:text-rui-secondary-lighter' } },
    { color: 'error', variant: 'outlined', class: { root: 'text-rui-error dark:text-rui-error-lighter' } },
    { color: 'warning', variant: 'outlined', class: { root: 'text-rui-warning' } },
    { color: 'info', variant: 'outlined', class: { root: 'text-rui-info' } },
    { color: 'success', variant: 'outlined', class: { root: 'text-rui-success' } },

    // Tonal: a tint with the deeper tone as text, 4.5:1; primary and secondary sit near grey, so tint harder
    { color: 'grey', variant: 'tonal', class: { root: 'bg-rui-neutral-500/10 dark:bg-rui-neutral-400/10' } },
    { color: 'primary', variant: 'tonal', class: { root: 'bg-rui-primary/15 text-rui-primary-darker dark:bg-rui-primary/35 dark:text-rui-primary-lighter' } },
    { color: 'secondary', variant: 'tonal', class: { root: 'bg-rui-secondary/20 text-rui-secondary-darker dark:bg-rui-secondary/35 dark:text-rui-secondary-lighter' } },
    { color: 'error', variant: 'tonal', class: { root: 'bg-rui-error/10 text-rui-error-darker dark:bg-rui-error/20 dark:text-rui-error-lighter' } },
    { color: 'warning', variant: 'tonal', class: { root: 'bg-rui-warning/10 text-rui-warning-darker dark:bg-rui-warning/20 dark:text-rui-warning-lighter' } },
    { color: 'info', variant: 'tonal', class: { root: 'bg-rui-info/10 text-rui-info-darker dark:bg-rui-info/20 dark:text-rui-info-lighter' } },
    { color: 'success', variant: 'tonal', class: { root: 'bg-rui-success/10 text-rui-success-darker dark:bg-rui-success/20 dark:text-rui-success-lighter' } },

    // sm: a 16px circle in a 24px chip, 4px in from the start as from the top
    { size: 'sm', prepended: true, class: { root: 'pl-1' } },
    // in a tile chip the prefix follows the corners: the chip's 6px radius less the 2px inset
    { tile: true, class: { prepend: 'rounded-sm' } },
    // the close button's round hover area mirrors the prefix: as far from the end edge as from the top
    { closeable: true, class: { root: 'pr-1', label: 'pr-1' } },
    { closeable: true, size: 'sm', class: { root: 'pr-1', label: 'pr-0.5' } },
    // xs: the 12px close area sits 2px from the end edge, as the 16px prefix does from the start
    { closeable: true, size: 'xs', class: { root: 'pr-0.5', label: 'pr-0.5' } },

    // Disabled: a flat neutral chip in any color, like a disabled button
    { disabled: true, variant: ['filled', 'tonal'], class: { root: '!bg-rui-neutral-100 dark:!bg-rui-neutral-800' } },
    { disabled: true, variant: 'outlined', class: { root: '!border-rui-divider' } },
  ],
  compoundSlots: [
    // Every filled color takes light text, in both themes
    { slots: ['root'], color: ['primary', 'secondary', 'error', 'warning', 'info', 'success'], variant: 'filled', class: 'text-rui-dark-text' },
  ],
  defaultVariants: {
    tile: false,
    size: 'md',
    disabled: false,
    clickable: false,
    variant: 'filled',
    color: 'grey',
  },
});
