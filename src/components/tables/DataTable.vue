<script
  lang="ts"
  setup
  generic="T extends object, IdType extends keyof T = keyof T"
>
import Checkbox from '@/components/forms/checkbox/Checkbox.vue';
import Button from '@/components/buttons/button/Button.vue';
import Icon from '@/components/icons/Icon.vue';
import Tooltip from '@/components/overlays/tooltip/Tooltip.vue';
import ExpandButton from '@/components/tables/ExpandButton.vue';
import TablePagination, { type TablePaginationData } from './TablePagination.vue';
import TableHead, { type GroupData, type GroupKeys, type NoneSortableTableColumn, type SortColumn, type TableColumn, type TableRowKey, type TableRowKeyData, type TableSortData,
} from './TableHead.vue';
import type { Ref } from 'vue';

export interface TableOptions<T> {
  pagination?: TablePaginationData;
  sort?: TableSortData<T>;
}

export interface GroupHeader<T> {
  __header__: true;
  identifier: string;
  group: Partial<T>;
}

export type GroupedTableRow<T> = T | GroupHeader<T>;

export interface Props<T, K extends keyof T> {
  /**
   * list of items for each row
   */
  rows: T[];
  /**
   * the attribute used to identify each row uniquely for selection, usually `id`
   */
  rowAttr: K;
  /**
   * model for selected rows, add a v-model to support row selection
   */
  modelValue?: T[K][];
  /**
   * model for internal searching
   */
  search?: string;
  /**
   * model for items per page
   * will be used if the `pagination` model isn't specified
   */
  itemsPerPage?: number;
  /**
   * model for paginating data
   * @example v-model:pagination="{ total: 10, limit: 5, page: 1 }"
   */
  pagination?: TablePaginationData;
  /**
   * modifiers for specifying externally paginated tables
   * use this when api controls pagination
   * @example v-model:pagination.external="{ total: 10, limit: 5, page: 1 }"
   */
  paginationModifiers?: {
    external: boolean;
  };
  /**
   * model for sort column/columns data
   * single column sort
   * @example v-model:sort="{ column: 'name', direction: 'asc' }"
   * multi columns sort
   * @example v-model:sort="[{ column: 'name', direction: 'asc' }]"
   */
  sort?: TableSortData<T>;
  /**
   * modifiers for specifying externally sorted tables
   * use this when api controls sorting
   * single column sort
   * @example v-model:sort.external="{ column: 'name', direction: 'asc' }"
   * multi columns sort
   * @example v-model:sort.external="[{ column: 'name', direction: 'asc' }]"
   */
  sortModifiers?: {
    external: boolean;
  };
  /**
   * list of column definitions
   */
  cols?: TableColumn<T>[];
  /**
   * attribute to use from column definitions to display column titles
   */
  columnAttr?: keyof TableColumn<T>;
  /**
   * flag to show a more or less spacious table
   */
  dense?: boolean;
  /**
   * flag to outline the flag with a border
   */
  outlined?: boolean;
  /**
   * should add zebra-striping to the table row
   */
  striped?: boolean;
  /**
   * flag to show loading state of the table
   * triggers indefinite progress at the bottom of the table header
   */
  loading?: boolean;
  disablePerPage?: boolean;
  /**
   * data to display for empty state
   * text and icon
   * @example :empty="{ icon: 'transactions-line', label: 'No transactions found' }"
   */
  empty?: {
    label?: string;
    description?: string;
  };
  /**
   * should hide the footer
   */
  hideDefaultFooter?: boolean;

  rounded?: 'sm' | 'md' | 'lg';
  /**
   * model for expanded rows
   */
  expanded?: T[];
  /**
   * make expansion work like accordion
   */
  singleExpand?: boolean;
  /**
   * make table head stick to top on scroll
   */
  stickyHeader?: boolean;
  stickyOffset?: number;
  /**
   * Affects how the items per page work across the app.
   * When true, changing the items per page setting in one table will affect other tables.
   */
  globalItemsPerPage?: boolean;
  /**
   * model for grouping column/columns data
   * single column grouping
   * @example v-model:group="'name'"
   * multi columns grouping
   * @example v-model:group="['name', 'country']"
   */
  group?: TableRowKeyData<T>;
  collapsed?: T[];
  disabledRows?: T[];
}

defineOptions({
  name: 'RuiDataTable',
});

