import { tv } from '@/utils/tv';

export const dayButtonStyles = tv({
  base: 'h-9 w-full flex items-center justify-center text-sm rounded-rui-control mx-auto max-w-9 transition-colors duration-150 ease-in-out border-none outline-hidden cursor-pointer focus-visible:focus-ring',
  variants: {
    selected: {
      true: 'bg-rui-primary-fill text-rui-primary-foreground hover:bg-rui-primary-fill hover:state-layer-pressed',
    },
    // the neighbouring months' days are a step quieter but still pickable, so they keep 4.5:1
    currentMonth: {
      true: 'text-rui-neutral-800 dark:text-rui-neutral-100',
      false: 'text-rui-neutral-500 dark:text-rui-neutral-400',
    },
    inRange: {
      false: 'opacity-50 cursor-not-allowed hover:bg-transparent',
    },
    today: {
      true: 'inset-ring inset-ring-rui-outline font-semibold',
    },
  },
  compoundVariants: [
    // restated under `dark:`, which the current-month day color uses and would otherwise win
    {
      selected: true,
      class: 'text-rui-primary-foreground dark:text-rui-primary-foreground',
    },
    // only a pickable, unselected day takes the grey hover; on the selected one it replaced the fill
    { selected: false, inRange: true, class: 'hover:bg-rui-hover' },
  ],
});
