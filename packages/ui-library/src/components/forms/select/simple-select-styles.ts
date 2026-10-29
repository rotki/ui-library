import { tv } from '@/utils/tv';

/** The native select dressed as the other fields: a 36px bordered box with their hover, focus and disabled looks. */
export const simpleSelectStyles = tv({
  base: [
    'appearance-none cursor-pointer m-0 w-full h-9 pl-3 pr-8 rounded-rui-control [font:inherit] text-sm text-rui-text',
    'border border-rui-outline bg-transparent transition-colors',
    'hover:border-rui-neutral-500 dark:hover:border-rui-neutral-400',
    'outline-hidden focus-visible:border-rui-primary focus-visible:ring-3 focus-visible:ring-rui-primary/20',
    'disabled:cursor-default disabled:border-rui-divider disabled:bg-rui-neutral-50 disabled:text-rui-text-disabled',
    'dark:disabled:bg-rui-neutral-900',
  ].join(' '),
});