const props = withDefaults(defineProps<Props<T, IdType>>(), {
  modelValue: undefined,
  search: '',
  cols: undefined,
  itemsPerPage: 10,
  pagination: undefined,
  columnAttr: 'label',
  sort: undefined,
  loading: false,
  dense: false,
  outlined: false,
  paginationModifiers: undefined,
  sortModifiers: undefined,
  empty: () => ({ description: 'No item found' }),
  rounded: 'md',
  hideDefaultFooter: false,
  disablePerPage: false,
  striped: false,
  expanded: undefined,
  singleExpand: false,
  stickyHeader: false,
  stickyOffset: undefined,
  globalItemsPerPage: undefined,
  group: undefined,
  collapsed: undefined,
  disabledRows: undefined,
});

const emit = defineEmits<{
  (e: 'update:model-value', value?: T[IdType][]): void;
  (e: 'update:expanded', value: T[]): void;
  (e: 'update:pagination', value: TablePaginationData): void;
  (e: 'update:sort', value?: TableSortData<T>): void;
  (e: 'update:options', value: TableOptions<T>): void;
  (e: 'update:group', value?: GroupKeys<T>): void;
  (e: 'update:collapsed', value?: T[]): void;
  (e: 'copy:group', value: GroupData<T>): void;
}>();

const slots = defineSlots<
  Partial<Record<`header.${string}`, (props: {
    column: TableColumn<T>;
  }) => any>
  & Record<`item.${string}`, (props: {
    column: TableColumn<T>;
    row: T;
    index: number;
  }) => any>
  & {
    'body.prepend': (props: { colspan: number }) => any;
    'body.append': (props: { colspan: number }) => any;
    'group.header': (props: {
      colspan: number;
      header: GroupHeader<T>;
      isOpen: boolean;
      toggle: () => void;
    }) => any;
    'group.header.content': (props: {
      header: GroupHeader<T>;
      groupKey: string;
    }) => any;
    'expanded-item': (props: { row: T; index: number }) => any;
    'no-data': () => any;
    'empty-description': () => any;
    'tfoot': () => any;
  }>
>();

const { stickyHeader, collapsed, modelValue, disabledRows } = toRefs(props);
const tableDefaults = useTable();

const stickyHeaderOffset = computed(() => props.stickyOffset !== undefined ? props.stickyOffset : get(tableDefaults.stickyOffset));

function isRow<T extends object>(item: GroupedTableRow<T>): item is T {
  return !('__header__' in item);
}

function isHeaderSlot(slotName: string): slotName is `header.${string}` {
  return slotName.startsWith('header.');
}

const css = useCssModule();
const { stick, table, tableScroller } = useStickyTableHeader(
  stickyHeader,
  get(stickyHeaderOffset),
);

const expandable = computed(() => props.expanded && slots['expanded-item']);

const headerSlots = computed<`header.${string}`[]>(() =>
  Object.keys(slots).filter(isHeaderSlot),
);

const globalItemsPerPageSettings = computed(() => {
  if (props.globalItemsPerPage !== undefined)
    return props.globalItemsPerPage;

  return get(tableDefaults.globalItemsPerPage);
});

const getKeys = <T extends object>(t: T) => Object.keys(t) as TableRowKey<T>[];

const groupKeys: ComputedRef<TableRowKey<T>[]> = computed(() => {
  const groupBy = props.group;

  if (!groupBy) {
    // no grouping
    return [];
  }

  if (!Array.isArray(groupBy)) {
    // currently only supports a single grouping
    // only the first item in the array is used
    return [groupBy];
  }

  return groupBy;
});

const groupKey = computed(() => get(groupKeys).join(':'));

const isGrouped = computed(() => !!get(groupKey));

/**
 * Prepare the columns from props or generate using first item in the list
 */
const columns = computed<TableColumn<T>[]>(() => {
  const data
    = props.cols
    ?? getKeys(props.rows[0] ?? {}).map(
      key =>
        ({
          key,
          [props.columnAttr]: key.toString(),
        }) satisfies NoneSortableTableColumn<T>,
    );

  if (get(expandable)) {
    return [
      ...data,
      {
        key: 'expand' as TableRowKey<T>,
        sortable: false,
        class: 'w-16',
        cellClass: '!py-0 w-16',
        align: 'end',
      } satisfies NoneSortableTableColumn<T>,
    ];
  }

  const groupByKeys = get(groupKeys);

  if (groupByKeys.length === 0)
    return data;

  return data.filter(
    column => !groupByKeys.includes(column.key as TableRowKey<T>),
  );
});

