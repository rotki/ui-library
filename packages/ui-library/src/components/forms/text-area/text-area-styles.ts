import { textInputBase, type TextInputVariant, underlinePseudo } from '@/components/forms/text-input-styles';
import { tv } from '@/utils/tv';

export type TextAreaVariant = TextInputVariant;

/**
 * tv() styles for RuiTextArea. Extends textInputBase for shared
 * fieldset/legend/label/validation core.
 *
 * IMPORTANT: tv() extend does NOT deduplicate conflicting Tailwind classes
 * between base and extension. Never put a class in the base slot that a
 * variant needs to override — put variant-specific classes in the variants.
 */
export const textAreaStyles = tv({
  extend: textInputBase,
  slots: {
    fieldset: '',
    legend: '',
    wrapper: 'relative w-full min-w-[12.5rem] flex items-start rounded bg-white dark:bg-transparent',
    inputWrapper: 'flex flex-1 overflow-hidden',
    textarea: [
      'peer leading-6 text-rui-text w-full bg-transparent pb-2 pt-0',
      'outline-0 outline-none',
      'placeholder:opacity-0 focus:placeholder:opacity-100',
    ].join(' '),
    textareaSizer: 'invisible absolute top-0 left-0 w-full h-0 -z-10 pointer-events-none',
    label: [
      'left-0 text-base pointer-events-none',
      'absolute top-0 h-full w-full select-none',
      '[padding-left:calc(var(--x-padding,0px)+var(--prepend-w,0px))]',
      '[padding-right:calc(var(--x-padding,0px)+var(--append-w,0px))]',
    ].join(' '),
    labelText: 'truncate transition-all duration-75',
    prepend: 'flex items-center gap-1 shrink-0 mt-4 mx-3',
    append: 'flex items-center gap-1 shrink-0 absolute right-0 mt-4 mx-3',
    icon: 'text-black/[0.54] dark:text-white/[0.56]',
    details: 'pt-1 px-4',
    required: 'text-rui-error',
    clearButton: '!p-2',
  },
  variants: {
    variant: {
      default: {
        inputWrapper: 'pt-4',
        textarea: '[padding-right:calc(var(--x-padding,1rem)+var(--append-w,0px))]',
        label: `flex leading-[3.2] ${underlinePseudo}`,
      },
      filled: {
        inputWrapper: 'pt-4',
        textarea: 'px-4 [padding-right:calc(var(--x-padding,1rem)+var(--append-w,0px))]',
        textareaSizer: 'px-4',
        label: `flex leading-[3.2] [--x-padding:1rem] rounded-t bg-black/[0.06] dark:bg-white/[0.09] ${underlinePseudo}`,
        prepend: '!mr-0',
        append: '!ml-0',
      },
      outlined: {
        inputWrapper: '!overflow-visible pt-4',
        textarea: 'px-4 [padding-right:calc(var(--x-padding,1rem)+var(--append-w,0px))]',
        textareaSizer: 'px-4',
        label: [
          'flex leading-[3.2] [--x-padding:1rem]',
          'border-0 border-transparent',
          'after:content-none',
        ].join(' '),
        fieldset: '!mt-0 !h-full',
        prepend: '!mr-0',
        append: '!ml-0',
      },
    },
    dense: {
      true: {
        inputWrapper: '!pt-2',
        textarea: 'py-1',
        textareaSizer: 'py-1',
      },
    },
    noResize: {
      true: {
        textarea: 'resize-none',
      },
      false: {
        textarea: 'resize-y',
      },
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
      primary: { prepend: 'text-rui-primary', append: 'text-rui-primary', textarea: 'text-rui-primary', icon: 'text-rui-primary' },
      secondary: { prepend: 'text-rui-secondary', append: 'text-rui-secondary', textarea: 'text-rui-secondary', icon: 'text-rui-secondary' },
      error: { prepend: 'text-rui-error', append: 'text-rui-error', textarea: 'text-rui-error', icon: 'text-rui-error' },
      warning: { prepend: 'text-rui-warning', append: 'text-rui-warning', textarea: 'text-rui-warning', icon: 'text-rui-warning' },
      info: { prepend: 'text-rui-info', append: 'text-rui-info', textarea: 'text-rui-info', icon: 'text-rui-info' },
      success: { prepend: 'text-rui-success', append: 'text-rui-success', textarea: 'text-rui-success', icon: 'text-rui-success' },
    },
    validation: {
      error: {
        textarea: '!border-rui-error',
        label: '!text-rui-error !after:border-rui-error',
      },
      success: {
        textarea: '!border-rui-success',
        label: '!text-rui-success !after:border-rui-success',
      },
    },
  },
  compoundVariants: [
    // --- Default variant ---
    { variant: 'default', focused: true, class: { label: 'after:scale-x-100' } },

    // --- Filled variant ---
    { variant: 'filled', focused: true, class: { label: 'bg-black/[0.09] dark:bg-white/[0.13]' } },
    { variant: 'filled', noLabel: true, class: { textarea: 'py-4', textareaSizer: 'py-4' } },
    { variant: 'filled', noLabel: true, dense: true, class: { textarea: 'py-3', textareaSizer: 'py-3' } },

    // --- Outlined variant ---
    { variant: 'outlined', active: true, class: {
      textarea: 'border-t-transparent',
      label: '!h-auto -translate-y-1/2 pl-4',
    } },
    { variant: 'outlined', dense: true, class: { label: 'leading-[2.5]' } },

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
    noResize: false,
  },
});
