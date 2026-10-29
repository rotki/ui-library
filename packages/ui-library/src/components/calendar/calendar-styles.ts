import { tv } from '@/utils/tv';

export const calendarStyles = tv({
  base: 'w-75 overflow-hidden',
  variants: {
    // standalone it sits on the card surface; borderless it lives inside a menu
    bordered: {
      true: 'bg-rui-surface rounded-rui-panel border border-rui-divider',
      false: 'bg-rui-menu',
    },
  },
});