const itemsLength = ref(0);

const selectedData = computed<T[IdType][] | undefined>({
  get() {
    return get(modelValue);
  },
  set(value) {
    emit('update:model-value', value);
  },
});

const internalSelectedData: Ref<T[IdType][]> = ref([]);

watchImmediate(modelValue, (modelValue) => {
  set(internalSelectedData, modelValue);
});

const rowIdentifier = computed(() => props.rowAttr);

const internalPaginationState: Ref<TablePaginationData | undefined> = ref();
const collapsedRows: Ref<T[]> = ref([]);

const pagination = computed(() => props.pagination);

watchImmediate(pagination, (pagination) => {
  set(internalPaginationState, pagination);
});

watchImmediate(collapsed, (value) => {
  set(collapsedRows, value ?? []);
});

/**
 * Pagination is different for search
 * since search is only used for internal filtering
 * we return the length of search results as total
 */
const paginationData: Ref<TablePaginationData> = computed({
  get() {
    const paginated = get(internalPaginationState);
    if (!paginated) {
      return {
        total: get(itemsLength),
        limit: props.itemsPerPage,
        page: 1,
      };
    }

    if (props.paginationModifiers?.external)
      return paginated;

    return {
      total: get(itemsLength),
      limit: paginated.limit,
      page: paginated.page,
      limits: paginated.limits,
    };
  },
  set(value: TablePaginationData) {
    set(internalPaginationState, value);
    emit('update:pagination', value);
    emit('update:options', {
      pagination: value,
      sort: props.sort,
    });
  },
});

const sortData = computed({
  get() {
    return props.sort;
  },
  set(value) {
    onToggleAll(false);
    resetCheckboxShiftState();
    emit('update:sort', value);
    emit('update:options', {
      sort: value,
      pagination: get(pagination),
    });
  },
});

/**
 * A mapping of the sort columns
 * for easily checking if a column is sorted instead of looping through the array
 */
const sortedMap = computed(() => {
  const mapped: Partial<Record<TableRowKey<T>, SortColumn<T>>> = {};
  const sortBy = get(sortData);
  if (!sortBy)
    return mapped;

  if (!Array.isArray(sortBy)) {
    if (sortBy.column)
      mapped[sortBy.column] = sortBy;

    return mapped;
  }

  return sortBy.reduce((acc, curr) => {
    if (!curr.column)
      return acc;

    return { ...acc, [curr.column]: curr };
  }, mapped);
});

/**
 * rows filtered based on search query if it exists
 */
const searchData = computed<T[]>(() => {
  const query = props.search?.toLocaleLowerCase();
  if (!query)
    return props.rows;

  return props.rows.filter(row =>
    getKeys(row).some(key =>
      `${row[key]}`.toLocaleLowerCase().includes(query),
    ),
  );
});

/**
 * sort the search results
 */
const sorted: ComputedRef<T[]> = computed(() => {
  const sortBy = get(sortData);
  const data = [...get(searchData)];
  if (!sortBy || props.sortModifiers?.external)
    return data;

  const sortOptions: Intl.CollatorOptions = { sensitivity: 'accent', usage: 'sort' };

  const sort = (by: SortColumn<T>) => {
    data.sort((a, b) => {
      const column = by.column;
      if (!column)
        return 0;

      let [aValue, bValue] = [a[column], b[column]];
      if (by.direction === 'desc')
        [aValue, bValue] = [bValue, aValue];

      const aNumber = Number(aValue);
      const bNumber = Number(bValue);
      if (!isNaN(aNumber) && !isNaN(bNumber))
        return aNumber - bNumber;

      return `${aValue}`.localeCompare(
        `${bValue}`,
        undefined,
        sortOptions,
      );
    });
  };

  if (!Array.isArray(sortBy))
    sort(sortBy);
  else
    sortBy.forEach(sort);

  return data;
});

/**
 * comprises search, sorted paginated, and grouped data
 */
const mappedGroups = computed<Record<string, GroupedTableRow<T>[]>>(() => {
  if (!get(isGrouped)) {
    // no grouping
    return {};
  }

  const result = get(sorted);
  const identifier = props.rowAttr;

  return result.reduce((acc: Record<string, GroupedTableRow<T>[]>, row) => {
    if (!isDefined(row[identifier]) || row[identifier] === '')
      return acc;

    const group = getRowGroup(row);
    const groupVal = Object.values(group).filter(isDefined).join(',');
    if (!acc[groupVal]) {
      acc[groupVal] = [
        {
          __header__: true,
          group,
          identifier: groupVal,
        } satisfies GroupHeader<T>,
      ];
    }

    acc[groupVal].push(row);

    return acc;
  }, {});
});

