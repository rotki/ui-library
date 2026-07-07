import type { MaybeRefOrGetter, Ref } from 'vue';
import { type KeyOfType, useDropdownOptionProperty } from '@/composables/dropdown-menu';

/**
 * A resolved category and the items that belong to it.
 */
export interface CategoryGroup<TItem> {
  category: string;
  items: TItem[];
}

/**
 * A single entry in the category rail. `category` is `null` for the synthetic
 * "All" pseudo-category, which aggregates every currently visible item.
 */
export interface CategoryRailEntry {
  category: string | null;
  label: string;
  count: number;
}

/**
 * A row rendered in the detail pane. Item rows carry a running `index` used for
 * `aria-activedescendant`; header rows are visual separators shown in the
 * flattened "All" view and never receive focus.
 */
export type DetailRow<TItem>
  = | { type: 'header'; category: string }
    | { type: 'item'; item: TItem; index: number };

export interface UseCategoryPickerOptions<TValue, TItem> {
  /** The full catalogue of selectable items. */
  items: MaybeRefOrGetter<TItem[]>;
  /** Resolve an item's category label. */
  categoryOf: (item: TItem) => string;
  /** Property whose value becomes the model value. */
  keyAttr?: KeyOfType<TItem, TValue extends (infer U)[] ? U : TValue>;
  /** Property (or getter) that produces an item's display text. */
  textAttr?: keyof TItem | ((item: TItem) => string);
  /** The current search query. */
  search: Ref<string>;
  /** Whether the search query is applied. */
  searchable: MaybeRefOrGetter<boolean>;
  /** Custom predicate receiving the resolved category as the third argument. */
  filter?: MaybeRefOrGetter<((item: TItem, query: string, category: string) => boolean) | undefined>;
  /** Whether the synthetic "All" pseudo-category is offered. */
  showAll: MaybeRefOrGetter<boolean>;
  /** Label used for the "All" pseudo-category. */
  allLabel: MaybeRefOrGetter<string>;
  /** The picker's current selection. */
  modelValue: Ref<TValue | undefined>;
}

export interface UseCategoryPickerReturn<TItem> {
  getText: (item: TItem) => string | undefined;
  getIdentifier: (item: TItem) => any;
  filteredGroups: Ref<CategoryGroup<TItem>[]>;
  railEntries: Ref<CategoryRailEntry[]>;
  activeCategory: Readonly<Ref<string | null>>;
  detailGroups: Ref<CategoryGroup<TItem>[]>;
  detailRows: Ref<DetailRow<TItem>[]>;
  detailItems: Ref<TItem[]>;
  isEmpty: Ref<boolean>;
  setActiveCategory: (category: string | null) => void;
  syncActiveToSelection: () => void;
  isSelected: (item: TItem) => boolean;
  categoryOf: (item: TItem) => string;
}

/**
 * Owns the grouping, filtering and selection state for `RuiCategoryPicker`.
 *
 * The component keeps DOM concerns (focus, keyboard, scrolling); this composable
 * keeps the data: which categories exist, which survive the current search, and
 * which items belong in the detail pane for the active category.
 */
