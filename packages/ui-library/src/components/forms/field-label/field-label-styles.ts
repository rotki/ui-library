import { tv } from '@/utils/tv';

export const labelStyles = tv({
  slots: {
    root: 'block mb-1 text-sm leading-5 font-medium text-rui-text',
    required: 'text-rui-error',
  },
  variants: {
    hidden: {
      true: { root: 'sr-only' },
    },
    disabled: {
      true: { root: 'text-rui-text-disabled' },
    },
  },
});