/**
 * comprises search, sorted paginated, and grouped data
 */
const grouped = computed<GroupedTableRow<T>[]>(() => {
  const result = get(sorted);
  const groupByKey = get(groupKey);

  if (!groupByKey) {
    // no grouping
    return result;
  }

  return Object.values(get(mappedGroups)).flatMap(grouped => grouped);
});

/**
 * comprises search, sorted and paginated data
 */
const filtered = computed<GroupedTableRow<T>[]>(() => {
  const result = get(grouped);

  const paginated = get(paginationData);
  const limit = paginated.limit;
  if (paginated && !props.paginationModifiers?.external) {
    const start = (paginated.page - 1) * limit;
    const end = start + limit;
    const preGroups = result.slice(0, start + 1).filter(item => !isRow(item));
    const postGroups = result.slice(start + 1, end + preGroups.length).filter(item => !isRow(item));
    const data = result.slice(start + preGroups.length, end + preGroups.length + postGroups.length);
    const nearestGroup = preGroups.at(-1);
    if (data.length > 0) {
      // if our first item is not a group, push in the nearest group
      if (isRow(data[0]) && nearestGroup)
        data.unshift(nearestGroup);
      const lastItem = data.at(-1);
      // if our last item is a group, remove it
      if (lastItem && !isRow(lastItem))
        data.pop();
    }

    return data.filter(row => !isHiddenRow(row));
  }

  return result.filter(row => !isHiddenRow(row));
});

/**
 * list if ids of the visible table rows used for check-all and uncheck-all
 */
const visibleIdentifiers = computed<T[IdType][]>(() => {
  const selectBy = props.rowAttr;

  if (!selectBy)
    return [];

  return get(filtered)
    .filter(isRow)
    .map(row => row[selectBy]);
});

/**
 * Flag to know when all rows are selected for the current screen
 */
const isAllSelected = computed<boolean>(() => {
  const selectedRows = get(selectedData);
  if (!selectedRows)
    return false;

  return (
    selectedRows.length > 0
    && get(visibleIdentifiers).every(id => selectedRows.includes(id))
  );
});

const indeterminate = computed(() => {
  const selectedRows = get(selectedData);
  if (!selectedRows)
    return false;

  return selectedRows.length > 0 && !get(isAllSelected);
});

const noData = computed(() => get(filtered).length === 0);

const colspan = computed(() => {
  let columnLength = get(columns).length;
  if (get(selectedData))
    columnLength++;

  return columnLength;
});

const isSortedBy = (key: TableRowKey<T>) => key in get(sortedMap);

function getSortIndex(key: TableRowKey<T>) {
  const sortBy = get(sortData);

  if (!sortBy || !Array.isArray(sortBy) || !isSortedBy(key))
    return -1;

  return sortBy.findIndex(sort => sort.column === key) ?? -1;
}

function isSelected(identifier: T[IdType]) {
  const selection = get(selectedData);
  if (!selection)
    return false;

  return selection.includes(identifier);
}

function isDisabledRow(rowKey: T[IdType]) {
  const identifier = props.rowAttr;
  if (!identifier)
    return false;

  return get(disabledRows)?.some((disabledRow: T) => rowKey === disabledRow[identifier]);
}

function isExpanded(identifier: T[IdType]) {
  const { expanded } = props;
  if (!expanded?.length)
    return false;

  return expanded.some(data => data[props.rowAttr] === identifier);
}

function onToggleExpand(row: T) {
  const { expanded } = props;
  if (!expanded)
    return;

  const key = props.rowAttr;
  const rowExpanded = isExpanded(row[key]);

  if (props.singleExpand)
    return emit('update:expanded', rowExpanded ? [] : [row]);

  return emit(
    'update:expanded',
    rowExpanded
      ? expanded.filter(item => item[key] !== row[key])
      : [...expanded, row],
  );
}

function getRowGroup(row: T): Partial<T> {
  return get(groupKeys).reduce((acc, key) => ({ ...acc, [key]: row[key] }), {});
}

function getGroupRows(groupVal: string) {
  if (!get(isGrouped))
    return [];

  return get(mappedGroups)[groupVal].filter(isRow);
}

