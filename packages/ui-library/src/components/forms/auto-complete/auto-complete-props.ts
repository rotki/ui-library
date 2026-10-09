import type { MenuProps } from '@/components/overlays/menu/RuiMenu.vue';
import type { LabelPlacement } from '@/composables/defaults/field';
import type { GroupBy, ItemDisabled, KeyOfType } from '@/composables/dropdown-menu';
import type { RuiIcons } from '@/icons';
import type { VueClassValue } from '@/types/class-value';

export type AutoCompleteModelValue<TValue> =
  TValue extends Array<infer U> ? U[] : TValue | undefined;

export interface RuiAutoCompleteClassNames {
  root?: VueClassValue;
  label?: VueClassValue;
  menu?: VueClassValue;
}

export interface AutoCompleteProps<TValue, TItem> {
  options?: TItem[];
  keyAttr?: KeyOfType<TItem, TValue extends Array<infer U> ? U : TValue>;
  textAttr?: keyof TItem;
  disabled?: boolean;
  loading?: boolean;
  readOnly?: boolean;
  dense?: boolean;
  clearable?: boolean;
  label?: string;
  /** Where the label shows; falls back to the nearest `RuiFieldDefaults`, then the app default, then `top`. */
  labelPlacement?: LabelPlacement;
  menuOptions?: MenuProps;
  classNames?: RuiAutoCompleteClassNames;
  /** An icon at the start of the field, as on `RuiTextField`: a search icon for a search-style picker. */
  prependIcon?: RuiIcons;
  /** Drops the dropdown arrow, for a search-style field where it means nothing (a command palette). */
  hideArrow?: boolean;
  prependWidth?: number;
  appendWidth?: number;
  itemHeight?: number;
  hint?: string;
  errorMessages?: string | string[];
  successMessages?: string | string[];
  hideDetails?: boolean;
  autoSelectFirst?: boolean;
  chips?: boolean;
  noFilter?: boolean;
  hideNoData?: boolean;
  noDataText?: string;
  /**
   * Custom search predicate. Receives the resolved group label as a third
   * argument when `groupBy` is set, so callers don't have to re-run the
   * `groupBy` resolver themselves.
   */
  filter?: (item: TItem, queryText: string, group?: string) => boolean;
  hideSelected?: boolean;
  placeholder?: string;
  returnObject?: boolean;
  customValue?: boolean;
  hideCustomValue?: boolean;
  required?: boolean;
  hideSearchInput?: boolean;
  hideSelectionWrapper?: boolean;
  groupBy?: GroupBy<TItem>;
  itemDisabled?: ItemDisabled<TItem>;
  /**
   * When true and `groupBy` is set, the default search predicate also matches
   * against the resolved group label. Items belonging to a group whose label
   * matches the query stay visible (group header included), even when the
   * items themselves don't match. No effect when a custom `filter` is supplied
   * or when `groupBy` is undefined.
   */
  searchIncludesGroupLabel?: boolean;
}
