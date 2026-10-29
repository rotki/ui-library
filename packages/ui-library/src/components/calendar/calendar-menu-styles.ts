import { tv } from '@/utils/tv';

export const cellButtonStyles = tv({
  base: 'h-9 w-full flex items-center justify-center text-sm font-medium rounded-rui-control transition-colors duration-150 ease-in-out border-none outline-hidden cursor-pointer focus-visible:focus-ring',
  variants: {
    selected: {
      true: 'bg-rui-primary-fill text-rui-primary-foreground hover:bg-rui-primary-darker active:bg-rui-primary-darker',
    },
    inRange: {
      true: 'text-rui-text bg-transparent hover:bg-rui-hover active:bg-rui-pressed',
      false: 'cursor-not-allowed bg-transparent pointer-events-none text-rui-text-disabled',
    },
    selectedOutOfRange: {
      true: 'bg-rui-surface-muted text-rui-text-disabled',
    },
  },
});