function compareGroupsFn(a: T, b: Partial<T>) {
  const group = get(groupKeys);
  if (group.length === 0)
    return false;

  return group.every(key => a[key] === b[key]);
}

function isExpandedGroup(value: Partial<T>) {
  return get(collapsedRows).every(row => !compareGroupsFn(row, value));
}

function isHiddenRow(row: GroupedTableRow<T>) {
  const identifier = props.rowAttr;
  return (
    get(isGrouped)
    && get(collapsedRows).some(
      value => isRow(row) && row[identifier] === value[identifier],
    )
  );
}

function onToggleExpandGroup(group: Partial<T>, value?: string) {
  if (!value)
    return;

  const collapsed = get(collapsedRows);

  const groupExpanded = isExpandedGroup(group);

  const groupRows = getGroupRows(value);

  set(
    collapsedRows,
    groupExpanded
      ? [...collapsed, ...groupRows]
      : collapsed.filter(row => !compareGroupsFn(row, group)),
  );

  emit('update:collapsed', get(collapsedRows));
}

function onUngroup() {
  set(collapsedRows, []);

  emit('update:collapsed', []);
  emit('update:group', Array.isArray(props.group) ? [] : undefined);
}

function onCopyGroup(value: GroupData<T>) {
  emit('copy:group', value);
}

/**
 * Sort to handle single sort or multiple sort columns
 */
function onSort({
  key,
  direction,
}: {
  key: TableRowKey<T>;
  direction?: 'asc' | 'desc';
}) {
  const sortBy = get(sortData);
  if (!sortBy)
    return;

  if (!Array.isArray(sortBy)) {
    if (isSortedBy(key)) {
      const newDirection = !direction || direction === 'asc' ? 'desc' : 'asc';

      if (sortBy.direction === newDirection) {
        set(sortData, { ...sortBy, column: undefined, direction: 'asc' });
      }
      else {
        set(sortData, {
          ...sortBy,
          direction: sortBy.direction === 'asc' ? 'desc' : 'asc',
        });
      }
    }
    else {
      set(sortData, { column: key, direction: direction || 'asc' });
    }
    return;
  }

  if (isSortedBy(key)) {
    const newDirection = !direction || direction === 'asc' ? 'desc' : 'asc';

    const index = getSortIndex(key);
    const sortByCol = sortBy[index];

    if (sortByCol.direction === newDirection)
      sortBy.splice(index, 1);
    else
      sortByCol.direction = sortByCol.direction === 'asc' ? 'desc' : 'asc';

    set(sortData, sortBy);
  }
  else {
    set(sortData, [...sortBy, { column: key, direction: direction || 'asc' }]);
  }
}

/**
 * toggles selected rows
 * @param {boolean} checked checkbox state
 */
function onToggleAll(checked: boolean) {
  if (checked) {
    set(
      selectedData,
      Array.from(
        new Set([...(get(selectedData) ?? []), ...get(visibleIdentifiers)]),
      ),
    );
  }
  else {
    set(
      selectedData,
      get(selectedData)?.filter(
        identifier => !get(visibleIdentifiers).includes(identifier),
      ),
    );
  }
}

const shiftClicked: Ref<boolean> = ref(false);
const lastSelectedIndex: Ref<number> = ref(-1);

function resetCheckboxShiftState() {
  set(shiftClicked, false);
  set(lastSelectedIndex, -1);
}

/**
 * toggles a single row
 * @param {boolean} checked checkbox state
 * @param {string} value the id of the selected row
 * @param {number} index the index of the selected row
 * @param {boolean} userAction whether the select triggered by user manually
 *
 */
function onSelect(checked: boolean, value: T[typeof props.rowAttr], index: number, userAction = false) {
  if (get(shiftClicked) && userAction)
    return;

  const selectedRows = get(internalSelectedData);
  if (!selectedRows)
    return false;

  const selected = isSelected(value);

  if (checked && !selected) {
    set(internalSelectedData, [...selectedRows, value]);
  }
  else if (!checked && selected) {
    set(
      internalSelectedData,
      [...selectedRows].filter(r => r !== value),
    );
  }

  if (userAction)
    set(selectedData, get(internalSelectedData));
}

