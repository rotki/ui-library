import { tv } from '@/utils/tv';

export const switchStyles = tv({
  slots: {
    // 13px to the label, the gap a checkbox or radio leaves, so the focus ring clears the text
    wrapper: 'relative flex gap-3.25 items-start cursor-pointer group/switch',
    // 40 × 22, nudged down a pixel to sit centred on the label's 24px line
    inner: 'relative w-10 h-5.5 mt-px shrink-0',
    // the off track is the control edge color, 3:1 against the page in both themes
    input: 'peer appearance-none relative w-full h-full rounded-full bg-rui-outline transition-colors duration-150 cursor-pointer focus-visible:focus-ring',
    toggle: [
      'absolute size-4.5 transition-all duration-75 ease-in-out -translate-y-1/2 top-1/2 rounded-full pointer-events-none',
      'bg-white left-0.5 shadow-rui-control',
    ].join(' '),
    label: 'text-rui-text text-sm/6',
    details: '',
  },
  variants: {
    // indented by the track and the 13px gap, so the message starts where the label does
    underLabel: {
      true: { details: 'pl-13.25' },
      false: {},
    },
    checked: {
      true: {
        toggle: 'left-5',
      },
      false: {},
    },
    disabled: {
      true: {
        wrapper: 'cursor-not-allowed',
        input: 'bg-rui-neutral-200! dark:bg-rui-neutral-800! cursor-not-allowed',
        toggle: 'bg-rui-neutral-50! dark:bg-rui-neutral-600! shadow-none!',
        label: 'text-rui-text-disabled',
      },
    },
    size: {
      sm: {
        inner: 'w-8.5 h-4.5 mt-0.75',
        toggle: 'size-3.5',
      },
    },
    // a ring and the message below mark the state; a filled red or green track would read as "on"
    validation: {
      error: {
        input: 'ring-1 ring-rui-error',
      },
      success: {
        input: 'ring-1 ring-rui-success',
      },
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
    { checked: false, disabled: false, class: { input: 'group-hover/switch:bg-rui-neutral-500 dark:group-hover/switch:bg-rui-neutral-400' } },

    // Checked (no color): an inverted neutral track, with a dark knob in dark mode
    { checked: true, disabled: false, class: { input: 'bg-rui-neutral-900 dark:bg-rui-neutral-100', toggle: 'dark:bg-rui-neutral-900' } },

    // Checked + color: a solid track with the white knob, in both themes
    { checked: true, disabled: false, color: 'primary', class: { input: 'bg-rui-primary dark:bg-rui-primary', toggle: 'dark:bg-white' } },
    { checked: true, disabled: false, color: 'secondary', class: { input: 'bg-rui-secondary dark:bg-rui-secondary', toggle: 'dark:bg-white' } },
    // a status color's dark `main` is a text tone, so the track takes the deep `darker` under the white knob
    { checked: true, disabled: false, color: 'error', class: { input: 'bg-rui-error dark:bg-rui-error-darker', toggle: 'dark:bg-white' } },
    { checked: true, disabled: false, color: 'warning', class: { input: 'bg-rui-warning dark:bg-rui-warning-darker', toggle: 'dark:bg-white' } },
    { checked: true, disabled: false, color: 'info', class: { input: 'bg-rui-info dark:bg-rui-info-darker', toggle: 'dark:bg-white' } },
    { checked: true, disabled: false, color: 'success', class: { input: 'bg-rui-success dark:bg-rui-success-darker', toggle: 'dark:bg-white' } },

    // Size sm + checked: 34 - 14 - 2
    { size: 'sm', checked: true, class: { toggle: 'left-4.5' } },
    // sm: a 34px track
    { size: 'sm', underLabel: true, class: { details: 'pl-11.75' } },
  ],
  defaultVariants: {
    checked: false,
    disabled: false,
  },
});
