<script lang="ts" setup generic="T extends object, IdType extends keyof T = keyof T">
import type { GroupHeader } from '@/composables/tables/data-table/types';
import { dataTableStyles } from '@/components/tables/data-table-styles';
import { type DataTableClasses, type DataTableGroupLabel, provideDataTableContext, provideDataTableNested, useDataTableNested } from '@/components/tables/data-table/context';
import RuiDataTableBody from '@/components/tables/data-table/RuiDataTableBody.vue';
import RuiDataTableMobileSort from '@/components/tables/data-table/RuiDataTableMobileSort.vue';
import RuiTableHead, {
  type GroupData,
  type TableColumn,
  type TableRowKeyData,
  type TableSortData,
} from '@/components/tables/RuiTableHead.vue';
import RuiTablePagination, {
  type TablePaginationData,
} from '@/components/tables/RuiTablePagination.vue';
import { GroupExpandButtonPosition } from '@/components/tables/table-props';
import { useTable } from '@/composables/defaults/table';
import { useStickyTableHeader } from '@/composables/sticky-header';
import { useTableColumns } from '@/composables/tables/data-table/columns';
import { useTableExpansion } from '@/composables/tables/data-table/expansion';
import { useTableGrouping } from '@/composables/tables/data-table/grouping';
import { useTablePagination } from '@/composables/tables/data-table/pagination';
import { useTableSelection } from '@/composables/tables/data-table/selection';
import { useTableSort } from '@/composables/tables/data-table/sort';

export type { GroupedTableRow, GroupHeader, TableOptions } from '@/composables/tables/data-table/types';

export interface Props<T, K extends keyof T> {
  /**
   * list of items for each row
   */
  rows: readonly T[];
  /**
   * the attribute used to identify each row uniquely for selection, usually `id`
   */
  rowAttr: K;
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
   * Maximum number of pages before the jump-to-page dropdown is replaced with
   * a numeric input. Defaults to `500`. Forwarded to `RuiTablePagination`.
   */
  rangesThreshold?: number;
  /**
   * The text and icon shown when there are no rows, e.g.
   * `:empty="\{ icon: 'transactions-line', label: 'No transactions found' \}"`
   */
  empty?: {
    label?: string;
    description?: string;
  };
  /**
   * Why the last read failed. Shown above any rows kept from an earlier read,
   * or in place of the empty state; `loading` still takes precedence.
   */
  error?: string;
  /** Heading for that failure. */
  errorTitle?: string;
  /** Label for the retry control; without one, no control is offered. */
  retryText?: string;
  /**
   * should hide the header navigation
   */
  hideDefaultHeader?: boolean;
  /**
   * should hide the footer navigation
   */
  hideDefaultFooter?: boolean;

  rounded?: 'sm' | 'md' | 'lg';
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
  groupExpandButtonPosition?: GroupExpandButtonPosition;
  disabledRows?: readonly T[];
  multiPageSelect?: boolean;
  itemClass?: ((item: T) => string) | string;
  /**
   * Render each row as a stacked card instead of a table row once the measured
   * width is narrower than this width (in pixels). Columns flagged with
   * `mobileHidden` are dropped in this layout. Falls back to the global
   * `mobileBreakpoint` table default; leave both unset to keep the default table
   * layout at every width.
   */
  mobileBreakpoint?: number;
  /**
   * What the `mobileBreakpoint` is measured against: the browser `viewport`
   * (default) or this table's own `container` width. Use `container` when the
   * table lives in a narrow region of a wider window. Falls back to the global
   * `mobileBreakpointBasis` table default.
   */
  mobileBreakpointBasis?: 'viewport' | 'container';
  /**
   * Force the stacked mobile card layout on (`true`) or off (`false`),
   * regardless of `mobileBreakpoint`. Leave unset to derive it from the width.
   */
  mobile?: boolean;
}

defineOptions({
  name: 'RuiDataTable',
});

const selectedData = defineModel<T[IdType][]>();

const expanded = defineModel<T[]>('expanded');

const [pagination, paginationModifiers] = defineModel<TablePaginationData, 'external'>('pagination');

const [sort, sortModifiers] = defineModel<TableSortData<T>, 'external'>('sort');