function onCheckboxClick(event: any, value: T[typeof props.rowAttr], index: number) {
  const input = event.currentTarget.querySelector('input');
  const nodeName = event.target.nodeName;

  const shiftKey = event.shiftKey;
  set(shiftClicked, shiftKey);

  if (input && nodeName !== 'INPUT') {
    if (shiftKey) {
      setTimeout(() => {
        let lastIndex = get(lastSelectedIndex);
        if (lastIndex === -1)
          lastIndex = index;
        const tableData = get(filtered);
        const lastSelectedData = tableData[lastIndex];

        if (isRow(lastSelectedData)) {
          const id = get(rowIdentifier);
          const valueToApply = isSelected(lastSelectedData[id]);

          if (lastIndex === index) {
            onSelect(!valueToApply, value, index);
          }
          else {
            const from = Math.min(lastIndex, index);
            const to = Math.max(lastIndex, index);

            for (let i = from; i <= to; i++) {
              const currSelectedData = tableData[i];
              if (isRow(currSelectedData))
                onSelect(valueToApply, currSelectedData[id], i);
            }
          }

          set(lastSelectedIndex, index);
          set(selectedData, get(internalSelectedData));
        }
      }, 1);
    }

    else { set(lastSelectedIndex, index); }
  }
}

const search = computed(() => props.search);

function scrollToTop() {
  const { top } = useElementBounding(table);

  const wrapper = document.body;
  const tableEl = get(table);

  if (!(tableEl && wrapper))
    return;

  const tableTop = get(top);
  setTimeout(() => {
    const newScrollTop = tableTop + wrapper.scrollTop - (get(stickyHeaderOffset) ?? 0);

    if (wrapper.scrollTop > newScrollTop)
      wrapper.scrollTop = newScrollTop;
  }, 10);
}

function onPaginate() {
  emit('update:expanded', []);
  scrollToTop();
  onToggleAll(false);
  resetCheckboxShiftState();
}

function setInternalTotal(items: GroupedTableRow<T>[]) {
  if (!props.paginationModifiers?.external)
    set(itemsLength, items.filter(isRow).length);
}

function cellValue(row: T, key: TableColumn<T>['key']) {
  return row[key as TableRowKey<T>];
}

/**
 * Keeps the global items per page in sync with the internal state.
 */
watch(internalPaginationState, (pagination) => {
  if (pagination?.limit && get(globalItemsPerPageSettings))
    set(tableDefaults.itemsPerPage, pagination.limit);
});

watch(tableDefaults.itemsPerPage, (itemsPerPage) => {
  if (!get(globalItemsPerPageSettings))
    return;

  set(paginationData, {
    ...get(paginationData),
    limit: itemsPerPage,
  });
});

/**
 * on changing search query, need to reset pagination page to 1
 */
watch(search, () => {
  set(paginationData, {
    ...get(paginationData),
    page: 1,
  });
  onToggleAll(false);
  resetCheckboxShiftState();
});

watch(sorted, setInternalTotal);

onMounted(() => {
  setInternalTotal(get(sorted));

  if (!get(globalItemsPerPageSettings))
    return;

  set(paginationData, {
    ...get(paginationData),
    limit: get(tableDefaults.itemsPerPage),
  });
});
</script>

