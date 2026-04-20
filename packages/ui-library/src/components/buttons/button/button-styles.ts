import { tv } from '@/utils/tv';

export const buttonStyles = tv({
  slots: {
    root: [
      'text-sm leading-5 font-medium outline outline-1 outline-transparent outline-offset-[-1px]',
      // `position: relative` is only needed as a positioning context for the
      // absolute-positioned loading spinner; applied via the `loading` variant
      // below. Putting it here would collide with consumers that need to pin
      // the button with `fixed`/`absolute` (cascade order picks the later
      // utility — usually `relative` — and the consumer's `right-*`/`bottom-*`
      // end up as relative offsets, which misplaces FABs).
      'flex items-center justify-center gap-x-2',
      'px-6 py-2.5 rounded transition-all',
      // `disabled` on the element covers two states: actually disabled and
      // loading (RuiButton sets `disabled = disabled || loading`). The
      // color/bg/text overrides for the "grey disabled" look live in the
      // `loading: false` compounds below so they skip firing on loading
      // buttons — where we want the variant color to stay visible behind
      // the spinner. Cursor stays here since both states are non-clickable.
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
      text: { root: 'px-3' },
      fab: { root: 'rounded-full py-2' },
      list: { root: 'p-3 px-3 rounded-none w-full justify-start text-left', label: 'w-full' },
    },
    size: {
      sm: { root: 'px-4 py-1.5 text-[.8125rem] leading-5' },
      lg: { root: 'px-8 py-3 text-[1rem] leading-5' },
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
      true: { root: 'rounded-full px-3 py-3' },
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
    // === Disabled (not loading) appearance ===
    // Applied only when `loading: false` so that loading buttons keep their
    // variant color/outline visible behind the spinner; pure disabled buttons
    // fade to the Material disabled palette.
    { loading: false, class: { root: 'disabled:!bg-black/[.12] dark:disabled:!bg-white/[.12] disabled:!text-rui-text-disabled disabled:active:!text-rui-text-disabled' } },
    { loading: false, variant: 'outlined', class: { root: 'disabled:!bg-transparent dark:disabled:!bg-transparent disabled:active:!bg-transparent disabled:outline-rui-text-disabled' } },
    { loading: false, variant: 'text', class: { root: 'disabled:!bg-transparent dark:disabled:!bg-transparent disabled:active:!bg-transparent' } },
    { loading: false, variant: 'list', class: { root: 'disabled:!bg-transparent dark:disabled:!bg-transparent disabled:active:!bg-transparent' } },

    // === Grey color variants ===
    { color: 'grey', active: true, class: { root: 'bg-rui-grey-50' } },
    { color: 'grey', variant: ['outlined', 'text', 'list'], class: { root: 'bg-transparent hover:bg-black/[.04] active:bg-black/10 dark:bg-transparent dark:active:bg-white/10 dark:hover:bg-white/[.04] dark:text-rui-text' } },
    { color: 'grey', variant: ['outlined', 'text', 'list'], active: true, class: { root: 'bg-black/10 dark:bg-white/30' } },
    { color: 'grey', variant: 'outlined', class: { root: 'outline-rui-text' } },
    { color: 'grey', variant: 'text', class: { root: 'text-rui-text-secondary' } },

    // === Context colors — outlined/text variants ===
    // `dark:text-rui-<color>` is required to beat `dark:text-rui-text` set by
    // the base color variant (meant for filled buttons where text sits on a
    // colored bg). Without the override, outlined/text/list buttons in dark
    // mode render white text against a themed outline/underline.
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
    { variant: 'text', size: 'sm', class: { root: 'px-2' } },
    { variant: 'text', size: 'lg', class: { root: 'px-4' } },
    { variant: 'fab', size: 'sm', class: { root: 'py-1.5 px-2' } },
    { variant: 'fab', size: 'lg', class: { root: 'py-3' } },
    { variant: 'list', size: 'sm', class: { root: 'px-3 py-1' } },
    { icon: true, size: 'sm', class: { root: 'px-1 py-1' } },
    { icon: true, size: 'lg', class: { root: 'px-4 py-4' } },
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
