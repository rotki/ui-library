import { textInputBase } from '@/components/forms/text-input-styles';
import { tv } from '@/utils/tv';

export const TextFieldVariant = {
  default: 'default',
  filled: 'filled',
  outlined: 'outlined',
} as const;

export type TextFieldVariant = (typeof TextFieldVariant)[keyof typeof TextFieldVariant];

/**
 * tv() styles for RuiTextField. Extends textInputBase for shared
 * fieldset/legend/label/validation core.
 *
 * IMPORTANT: tv() extend does NOT deduplicate conflicting Tailwind classes
 * between base and extension. Never put a class in the base slot that a
 * variant needs to override — put variant-specific classes in the variants.
 */
const underlinePseudo = [
  'border-b border-black/[0.42] dark:border-white/[0.42]',
  'after:content-[\'\'] after:absolute after:bottom-0 after:left-0 after:block after:w-full',
  'after:scale-x-0 after:border-b-2 after:mb-[-1px] after:transition-transform after:duration-300',
  'after:border-black dark:after:border-white',
].join(' ');

export const textFieldStyles = tv({
  extend: textInputBase,
  slots: {
    // Re-declare base slots for type inference (extend merges classes at runtime)
    fieldset: '',
    legend: '',
    // No pt-* here — each variant sets its own padding-top
    wrapper: 'relative w-full flex items-center rounded bg-white dark:bg-transparent',
    input: [
      'peer leading-6 text-rui-text w-full bg-transparent pr-3',
      'outline-0 outline-none transition-all',
      'placeholder:opacity-0 focus:placeholder:opacity-100',
    ].join(' '),
    // No border-b or display here — each variant sets its own
    label: [
      'left-0 text-base pointer-events-none',
      'absolute top-0 h-full w-full select-none',
      // Dynamic padding via CSS variables
      '[padding-left:calc(var(--x-padding,0px)+var(--prepend-w,0px))]',
      '[padding-right:calc(var(--x-padding,0px)+var(--append-w,0px))]',
      // CSS-only autofill fallback (before JS catches up)
      'peer-autofill:text-xs peer-autofill:leading-tight',
    ].join(' '),
    labelText: 'truncate transition-all duration-75',
    inputWrapper: 'flex flex-1 overflow-hidden',
    prepend: 'flex items-center gap-1 shrink-0',
    append: 'flex items-center gap-1 shrink-0',
    icon: 'text-black/[0.54] dark:text-white/[0.56]',
    details: 'pt-1 px-3',
    required: 'text-rui-error',
    clearButton: '!p-2',
  },
  variants: {
    variant: {
      default: {
        wrapper: 'pt-3',
        input: 'py-1.5',
        label: `flex leading-[3.75] ${underlinePseudo}`,
        prepend: 'pr-2',
        append: 'pl-2',
      },
      filled: {
        input: 'px-3 py-4',
        label: `flex leading-[3.5] [--x-padding:0.75rem] rounded-t bg-black/[0.06] dark:bg-white/[0.09] ${underlinePseudo}`,
        prepend: 'pl-3',
        append: 'pr-3',
      },
      outlined: {
        inputWrapper: '!overflow-visible',
        input: 'px-3 py-4',
        label: [
          'flex leading-[3.5] [--x-padding:1rem]',
          'border-0 border-transparent',
          'after:content-none',
        ].join(' '),
        fieldset: '!mt-0 !h-full',
        prepend: 'pl-3',
        append: 'pr-3',
      },
    },
    dense: {
      true: {},
    },
    hovered: {
      true: {
        label: 'border-black dark:border-white',
      },
    },
    focused: {
      true: {},
    },
    active: {
      true: {
        label: [
          'text-xs leading-tight',
          '[padding-left:var(--x-padding,0px)]',
          '[padding-right:var(--x-padding,0px)]',
        ].join(' '),
      },
    },
    noLabel: {
      true: {},
    },
    showLabel: {
      true: {},
    },
    textColor: {
      primary: { prepend: 'text-rui-primary', append: 'text-rui-primary', input: 'text-rui-primary', icon: 'text-rui-primary' },
      secondary: { prepend: 'text-rui-secondary', append: 'text-rui-secondary', input: 'text-rui-secondary', icon: 'text-rui-secondary' },
      error: { prepend: 'text-rui-error', append: 'text-rui-error', input: 'text-rui-error', icon: 'text-rui-error' },
      warning: { prepend: 'text-rui-warning', append: 'text-rui-warning', input: 'text-rui-warning', icon: 'text-rui-warning' },
      info: { prepend: 'text-rui-info', append: 'text-rui-info', input: 'text-rui-info', icon: 'text-rui-info' },
      success: { prepend: 'text-rui-success', append: 'text-rui-success', input: 'text-rui-success', icon: 'text-rui-success' },
    },
    validation: {
      error: {
        input: '!border-rui-error',
        label: '!text-rui-error !after:border-rui-error',
      },
      success: {
        input: '!border-rui-success',
        label: '!text-rui-success !after:border-rui-success',
      },
    },
  },
  compoundVariants: [
    // --- Default variant ---
    { variant: 'default', focused: true, class: { label: 'after:scale-x-100' } },
    { variant: 'default', dense: true, class: { input: 'py-1', label: 'leading-[3.5]' } },

    // --- Filled variant ---
    { variant: 'filled', focused: true, class: { label: 'bg-black/[0.09] dark:bg-white/[0.13]' } },
    { variant: 'filled', active: true, class: { label: 'leading-[1.5]' } },
    { variant: 'filled', dense: true, class: { input: 'pt-5 pb-1', label: 'leading-[3]' } },
    { variant: 'filled', dense: true, active: true, class: { label: 'leading-[2.25]' } },
    { variant: 'filled', noLabel: true, class: { input: 'py-4' } },
    { variant: 'filled', noLabel: true, dense: true, class: { input: 'py-3' } },

    // --- Outlined variant ---
    { variant: 'outlined', active: true, class: {
      input: 'border-t-transparent',
      label: '!h-auto -translate-y-1/2 pl-4',
    } },
    { variant: 'outlined', dense: true, class: { input: 'py-2', label: 'leading-[2.5]' } },

    // --- Focus label color (per color) ---
    { focused: true, color: 'primary', class: { label: 'text-rui-primary' } },
    { focused: true, color: 'secondary', class: { label: 'text-rui-secondary' } },
    { focused: true, color: 'error', class: { label: 'text-rui-error' } },
    { focused: true, color: 'warning', class: { label: 'text-rui-warning' } },
    { focused: true, color: 'info', class: { label: 'text-rui-info' } },
    { focused: true, color: 'success', class: { label: 'text-rui-success' } },

    // --- Label after border color (always applied when color set) ---
    { color: 'primary', class: { label: 'after:border-rui-primary' } },
    { color: 'secondary', class: { label: 'after:border-rui-secondary' } },
    { color: 'error', class: { label: 'after:border-rui-error' } },
    { color: 'warning', class: { label: 'after:border-rui-warning' } },
    { color: 'info', class: { label: 'after:border-rui-info' } },
    { color: 'success', class: { label: 'after:border-rui-success' } },
  ],
  defaultVariants: {
    variant: 'default',
  },
});