const group = defineModel<TableRowKeyData<T>>('group');

const collapsed = defineModel<T[]>('collapsed');

const {
  rows,
  rowAttr,
  search = '',
  itemsPerPage = 10,
  cols,
  columnAttr = 'label',
  dense = false,
  outlined = false,
  striped = false,
  loading = false,
  disablePerPage = false,
  rangesThreshold = 500,
  empty = { label: 'No item found' },
  error = '',
  errorTitle = '',
  retryText = '',
  hideDefaultHeader = false,
  hideDefaultFooter = false,
  rounded = 'md',
  singleExpand = false,
  stickyHeader = false,
  stickyOffset,
  globalItemsPerPage = undefined,
  groupExpandButtonPosition = GroupExpandButtonPosition.start,
  disabledRows,
  multiPageSelect = false,
  itemClass = '',
  mobileBreakpoint,
  mobileBreakpointBasis,
  mobile,
} = defineProps<Props<T, IdType>>();

const emit = defineEmits<{
  'update:options': [value: { pagination?: TablePaginationData; sort?: TableSortData<T> }];
  'copy:group': [value: GroupData<T>];
  'retry': [];
}>();

const slots = defineSlots<Partial<
  Record<`header.${string}`, (props: { column: TableColumn<T> }) => any> &
  Record<`item.${string}`, (props: { column: TableColumn<T>; row: T; index: number }) => any> & {
    'body.prepend': (props: { colspan: number }) => any;
    'body.append': (props: { colspan: number }) => any;
    'group.header': (props: {
      colspan: number;
      header: GroupHeader<T>;
      isOpen: boolean;
      toggle: () => void;
    }) => any;
    'group.header.content': (props: { header: GroupHeader<T>; groupKey: string }) => any;
    'expanded-item': (props: { row: T; index: number }) => any;
    'no-data': () => any;
    'empty-description': () => any;
    'error': () => any;
    'tfoot': () => any;
  }
>>();

const tableDefaults = useTable();

const tableWrapper = useTemplateRef<HTMLElement>('tableWrapper');
const { width: windowWidth } = useWindowSize();
const { width: containerWidth } = useElementSize(tableWrapper);

// Per-table props win, then the global table defaults.
const resolvedMobileBreakpoint = computed<number | undefined>(() => {
  if (mobileBreakpoint !== undefined)
    return mobileBreakpoint;
  const globalBreakpoint = tableDefaults.mobileBreakpoint;
  return globalBreakpoint === undefined ? undefined : get(globalBreakpoint);
});
const resolvedMobileBasis = computed<'viewport' | 'container'>(() => {
  if (mobileBreakpointBasis !== undefined)
    return mobileBreakpointBasis;
  const globalBasis = tableDefaults.mobileBreakpointBasis;
  return globalBasis === undefined ? 'viewport' : get(globalBasis);
});

/**
 * Whether the stacked card layout is showing.
 *
 * Vue coerces an absent Boolean prop to `false`, so `mobile` cannot say
 * "unset": with no breakpoint configured it is the manual switch, defaulting
 * to desktop, and with one configured the breakpoint drives the layout while
 * `mobile === true` can still force the stacked layout on.
 */
const isMobile = computed<boolean>(() => {
  const breakpoint = get(resolvedMobileBreakpoint);
  if (breakpoint === undefined)
    return mobile;
  if (mobile)
    return true;
  // `containerWidth` is 0 until measured; the viewport keeps the first paint off mobile
  const width = get(resolvedMobileBasis) === 'container'
    ? (get(containerWidth) || get(windowWidth))
    : get(windowWidth);
  return width < breakpoint;
});

const stickyHeaderOffset = computed<number | undefined>(() =>
  stickyOffset !== undefined ? stickyOffset : get(tableDefaults.stickyOffset),
);

/**
 * A table rendered inside an expanded row must not pin its own toolbar: only
 * the outermost table sticks, otherwise the bars stack and collide.
 */
const isNestedTable = useDataTableNested();
provideDataTableNested();

/**
 * On mobile there is no column header to pin, so `stickyHeader` pins the
 * pagination and sort toolbar instead while the card list scrolls.
 */
