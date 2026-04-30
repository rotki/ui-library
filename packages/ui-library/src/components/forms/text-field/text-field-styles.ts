import { textInputBase, type TextInputVariant, underlinePseudo } from '@/components/forms/text-input-styles';
import { tv } from '@/utils/tv';

export type TextFieldVariant = TextInputVariant;

/**
 * tv() styles for RuiTextField. Extends textInputBase for shared
 * fieldset/legend/label/validation core.
 *
 * IMPORTANT: tv() extend does NOT deduplicate conflicting Tailwind classes
 * between base and extension. Never put a class in the base slot that a
 * variant needs to override — put variant-specific classes in the variants.
 */

export const textFieldStyles = tv({
  extend: textInputBase,
  slots: {
    // Re-declare base slots for type inference (extend merges classes at runtime)
    fieldset: '',
    legend: '',
    // No pt-* here — each variant sets its own padding-top
    wrapper: 'relative w-full flex items-center rounded bg-white dark:bg-transparent',
    input: [
      'peer leading-6 text-rui-text w-full bg-transparent pr-4',
      'outline-0 outline-none transition-all',
      'placeholder:opacity-0 focus:placeholder:opacity-100',
    ].join(' '),
    // No border-b or display here — each variant sets its own
    label: [
      // Use arbitrary `text-[1rem]` instead of `text-base` — the named class
      // bundles `line-height: 1.5rem`, and the consumer's later-loaded
      // `.text-base` rule would override our `leading-*` per variant. The
      // arbitrary form emits font-size only, so `leading-*` stays authoritative.
      'left-0 text-[1rem] pointer-events-none',
      'absolute top-0 h-full w-full select-none',
      // Dynamic padding via CSS variables
      '[padding-left:calc(var(--x-padding,0px)+var(--prepend-w,0px))]',
      '[padding-right:calc(var(--x-padding,0px)+var(--append-w,0px))]',
      // CSS-only autofill fallback (before JS catches up)
      'peer-autofill:text-[0.75rem] peer-autofill:leading-tight',
    ].join(' '),
    labelText: 'truncate transition-all duration-75',
    inputWrapper: 'flex flex-1 overflow-hidden',
    prepend: 'flex items-center gap-1 shrink-0',
    append: 'flex items-center gap-1 shrink-0',
    icon: 'text-black/[0.54] dark:text-white/[0.56]',
    details: 'pt-1 px-4',
    required: 'text-rui-error',
    clearButton: '!p-2',
  },
  variants: {
    variant: {
      default: {
        wrapper: 'pt-3',
        input: 'py-1.5',
        label: `flex leading-[3.75] ${underlinePseudo}`,
        prepend: 'pr-3',
        append: 'pl-3',
      },
      filled: {
        input: 'px-4 py-4',
        label: `flex leading-[3.5] [--x-padding:1rem] rounded-t bg-black/[0.06] dark:bg-white/[0.09] ${underlinePseudo}`,
        prepend: 'pl-3',
        append: 'pr-3',
      },
      outlined: {
        inputWrapper: '!overflow-visible',
        input: 'px-4 py-4',
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
          'text-[0.75rem] leading-tight',
          // Keep --prepend-w / --append-w in the floated padding so the
          // label sits above the input column, not above the prepend
          // icon / append button.
          '[padding-left:calc(var(--x-padding,0px)+var(--prepend-w,0px))]',
          '[padding-right:calc(var(--x-padding,0px)+var(--append-w,0px))]',
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
    // In dense mode, lift only the labelText glyphs (not the label
    // container) so the floated label clears the compact ~32px input row.
    // Translating the label container would drag its `after:` underline
    // pseudo with it, leaving the focus underline floating above the
    // input row; translating only the inner span keeps the underline
    // anchored. Non-dense default has enough vertical breathing room
    // (~36px input + 12px `pt-3` reserve) that the labelText sits cleanly
    // above the input without any lift.
    { variant: 'default', dense: true, active: true, class: { labelText: '-translate-y-[0.5rem]' } },
    // Without a label, the wrapper's `pt-3` floating-label reserve serves no
    // purpose and leaves the field ~4–12px taller than an equivalent
    // RuiMenuSelect dense activator. Strip it and tighten the input padding
    // so the underline sits at a matching baseline (40px non-dense, 32px
    // dense) — these match min-h-10 and !min-h-8 of the menu-select
    // activator.
    { variant: 'default', noLabel: true, class: { wrapper: '!pt-0', input: 'py-2' } },
    { variant: 'default', noLabel: true, dense: true, class: { input: 'py-1' } },

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
      // Use a fixed translate in rem (≈50% of the active label's
      // 0.9375rem height — text-[0.75rem] × leading-tight). A percentage
      // translate gets recomputed against the *current* label height,
      // which jumps from 0.9375rem to the input's full height the moment
      // !h-auto is removed on blur — producing a transient transform far
      // larger than the floated value and a visible upward overshoot
      // before the transition settles. Anchoring in rem (rather than %)
      // keeps the start/end values consistent across the height swap and
      // scales with the root font-size.
      //
      // Override the active slot's padding-left to drop `--prepend-w` and
      // stay anchored to the field's left edge — per MD3, the floated
      // label of an outlined field straddles the border at the start of
      // the field, not above the input column. Filled/default both keep
      // the prepend offset (label sits above the input), but outlined
      // does not.
      label: '!h-auto -translate-y-[0.5rem] [padding-left:var(--x-padding,0px)]',
    } },
    { variant: 'outlined', dense: true, class: { input: 'py-2', label: 'leading-[2.5]' } },
    // Re-assert `leading-tight` for outlined+dense+active. The dense rule
    // above sets `leading-[2.5]` which twMerge keeps as the winning leading
    // (it appears later than the active slot's `leading-tight`), inflating
    // the floated label's line-box from ~15px to ~30px and pushing its
    // visual centre below the fieldset border.
    { variant: 'outlined', dense: true, active: true, class: { label: '!leading-tight' } },

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
