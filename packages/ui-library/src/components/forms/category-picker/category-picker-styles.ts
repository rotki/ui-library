import { activatorStyles, type TextInputVariant } from '@/components/forms/text-input-styles';
import { tv } from '@/utils/tv';

export type CategoryPickerVariant = TextInputVariant;

/**
 * Form-field trigger, shared with `RuiAutoComplete` / `RuiMenuSelect` via
 * `activatorStyles`: floating label, outlined/filled/underline variants,
 * error + hint details, required marker.
 *
 * The `selection` slot draws over the emptied input, so it is positioned
 * rather than laid out: `inset-y-0 left-4` lines it up with the field's own
 * `pl-4` text box, and the right offset reserves the trailing controls. It
 * must not take the `value` slot's `w-full`, because a width of 100% beats the
 * right offset and leaves the layer a full field width shifted right by
 * `left-4`, overflowing the field and covering the chevron it meant to clear
 * (rotki/ui-library#559).
 *
 * Those right offsets come from the controls: the chevron sits at `right-3`
 * and is 24px wide, reaching 36px in, which `right-10` clears; the clear
 * button ends at the activator's `pr-8` padding edge plus its own `mr-2`, so
 * its 18px icon reaches 58px in, which `right-16` clears. Right-aligned
 * selection content then lands just left of whichever control is showing.
 */
export const categoryPickerActivatorStyles = tv({
  extend: activatorStyles,
  slots: {
    selection: 'absolute inset-y-0 left-4 flex items-center gap-2 pointer-events-none truncate transition-all duration-75',
  },
  variants: {
    // Re-declared for type inference; the styles themselves live in activatorStyles
    filled: { true: {} },
    withClear: {
      false: { selection: 'right-10' },
      true: { selection: 'right-16' },
    },
  },
  defaultVariants: {
    withClear: false,
  },
});

/**
 * Layout styles for `RuiCategoryPicker`. Item and category rows lean on
 * `RuiButton variant="list"` for their interactive/active visuals; these slots
 * cover only the surrounding two-pane (and mobile drill-in) scaffold.
 *
 * The panel caps itself to the space the floating layer measured toward the
 * viewport edge, which the menu's size middleware sets as
 * `--rui-floating-max-height`, falling back to 60vh. The body flex-shrinks
 * within that, so the footer stays put.
 */
export const categoryPickerStyles = tv({
  slots: {
    root: 'flex flex-col min-w-0 max-h-[var(--rui-floating-max-height,60vh)] bg-white dark:bg-rui-grey-900 rounded-md overflow-hidden',
    header: 'flex flex-col gap-3 p-4 border-b border-rui-grey-200 dark:border-rui-grey-800',
    title: 'text-h6 text-rui-text',
    body: 'grid min-h-0 flex-1',
    rail: 'flex flex-col gap-0.5 p-2 overflow-y-auto outline-none border-rui-grey-200 dark:border-rui-grey-800',
    railCount: 'ml-auto pl-2 text-caption tabular-nums text-rui-text-secondary',
    detail: 'flex flex-col gap-0.5 p-2 overflow-y-auto outline-none min-w-0',
    // Focus lives on the pane container, so this is the only per-item focus cue
    highlighted: '!bg-rui-grey-100 dark:!bg-rui-grey-800',
    subheader: 'px-3 pt-3 pb-1 text-overline text-rui-text-secondary uppercase',
    empty: 'flex flex-1 items-center justify-center p-8 text-body-2 text-rui-text-secondary text-center',
    // Opaque panel surface so a scrolled pane never bleeds through the footer.
    footer: 'shrink-0 p-3 border-t border-rui-grey-200 dark:border-rui-grey-800 bg-white dark:bg-rui-grey-900',
    backButton: 'flex items-center gap-2',
  },
  variants: {
    mode: {
      // Rail beside the detail pane in an anchored popover; the explicit width lets the `1fr` detail column resolve
      twoPane: {
        root: 'w-[40rem] max-w-[calc(100vw-2rem)]',
        body: 'grid-cols-[minmax(9.5rem,13rem)_1fr]',
        rail: 'border-r',
      },
      // One column at a time, drilled in and back out, inside a full-width bottom sheet
      drill: {
        root: 'w-full',
        body: 'grid-cols-1',
        rail: 'border-r-0',
      },
    },
    dense: {
      true: {
        header: 'p-3',
        title: 'text-subtitle-1',
      },
    },
  },
  defaultVariants: {
    mode: 'twoPane',
    dense: false,
  },
});