const stickyMobileToolbar = computed<boolean>(() => stickyHeader && get(isMobile) && !isNestedTable);

const table = useTemplateRef<HTMLTableElement>('table');
const tableScroller = useTemplateRef<HTMLElement>('tableScroller');

const { stick } = useStickyTableHeader(
  () => stickyHeader,
  stickyHeaderOffset,
  { table },
);

const { width: scrollerWidth } = useElementSize(tableScroller);

/**
 * The visible width of the table, which an expanded row caps its content to.
 * Without the cap a wide panel, such as a nested table, sets the minimum width
 * of the whole table and pushes every column past the scroller. `initial`
 * resets the variable, so a nested table never inherits its parent's width.
 */
const viewportStyle = computed<Record<string, string>>(() => {
  const width = get(scrollerWidth);
  return { '--rui-table-viewport': width > 0 && !get(isMobile) ? `${width}px` : 'initial' };
});

const { expandable, isExpanded, onToggleExpand } = useTableExpansion<T, IdType>(
  { rowAttr, singleExpand },
  { expanded },
);

function emitUpdateOptions(opts: { sort?: TableSortData<T>; pagination?: TablePaginationData }): void {
  emit('update:options', opts);
}

const {
  sortData,
  sortedMap,
  sorted,
  onSort: applySort,
} = useTableSort<T>(
  { rows: () => rows, search: () => search, sortModifiersExternal: sortModifiers.external },
  {
    sort,
    pagination,
    emitUpdateOptions,
  },
);

const {
  groupKeys,
  groupKey,
  grouped,
  mappedGroups,
  isExpandedGroup,
  isHiddenRow,
  onToggleExpandGroup,
  onUngroup,
} = useTableGrouping<T, IdType>(
  { rowAttr },
  {
    group,
    collapsed,
    sorted,
  },
);

const {
  paginationData,
  filtered,
  setInternalTotal,
  resetPagination,
} = useTablePagination<T>(
  {
    itemsPerPage,
    paginationModifiersExternal: paginationModifiers.external,
    globalItemsPerPage,
  },
  {
    pagination,
    grouped,
    isHiddenRow,
    sort,
    emitUpdateOptions,
    tableDefaults,
  },
);

const noData = computed<boolean>(() => get(filtered).length === 0);

/**
 * With the header bar showing, an empty table drops its footer bar: two rows
 * of disabled controls around an empty state only add noise.
 */
const showFooter = computed<boolean>(() => {
  const data = get(paginationData);
  if (!data || hideDefaultFooter)
    return false;
  return data.total > 0 || hideDefaultHeader;
});

/**
 * Grouped columns leave the column list, so their labels come from `cols`.
 */
const groupLabels = computed<DataTableGroupLabel[]>(() => get(groupKeys).map((key) => {
  const label = cols?.find(column => column.key === key)?.[columnAttr];
  return {
    key: String(key),
    label: label === undefined || label === null ? String(key) : String(label),
  };
}));

/** Each group's list starts with its header entry, which is not a row. */
function getGroupSize(identifier: string): number {
  return Math.max((get(mappedGroups)[identifier]?.length ?? 0) - 1, 0);
}

const ui = computed<ReturnType<typeof dataTableStyles>>(() => dataTableStyles({
  outlined,
  rounded,
  dense,
  striped,
  mobile: get(isMobile),
}));

const { columns, colspan, headerSlots, cellValue } = useTableColumns<T, IdType>({
  cols: () => cols,
  columnAttr,
  rows: () => rows,
  expandable,
  groupKeys,
  selectedData,
  slots,
  isMobile,
  tdResolver: options => get(ui).td(options),
});

const showMobileSort = computed<boolean>(() =>
  get(isMobile) && !!get(sortData) && get(columns).some(column => column.sortable),
);

const ITEM_SLOT_PREFIX = 'item.';

// Slot keys are static for the component lifetime — no reactivity needed
const itemSlotKeys: Set<string> = new Set(
  Object.keys(slots)
    .filter((key): key is `item.${string}` => key.startsWith(ITEM_SLOT_PREFIX))
    .map(key => key.slice(ITEM_SLOT_PREFIX.length)),
);