export function useCategoryPicker<TValue, TItem>(
  options: UseCategoryPickerOptions<TValue, TItem>,
): UseCategoryPickerReturn<TItem> {
  const { allLabel, categoryOf, filter, items, keyAttr, modelValue, search, searchable, showAll, textAttr } = options;

  const { getIdentifier, getText } = useDropdownOptionProperty<TValue, TItem>({
    keyAttr,
    textAttr,
  });

  function defaultFilter(item: TItem, query: string, category: string): boolean {
    const needle = query.toLowerCase();
    const text = (getText(item) ?? '').toLowerCase();
    return text.includes(needle) || category.toLowerCase().includes(needle);
  }

  // All items grouped by category, preserving first-seen category order.
  const allGroups = computed<CategoryGroup<TItem>[]>(() => {
    const map = new Map<string, TItem[]>();
    for (const item of toValue(items)) {
      const category = categoryOf(item);
      const bucket = map.get(category);
      if (bucket)
        bucket.push(item);
      else
        map.set(category, [item]);
    }
    return Array.from(map, ([category, groupItems]) => ({ category, items: groupItems }));
  });

  const query = computed<string>(() => get(search).trim());

  const filteredGroups = computed<CategoryGroup<TItem>[]>(() => {
    const currentQuery = get(query);
    if (!toValue(searchable) || !currentQuery)
      return get(allGroups);

    const filterFn = toValue(filter) ?? defaultFilter;
    return get(allGroups)
      .map(group => ({
        category: group.category,
        items: group.items.filter(item => filterFn(item, currentQuery, group.category)),
      }))
      .filter(group => group.items.length > 0);
  });

  const railEntries = computed<CategoryRailEntry[]>(() => {
    const groups = get(filteredGroups);
    const entries: CategoryRailEntry[] = [];

    if (toValue(showAll)) {
      const total = groups.reduce((sum, group) => sum + group.items.length, 0);
      entries.push({ category: null, count: total, label: toValue(allLabel) });
    }

    for (const group of groups)
      entries.push({ category: group.category, count: group.items.length, label: group.category });

    return entries;
  });

  const activeCategory = shallowRef<string | null>(null);

  function firstCategory(): string | null {
    return get(filteredGroups)[0]?.category ?? null;
  }

  function fallbackCategory(): string | null {
    return toValue(showAll) ? null : firstCategory();
  }

  function setActiveCategory(category: string | null): void {
    set(activeCategory, category);
  }

  // Keep the active category valid as the search narrows the rail. If the
  // active category disappears, fall back to "All" (when shown) or the first
  // remaining category.
  watch(filteredGroups, (groups) => {
    const active = get(activeCategory);
    if (active === null)
      return;
    if (!groups.some(group => group.category === active))
      set(activeCategory, fallbackCategory());
  });

  // When the user starts typing, surface matches across every category so the
  // top hit is global rather than scoped to whatever category was active.
  watch(query, (current, previous) => {
    if (current && !previous && toValue(showAll))
      set(activeCategory, null);
  });

  const detailGroups = computed<CategoryGroup<TItem>[]>(() => {
    const groups = get(filteredGroups);
    const active = get(activeCategory);
    if (active === null)
      return groups;
    const match = groups.find(group => group.category === active);
    return match ? [match] : [];
  });

  const detailItems = computed<TItem[]>(() => get(detailGroups).flatMap(group => group.items));

  const detailRows = computed<DetailRow<TItem>[]>(() => {
    const groups = get(detailGroups);
    const flattened = get(activeCategory) === null && groups.length > 1;
    const rows: DetailRow<TItem>[] = [];
    let index = 0;
    for (const group of groups) {
      if (flattened)
        rows.push({ type: 'header', category: group.category });
      for (const item of group.items)
        rows.push({ index: index++, item, type: 'item' });
    }
    return rows;
  });

  const isEmpty = computed<boolean>(() => get(detailItems).length === 0);

  function isSelected(item: TItem): boolean {
    const value = get(modelValue);
    if (value === undefined)
      return false;
    return getIdentifier(item) === value;
  }

  // Point the rail at the selected item's category so it is visible on open.
  function syncActiveToSelection(): void {
    const value = get(modelValue);
    if (value === undefined) {
      set(activeCategory, fallbackCategory());
      return;
    }
    const selected = toValue(items).find(item => getIdentifier(item) === value);
    set(activeCategory, selected ? categoryOf(selected) : fallbackCategory());
  }

  return {
    activeCategory: readonly(activeCategory),
    categoryOf,
    detailGroups,
    detailItems,
    detailRows,
    filteredGroups,
    getIdentifier,
    getText,
    isEmpty,
    isSelected,
    railEntries,
    setActiveCategory,
    syncActiveToSelection,
  };
}