<template>
  <div
    :class="[
      css.wrapper,
      css[`rounded__${rounded}`],
      { [css.outlined]: outlined },
    ]"
  >
    <div
      ref="tableScroller"
      :class="css.scroller"
    >
      <table
        ref="table"
        :class="[css.table, { [css.dense]: dense }]"
        aria-label=""
      >
        <TableHead
          :loading="loading"
          :indeterminate="indeterminate"
          :capitalize-headers="!cols"
          :colspan="colspan"
          :column-attr="columnAttr"
          :columns="columns"
          :dense="dense"
          :disable-check-all="!filtered?.length"
          :is-all-selected="isAllSelected"
          :no-data="noData"
          :selectable="!!selectedData"
          :sort-data="sortData"
          :sorted-map="sortedMap"
          :stick="stick"
          :sticky-header="stickyHeader"
          @sort="onSort($event)"
          @select:all="onToggleAll($event)"
        >
          <template
            v-for="headerSlot in headerSlots"
            #[headerSlot]="slotData"
          >
            <slot
              :name="headerSlot"
              v-bind="slotData"
            />
          </template>
        </TableHead>
        <TableHead
          v-if="stickyHeader"
          :loading="loading"
          :indeterminate="indeterminate"
          :capitalize-headers="!cols"
          :colspan="colspan"
          :column-attr="columnAttr"
          :columns="columns"
          :dense="dense"
          :disable-check-all="!filtered?.length"
          :is-all-selected="isAllSelected"
          :no-data="noData"
          :selectable="!!selectedData"
          :sort-data="sortData"
          :sorted-map="sortedMap"
          data-id="head-clone"
          class="opacity-0 invisible"
        >
          <template
            v-for="headerSlot in headerSlots"
            #[headerSlot]="slotData"
          >
            <slot
              :name="headerSlot"
              v-bind="slotData"
            />
          </template>
        </TableHead>
        <tbody :class="[css.tbody, { [css['tbody--striped']]: striped }]">
          <slot
            v-if="slots['body.prepend'] && !(loading && noData)"
            :colspan="colspan"
            name="body.prepend"
          />
          <template v-for="(row, index) in filtered">
            <tr
              v-if="!isRow(row)"
              :key="`row-${index}`"
              :class="[css.tr, css.tr__group]"
            >
              <slot
                name="group.header"
                :colspan="colspan"
                :header="row"
                :is-open="isExpandedGroup(row.group)"
                :toggle="() => onToggleExpandGroup(row.group, row.identifier)"
              >
                <td
                  :class="[css.td]"
                  class="!p-2"
                  :colspan="colspan"
                >
                  <div class="flex items-center gap-2">
                    <ExpandButton
                      :expanded="isExpandedGroup(row.group)"
                      @click="onToggleExpandGroup(row.group, row.identifier)"
                    />
                    <slot
                      :group-key="groupKey"
                      name="group.header.content"
                      :header="row"
                    >
                      <span>{{ groupKey }}: {{ row.identifier }}</span>
                      <Button
                        size="sm"
                        variant="text"
                        icon
                        @click="
                          onCopyGroup({ key: groupKey, value: row.group })
                        "
                      >
                        <Icon
                          name="file-copy-line"
                          size="16"
                        />
                      </Button>
                    </slot>
                    <Tooltip
                      :popper="{ placement: 'top' }"
                      class="ml-auto mr-2"
                    >
                      <template #activator>
                        <Button
                          size="sm"
                          variant="text"
                          icon
                          @click="onUngroup()"
                        >
                          <Icon
                            name="delete-bin-line"
                            size="14"
                          />
                        </Button>
                      </template>
                      Ungroup
                    </Tooltip>
                  </div>
                </td>
              </slot>
            </tr>
            <template v-else>
              <tr
                :key="`row-${index}`"
                :class="[
                  css.tr,
                  { [css.tr__selected]: isSelected(row[rowIdentifier]) },
                ]"
              >
                <td
                  v-if="selectedData"
                  :class="css.checkbox"
                  colspan="1"
                  rowspan="1"
                >
                  <Checkbox
                    :data-cy="`table-toggle-check-${index}`"
                    :model-value="isSelected(row[rowIdentifier])"
                    :disabled="isDisabledRow(row[rowIdentifier])"
                    :size="dense ? 'sm' : undefined"
                    color="primary"
                    class="select-none"
                    hide-details
                    @update:model-value="onSelect($event, row[rowIdentifier], index, true)"
                    @click="onCheckboxClick($event, row[rowIdentifier], index)"
                  />
                </td>

                <td
                  v-for="(column, subIndex) in columns"
                  :key="subIndex"
                  :class="[
                    css.td,
                    column.cellClass,
                    css[`align__${column.align ?? 'start'}`],
                  ]"
                  :colspan="column.colspan ?? 1"
                  :rowspan="column.rowspan ?? 1"
                >
                  <slot
                    v-if="column.key === 'expand'"
                    :name="`item.${column.key}`"
                    :column="column"
                    :row="row"
                    :index="index"
                  >
                    <ExpandButton
                      v-if="!slots['item.expand']"
                      :expanded="isExpanded(row[rowIdentifier])"
                      @click="onToggleExpand(row)"
                    />
                  </slot>
                  <slot
                    v-else
                    :column="column"
                    :index="index"
                    :name="`item.${column.key}`"
                    :row="row"
                  >
                    {{ cellValue(row, column.key) }}
                  </slot>
                </td>
              </tr>

              <tr
                v-if="expandable && isExpanded(row[rowIdentifier])"
                :key="`row-expand-${index}`"
                :class="[css.tr, css.tr__expandable]"
              >
                <td
                  :colspan="colspan"
                  :class="[css.td]"
                >
                  <slot
                    name="expanded-item"
                    :row="row"
                    :index="index"
                  />
                </td>
              </tr>
            </template>
          </template>
          <tr
            v-if="noData && empty && !loading"
            :class="[css.tr, css.tr__empty]"
          >
            <Transition
              appear
              enter-active-class="transition ease-out duration-200 delay-200"
              enter-from-class="opacity-0 translate-y-1"
              enter-to-class="opacity-100 translate-y-0"
              leave-active-class="transition ease-in duration-150"
              leave-from-class="opacity-100 translate-y-0"
              leave-to-class="opacity-0 translate-y-1"
            >
              <td
                :class="css.td"
                :colspan="colspan"
              >
                <slot name="no-data">
                  <div :class="css.empty">
                    <p
                      v-if="empty.label"
                      :class="css.empty__label"
                    >
                      {{ empty.label }}
                    </p>

                    <slot name="empty-description">
                      <p
                        v-if="empty.description"
                        :class="css.empty__description"
                      >
                        {{ empty.description }}
                      </p>
                    </slot>
                  </div>
                </slot>
              </td>
            </Transition>
          </tr>
          <slot
            v-if="slots['body.append'] && !(loading && noData)"
            :colspan="colspan"
            name="body.append"
          />
        </tbody>
        <tfoot>
          <slot name="tfoot" />
        </tfoot>
      </table>
    </div>
    <TablePagination
      v-if="paginationData && !hideDefaultFooter"
      v-model="paginationData"
      :dense="dense"
      :loading="loading"
      :disable-per-page="disablePerPage"
      data-cy="table-pagination"
      @update:model-value="onPaginate()"
    />
  </div>
