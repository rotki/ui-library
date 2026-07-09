import { activatorStyles, type TextInputVariant } from '@/components/forms/text-input-styles';
import { tv } from '@/utils/tv';

export type CategoryPickerVariant = TextInputVariant;

/**
 * Form-field trigger, shared with `RuiAutoComplete` / `RuiMenuSelect` via
 * `activatorStyles`: floating label, outlined/filled/underline variants,
 * error + hint details, required marker.
 */
export const categoryPickerActivatorStyles = tv({
  extend: activatorStyles,
  variants: {
    // Re-declare for type inference — actual styles live in activatorStyles.
    filled: { true: {} },
  },
});

/**
 * Layout styles for `RuiCategoryPicker`. Item and category rows lean on
 * `RuiButton variant="list"` for their interactive/active visuals; these slots
 * cover only the surrounding two-pane (and mobile drill-in) scaffold.
 */
export const categoryPickerStyles = tv({
  slots: {
    // Cap to the space the floating layer measured toward the viewport edge
    // (set as --rui-floating-max-height by the menu's size middleware), falling
    // back to 60vh. The body flex-shrinks within this so the footer stays put.
    root: 'flex flex-col min-w-0 max-h-[var(--rui-floating-max-height,60vh)] bg-white dark:bg-rui-grey-900 rounded-md overflow-hidden',
    header: 'flex flex-col gap-3 p-4 border-b border-rui-grey-200 dark:border-rui-grey-800',
    title: 'text-h6 text-rui-text',
    body: 'grid min-h-0 flex-1',
    rail: 'flex flex-col gap-0.5 p-2 overflow-y-auto outline-none border-rui-grey-200 dark:border-rui-grey-800',
    railCount: 'ml-auto pl-2 text-caption tabular-nums text-rui-text-secondary',
    detail: 'flex flex-col gap-0.5 p-2 overflow-y-auto outline-none min-w-0',
    // Keyboard highlight for the active-descendant item (focus lives on the
    // pane container, so the highlight is the only per-item focus cue).
    highlighted: '!bg-rui-grey-100 dark:!bg-rui-grey-800',
    subheader: 'px-3 pt-3 pb-1 text-overline text-rui-text-secondary uppercase',
    empty: 'flex flex-1 items-center justify-center p-8 text-body-2 text-rui-text-secondary text-center',
    // Opaque panel surface so a scrolled pane never bleeds through the footer.
    footer: 'shrink-0 p-3 border-t border-rui-grey-200 dark:border-rui-grey-800 bg-white dark:bg-rui-grey-900',
    backButton: 'flex items-center gap-2',
  },
  variants: {
    mode: {
      // Desktop: category rail beside the detail pane, inside an anchored
      // popover. The explicit width lets the `1fr` detail column resolve
      // (a `w-max` popover would otherwise collapse it to its content).
      twoPane: {
        root: 'w-[40rem] max-w-[calc(100vw-2rem)]',
        body: 'grid-cols-[minmax(9.5rem,13rem)_1fr]',
        rail: 'border-r',
      },
      // Narrow width: one column at a time, drill in and back out, inside a
      // full-width bottom sheet.
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