const {
  isAllSelected,
  indeterminate,
  isSelected,
  isDisabledRow,
  onToggleAll,
  onSelect,
  onCheckboxClick,
  deselectRemovedRows,
  resetCheckboxShiftState,
} = useTableSelection<T, IdType>(
  { rowAttr, multiPageSelect, disabledRows: () => disabledRows },
  { selectedData, filtered },
);

/**
 * Sorting clears the selection. That lives here rather than in either
 * composable, which would make sort and selection depend on each other.
 */
function onSort(payload: Parameters<typeof applySort>[0]): void {
  applySort(payload);
  if (!multiPageSelect)
    onToggleAll(false);
  resetCheckboxShiftState();
}

function onPaginate(): void {
  if ((get(expanded)?.length ?? 0) > 0)
    set(expanded, []);
  if (!multiPageSelect)
    onToggleAll(false);
  resetCheckboxShiftState();
}

// Reset pagination page to 1 on search query change
watch(() => search, () => {
  resetPagination();
  onToggleAll(false);
  resetCheckboxShiftState();
});

watch(sorted, (items) => {
  if (!multiPageSelect)
    deselectRemovedRows();
  setInternalTotal(items);
});

onMounted(() => {
  setInternalTotal(get(sorted));
});

const classes = computed<DataTableClasses>(() => {
  const s = get(ui);
  return {
    td: s.td(),
    tr: s.tr(),
    trSelected: s.tr({ rowVariant: 'selected' }),
    trExpandable: s.tr({ rowVariant: 'expandable' }),
    trExpandedParent: s.tr({ rowVariant: 'expandedParent' }),
    trGroup: s.tr({ rowVariant: 'group' }),
    trEmpty: s.tr({ rowVariant: 'empty' }),
    checkbox: s.checkbox(),
    tbody: s.tbody(),
    tbodyLoader: s.tbodyLoader(),
  };
});

provideDataTableContext<T, IdType>({
  // Reactive (ComputedRef/Ref) — destructuring preserves reactivity via Vue template auto-unwrap
  classes,
  columns,
  colspan,
  expandable,
  groupKey,
  groupLabels,
  isMobile,
  selectedData,
  // Static values
  cellValue,
  columnAttr,
  dense,
  getGroupSize,
  getRowId: (row: T) => row[rowAttr],
  itemSlotKeys,
  groupExpandButtonPosition,
  isDisabledRow,
  isExpanded,
  isExpandedGroup,
  isSelected,
  itemClass,
  onCheckboxClick,
  onCopyGroup: (header: GroupHeader<T>) => emit('copy:group', { key: get(groupKey) ?? '', value: header.group }),
  onSelect,
  onToggleExpand,
  onToggleExpandGroup,
  onUngroup,
});
</script>