</template>

<style module lang="scss">
.wrapper {
  @apply relative divide-y divide-black/[0.12] overflow-hidden;
  &.outlined {
    @apply border border-black/[0.12];
  }

  &.rounded__sm {
    @apply rounded-[.25rem];

    .image {
      @apply rounded-t-[.25rem];
    }
  }

  &.rounded__md {
    @apply rounded-[.75rem];

    .image {
      @apply rounded-t-[.75rem];
    }
  }

  &.rounded__lg {
    @apply rounded-[1rem];

    .image {
      @apply rounded-t-[1rem];
    }
  }

  .scroller {
    @apply overflow-x-auto overflow-y-hidden;
    clip-path: inset(0 0 0 0);
  }

  .table {
    @apply min-w-full table-fixed divide-y divide-black/[0.12] whitespace-nowrap mx-auto my-0 max-w-fit relative;

    .tbody {
      @apply divide-y divide-black/[0.12];

      &--striped {
        > .tr {
          &:nth-child(even) {
            @apply bg-rui-grey-50;
          }
        }
      }

      > .tr {
        @apply hover:bg-black/[0.04];

        &__selected {
          @apply bg-rui-primary/[0.08];
        }

        &__empty {
          @apply hover:bg-transparent;
        }

        &__expandable {
          @apply bg-[#f9fafb] hover:bg-[#f9fafb];
        }

        &__group {
          @apply bg-black/[0.02];
        }

        .td {
          @apply p-4 text-rui-text text-body-2;
          text-wrap: initial;

          &.align__start {
            @apply text-left rtl:text-right;
          }

          &.align__center {
            @apply text-center;
          }

          &.align__end {
            @apply text-right rtl:text-left;
          }

          .empty {
            @apply flex flex-col space-y-3 items-center justify-center flex-1 py-2;

            &__label {
              @apply text-body-1 font-bold text-center text-current pb-0 mb-0;
            }

            &__description {
              @apply text-body-2 text-center text-rui-text-secondary pb-0 mb-0;
            }
          }
        }
      }
    }

    .checkbox {
      @apply px-2 w-[3.625rem] max-w-[3.625rem];
      label {
        @apply ml-0;
      }
    }

    &.dense {
      .tbody {
        .td {
          @apply py-[0.38rem];
        }
      }
    }
  }
}

:global(.dark) {
  .wrapper {
    @apply divide-white/[0.12];

    &.outlined {
      @apply border-white/[0.12];
    }

    .table {
      @apply divide-white/[0.12];

      .tbody {
        @apply divide-white/[0.12];

        &--striped {
          > .tr {
            &:nth-child(even) {
              @apply bg-rui-grey-900;
            }
          }
        }

        > .tr {
          @apply hover:bg-white/[0.04];

          &__selected {
            @apply bg-rui-dark-primary/[0.08];
          }

          &__expandable {
            @apply bg-[#121212] hover:bg-[#121212];
          }

          &__group {
            @apply bg-white/[0.02];
          }
        }
      }
    }
  }
}
</style>
