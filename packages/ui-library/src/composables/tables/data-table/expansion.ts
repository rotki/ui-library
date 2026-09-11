import type { ComputedRef, Ref } from 'vue';

export interface UseTableExpansionOptions<T extends object, IdType extends keyof T> {
  /** The property on each row used as the unique row identifier. */
  rowAttr: IdType;
  /** Whether only one row can be expanded at a time. */
  singleExpand: boolean;
}

export interface UseTableExpansionDeps<T extends object> {
  expanded: Ref<T[] | undefined>;
}

export interface UseTableExpansionReturn<T extends object, IdType extends keyof T> {
  expandable: ComputedRef<boolean>;
  isExpanded: (identifier: T[IdType]) => boolean;
  onToggleExpand: (row: T) => void;
}

export function useTableExpansion<T extends object, IdType extends keyof T>(
  options: UseTableExpansionOptions<T, IdType>,
  deps: UseTableExpansionDeps<T>,
): UseTableExpansionReturn<T, IdType> {
  const { rowAttr, singleExpand } = options;
  const { expanded } = deps;

  /**
   * Whether the consumer wired a two-way `expanded` model. Whether the
   * `#expanded-item` slot is there is checked fresh in the template instead,
   * so a consumer gating that slot with `v-if`, until data loads say, is not
   * stuck on the first render's snapshot: Vue's `slots` object is not reactive
   * to property access inside a computed.
   */
  const expandable = computed<boolean>(() => !!get(expanded));

  const expandedSet = computed<Set<T[IdType]>>(() => {
    const expandedVal = get(expanded);
    if (!expandedVal?.length)
      return new Set<T[IdType]>();
    return new Set<T[IdType]>(expandedVal.map(row => row[rowAttr]));
  });

  function isExpanded(identifier: T[IdType]): boolean {
    return get(expandedSet).has(identifier);
  }

  function onToggleExpand(row: T): void {
    const expandedVal = get(expanded);
    if (!expandedVal)
      return;

    const key = rowAttr;
    const rowExpanded = isExpanded(row[key]);

    if (singleExpand)
      return set(expanded, rowExpanded ? [] : [row]);

    return set(
      expanded,
      rowExpanded ? expandedVal.filter(item => item[key] !== row[key]) : [...expandedVal, row],
    );
  }

  return {
    expandable,
    isExpanded,
    onToggleExpand,
  };
}
