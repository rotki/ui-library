import { tv } from '@/utils/tv';

const ICON_SIZES: Record<string, number> = { sm: 20, lg: 28 };
const DEFAULT_ICON_SIZE = 24;

export function getCheckControlIconSize(size?: 'sm' | 'lg'): number {
  return (size && ICON_SIZES[size]) || DEFAULT_ICON_SIZE;
}

/**
 * Shared tv() styles for RuiCheckbox and RuiRadio.
 * Both use the same layout, ripple, color, size, and validation patterns.
 */
export const checkControlStyles = tv({
  slots: {
    wrapper: 'relative flex items-start cursor-pointer -ml-[0.5625rem]',
    input: 'peer appearance-none w-px h-px absolute z-[2] outline-none select-none',
    control: [
      'relative text-rui-text-secondary p-[0.5625rem]',
      `before:content-[''] before:absolute before:top-1/2 before:left-1/2 before:block before:size-[2.625rem]`,
      'before:-translate-y-1/2 before:-translate-x-1/2 before:rounded-full before:opacity-0 before:transition-opacity',
      'before:bg-black dark:before:bg-white',
      'hover:before:opacity-5 active:before:opacity-30',
      'peer-focus:before:opacity-15',
    ].join(' '),
    label: 'flex-1 text-rui-text text-body-1 mt-[0.5625rem] mb-1',
  },
  variants: {
    size: {
      sm: {
        control: 'before:size-[2.375rem]',
        label: 'mt-[0.4375rem]',
      },
      lg: {
        control: 'before:size-[2.875rem]',
        label: 'mt-[0.6875rem]',
      },
    },
    disabled: {
      true: {
        wrapper: 'cursor-not-allowed',
        control: 'opacity-50 before:!content-none',
        label: 'text-rui-text-disabled',
      },
    },
    checked: {
      true: {},
      false: {},
    },
    validation: {
      error: { control: '!text-rui-error' },
      success: { control: '!text-rui-success' },
    },
    color: {
      primary: {},
      secondary: {},
      error: {},
      warning: {},
      info: {},
      success: {},
    },
  },
  compoundVariants: [
    // Color ripple (before:bg-rui-{color})
    { color: 'primary', class: { control: 'before:bg-rui-primary' } },
    { color: 'secondary', class: { control: 'before:bg-rui-secondary' } },
    { color: 'error', class: { control: 'before:bg-rui-error' } },
    { color: 'warning', class: { control: 'before:bg-rui-warning' } },
    { color: 'info', class: { control: 'before:bg-rui-info' } },
    { color: 'success', class: { control: 'before:bg-rui-success' } },

    // Color text when checked
    { color: 'primary', checked: true, class: { control: 'text-rui-primary' } },
    { color: 'secondary', checked: true, class: { control: 'text-rui-secondary' } },
    { color: 'error', checked: true, class: { control: 'text-rui-error' } },
    { color: 'warning', checked: true, class: { control: 'text-rui-warning' } },
    { color: 'info', checked: true, class: { control: 'text-rui-info' } },
    { color: 'success', checked: true, class: { control: 'text-rui-success' } },
  ],
  defaultVariants: {
    disabled: false,
    checked: false,
  },
});