<template>
  <div
    ref="tableWrapper"
    :class="ui.wrapper()"
    data-id="table-wrapper"
  >
    <div
      :class="stickyMobileToolbar ? 'sticky z-10 bg-white dark:bg-[#121212] pt-2' : 'contents'"
      :style="stickyMobileToolbar ? { top: `${stickyHeaderOffset ?? 0}px` } : undefined"
      data-id="table-mobile-toolbar-sticky"
    >
      <RuiTablePagination
        v-if="paginationData && !hideDefaultHeader"
        v-model="paginationData"
        :dense="dense"
        :loading="loading"
        :mobile="isMobile"
        :disable-per-page="disablePerPage"
        :ranges-threshold="rangesThreshold"
        data-id="table-pagination"
        @update:model-value="onPaginate()"
      />
      <div
        v-if="showMobileSort"
        class="flex justify-end p-2"
        data-id="table-mobile-toolbar"
      >
        <RuiDataTableMobileSort
          :columns="columns"
          :column-attr="columnAttr"
          :sorted-map="sortedMap"
          :dense="dense"
          @sort="onSort($event)"
        />
      </div>
    </div>
    <div
      ref="tableScroller"
      :class="[ui.scroller(), isMobile && !showMobileSort ? 'pt-2' : '']"
      data-id="table-scroller"
    >
      <table
        ref="table"
        :class="ui.table()"
        :style="viewportStyle"
        :aria-busy="loading"
      >
        <RuiTableHead
          v-if="!isMobile"
          :loading="loading"
          :indeterminate="indeterminate"
          :capitalize-headers="!cols"
          :colspan="colspan"
          :column-attr="columnAttr"
          :columns="columns"
          :dense="dense"
          :disable-check-all="!filtered?.length"
          :is-all-selected="isAllSelected"
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
        </RuiTableHead>
        <RuiTableHead
          v-if="stickyHeader && !isMobile"
          :loading="loading"
          :capitalize-headers="!cols"
          :colspan="colspan"
          :column-attr="columnAttr"
          :columns="columns"
          :dense="dense"
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
        </RuiTableHead>
        <RuiDataTableBody
          :filtered="filtered"
          :loading="loading"
          :no-data="noData"
          :empty="empty"
          :error="error"
          :error-title="errorTitle"
          :retry-text="retryText"
          @retry="emit('retry')"
        >
          <template
            v-if="slots.error"
            #error
          >
            <!-- eslint-disable-next-line vue/require-explicit-slots -- defined via Partial<Record<...>> in defineSlots -->
            <slot name="error" />
          </template>
          <template
            v-if="slots['body.prepend']"
            #body.prepend="slotData"
          >
            <!-- eslint-disable-next-line vue/require-explicit-slots -- defined via Partial<Record<...>> in defineSlots -->
            <slot
              name="body.prepend"
              v-bind="slotData"
            />
          </template>
          <template
            v-if="slots['group.header']"
            #group.header="slotData"
          >
            <!-- eslint-disable-next-line vue/require-explicit-slots -- defined via Partial<Record<...>> in defineSlots -->
            <slot
              name="group.header"
              v-bind="slotData"
            />
          </template>
          <template
            v-if="slots['group.header.content']"
            #group.header.content="slotData"
          >
            <!-- eslint-disable-next-line vue/require-explicit-slots -- defined via Partial<Record<...>> in defineSlots -->
            <slot
              name="group.header.content"
              v-bind="slotData"
            />
          </template>
          <template
            v-for="key in itemSlotKeys"
            #[`item.${key}`]="slotData"
          >
            <!-- eslint-disable-next-line vue/require-explicit-slots -- defined via Partial<Record<...>> in defineSlots -->
            <slot
              :name="`item.${key}`"
              v-bind="slotData"
            />
          </template>
          <template
            v-if="slots['expanded-item']"
            #expanded-item="slotData"
          >
            <!-- eslint-disable-next-line vue/require-explicit-slots -- defined via Partial<Record<...>> in defineSlots -->
            <slot
              name="expanded-item"
              v-bind="slotData"
            />
          </template>
          <template
            v-if="slots['no-data']"
            #no-data
          >
            <!-- eslint-disable-next-line vue/require-explicit-slots -- defined via Partial<Record<...>> in defineSlots -->
            <slot name="no-data" />
          </template>
          <template
            v-if="slots['empty-description']"
            #empty-description
          >
            <!-- eslint-disable-next-line vue/require-explicit-slots -- defined via Partial<Record<...>> in defineSlots -->
            <slot name="empty-description" />
          </template>
          <template
            v-if="slots['body.append']"
            #body.append="slotData"
          >
            <!-- eslint-disable-next-line vue/require-explicit-slots -- defined via Partial<Record<...>> in defineSlots -->
            <slot
              name="body.append"
              v-bind="slotData"
            />
          </template>
        </RuiDataTableBody>
        <tfoot>
          <!-- eslint-disable-next-line vue/require-explicit-slots -- defined via Partial<Record<...>> in defineSlots -->
          <slot name="tfoot" />
        </tfoot>
      </table>
    </div>
    <RuiTablePagination
      v-if="paginationData && showFooter"
      v-model="paginationData"
      :dense="dense"
      :loading="loading"
      :mobile="isMobile"
      :disable-per-page="disablePerPage"
      :ranges-threshold="rangesThreshold"
      data-id="table-pagination"
      @update:model-value="onPaginate()"
    />
  </div>
</template>
