import { tv } from '@/utils/tv';

export const avatarStyles = tv({
  slots: {
    root: 'relative inline-flex items-center justify-center shrink-0 overflow-hidden select-none font-medium align-middle',
    image: 'w-full h-full object-cover',
    fallback: 'w-full h-full flex items-center justify-center',
    initials: 'uppercase leading-none',
  },
  variants: {
    variant: {
      circular: { root: 'rounded-full' },
      rounded: { root: 'rounded-rui-control' },
      square: { root: 'rounded-none' },
    },
    // `-fill` is `main` in light and, for a status color, the deep `darker` in dark
    color: {
      default: { root: 'bg-rui-neutral-200 text-rui-text dark:bg-rui-neutral-700' },
      primary: { root: 'bg-rui-primary-fill text-rui-primary-foreground' },
      secondary: { root: 'bg-rui-secondary-fill text-rui-secondary-foreground' },
      error: { root: 'bg-rui-error-fill text-rui-error-foreground' },
      warning: { root: 'bg-rui-warning-fill text-rui-warning-foreground' },
      info: { root: 'bg-rui-info-fill text-rui-info-foreground' },
      success: { root: 'bg-rui-success-fill text-rui-success-foreground' },
    },
    // On the root so slot content (such as a group's `+N`) scales too
    size: {
      'xs': { root: 'text-[0.625rem]' },
      'sm': { root: 'text-[0.6875rem]' },
      'md': { root: 'text-sm' },
      'lg': { root: 'text-base' },
      'xl': { root: 'text-lg' },
      '2xl': { root: 'text-xl' },
    },
  },
  defaultVariants: {
    variant: 'circular',
    color: 'default',
    size: 'md',
  },
});
