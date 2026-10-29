import { tv } from '@/utils/tv';

export const groupStyles = tv({
  slots: {
    root: 'inline-flex items-center isolate',
    item: 'relative ring-2 ring-rui-surface',
    surplus: 'leading-none text-[0.85em] tracking-tight',
  },
  // The ring follows the avatar outline
  variants: {
    variant: {
      circular: { item: 'rounded-full' },
      rounded: { item: 'rounded-rui-control' },
      square: { item: 'rounded-none' },
    },
  },
});
