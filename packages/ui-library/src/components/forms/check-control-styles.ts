import { tv } from '@/utils/tv';

/**
 * Shared tv() styles for RuiCheckbox and RuiRadio.
 *
 * The control is a drawn box (or ring) centred in the 42px slot the Material
 * glyph used to fill, so a form keeps its spacing. The control's text color is
 * the mark's color: its edge, the checkbox fill and the radio dot all draw
 * with `currentColor`, so one class per state colors the whole mark. Hovering
 * the row darkens an unchecked mark, and keyboard focus rings it; the hidden
 * input is the focus target, so the ring hangs off its `peer` state.
 */
export const checkControlStyles = tv({
  slots: {
    wrapper: 'relative flex items-start cursor-pointer -ml-[0.5625rem] group/check',
    input: 'peer appearance-none w-px h-px absolute z-[2] outline-hidden select-none',
    control: [
      'relative grid place-items-center shrink-0 size-10.5 text-rui-neutral-500 transition-colors',
      'peer-focus-visible:[&>[data-mark]]:focus-ring',
    ].join(' '),
    mark: 'grid place-items-center size-4 border-[1.5px] border-current transition-colors',
    glyph: 'size-3 text-white',
    dot: 'size-2 rounded-full bg-current',
    label: 'flex-1 text-rui-text text-sm/6 mt-[0.5625rem] mb-1',
  },
  variants: {
    size: {
      sm: {
        control: 'size-9.5',
        mark: 'size-3.5',
        glyph: 'size-2.5',
        dot: 'size-1.5',
        label: 'mt-[0.4375rem]',
      },
      lg: {
        control: 'size-11.5',
        mark: 'size-5',
        glyph: 'size-3.5',
        dot: 'size-2.5',
        label: 'mt-[0.6875rem]',
      },
    },
    shape: {
      square: { mark: 'rounded-sm' },
      round: { mark: 'rounded-full' },
    },
    disabled: {
      true: {
        wrapper: 'cursor-not-allowed',
        control: 'opacity-50',
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
      grey: {},
      primary: {},
      secondary: {},
      error: {},
      warning: {},
      info: {},
      success: {},
    },
  },
  compoundVariants: [
    { checked: false, disabled: false, class: { control: 'group-hover/check:text-rui-neutral-700 dark:group-hover/check:text-rui-neutral-300' } },
    { checked: true, shape: 'square', class: { mark: 'bg-current' } },

    // Mark color when checked
    { color: 'grey', checked: true, class: { control: 'text-rui-neutral-800 dark:text-rui-neutral-200' } },
    { color: 'primary', checked: true, class: { control: 'text-rui-primary' } },
    { color: 'secondary', checked: true, class: { control: 'text-rui-secondary' } },
    { color: 'error', checked: true, class: { control: 'text-rui-error' } },
    { color: 'warning', checked: true, class: { control: 'text-rui-warning' } },
    { color: 'info', checked: true, class: { control: 'text-rui-info' } },
    { color: 'success', checked: true, class: { control: 'text-rui-success' } },

    // A dark check where the fill is light: grey and the pale context colors in dark mode
    { color: ['grey', 'warning', 'info', 'success'], class: { glyph: 'dark:text-rui-neutral-900' } },
  ],
  defaultVariants: {
    shape: 'square',
    color: 'grey',
    disabled: false,
    checked: false,
  },
});
