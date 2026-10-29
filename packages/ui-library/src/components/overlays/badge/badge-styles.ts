import { tv } from '@/utils/tv';

export const badgeStyles = tv({
  slots: {
    wrapper: 'relative inline-block',
    badge: 'flex items-center justify-center text-xs font-medium tabular-nums absolute bg-transparent text-rui-text',
    content: 'flex items-center gap-1 px-1.5',
  },
  variants: {
    // `-fill` is `main` in light and, for a status color, the deep `darker` in dark, where `main` is a text tone
    color: {
      default: { badge: 'bg-rui-neutral-200 dark:bg-rui-neutral-700' },
      primary: { badge: 'bg-rui-primary-fill text-rui-primary-foreground' },
      secondary: { badge: 'bg-rui-secondary-fill text-rui-secondary-foreground' },
      error: { badge: 'bg-rui-error-fill text-rui-error-foreground' },
      warning: { badge: 'bg-rui-warning-fill text-rui-warning-foreground' },
      info: { badge: 'bg-rui-info-fill text-rui-info-foreground' },
      success: { badge: 'bg-rui-success-fill text-rui-success-foreground' },
    },
    // the icon is 60% of the badge height, as the text is, rather than filling it
    size: {
      sm: { badge: 'min-h-4 min-w-4 text-caption-2 [--rui-icon-size:0.625rem]' },
      md: { badge: 'min-h-5 min-w-5 [--rui-icon-size:0.75rem]' },
      lg: { badge: 'min-h-6 min-w-6 [--rui-icon-size:0.875rem]' },
    },
    rounded: {
      sm: { badge: 'rounded-xs' },
      md: { badge: 'rounded-rui-control' },
      lg: { badge: 'rounded-rui-card' },
      full: { badge: 'rounded-full' },
    },
    // A surface ring keeps a dot apart from whatever it overlaps, such as an avatar edge
    dot: {
      true: { badge: 'ring-2 ring-rui-surface' },
    },
    // an icon alone needs no side padding, so the badge stays as wide as it is tall
    iconOnly: {
      true: { content: 'px-0' },
      false: {},
    },
  },
  compoundVariants: [
    // the default dot is a step lighter in dark, where neutral-500 nearly vanished against a dark control
    { dot: true, color: 'default', class: { badge: 'bg-rui-neutral-500 dark:bg-rui-neutral-400' } },
    // A dot carries no text, so it keeps the brighter `main`, which reads better as a small mark on a dark page
    { dot: true, color: 'error', class: { badge: 'dark:bg-rui-error' } },
    { dot: true, color: 'warning', class: { badge: 'dark:bg-rui-warning' } },
    { dot: true, color: 'info', class: { badge: 'dark:bg-rui-info' } },
    { dot: true, color: 'success', class: { badge: 'dark:bg-rui-success' } },

    // Dot sizes: 8, 10 and 12px, since half of a dot sits off the corner and reads smaller than it is
    { dot: true, size: 'sm', class: { badge: 'min-w-2 min-h-2' } },
    { dot: true, size: 'md', class: { badge: 'min-w-2.5 min-h-2.5' } },
    { dot: true, size: 'lg', class: { badge: 'min-w-3 min-h-3' } },
  ],
  defaultVariants: {
    color: 'primary',
    size: 'md',
    rounded: 'full',
    dot: false,
  },
});
