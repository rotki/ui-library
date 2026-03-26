<script lang="ts" setup generic="T extends object, IdType extends keyof T = keyof T">
import RuiButton from '@/components/buttons/button/RuiButton.vue';
import RuiCheckbox from '@/components/forms/checkbox/RuiCheckbox.vue';
import RuiIcon from '@/components/icons/RuiIcon.vue';
import RuiTooltip from '@/components/overlays/tooltip/RuiTooltip.vue';
import RuiProgress from '@/components/progress/RuiProgress.vue';
import { dataTableStyles, getAlignClass } from '@/components/tables/data-table-styles';
import RuiExpandButton from '@/components/tables/RuiExpandButton.vue';
import RuiTableEmptyState from '@/components/tables/RuiTableEmptyState.vue';
import RuiTableHead, {
  type GroupData,
  type TableColumn,
  type TableRowKeyData,
  type TableSortData,
} from '@/components/tables/RuiTableHead.vue';
import RuiTablePagination, {
  type TablePaginationData,
} from '@/components/tables/RuiTablePagination.vue';
import { useTable } from '@/composables/defaults/table';
import { useStickyTableHeader } from '@/composables/sticky-header';
import { useTableColumns } from '@/composables/tables/data-table/columns';
import { useTableExpansion } from '@/composables/tables/data-table/expansion';
import { useTableGrouping } from '@/composables/tables/data-table/grouping';
import { useTablePagination } from '@/composables/tables/data-table/pagination';
import { useTableSelection } from '@/composables/tables/data-table/selection';
import { useTableSort } from '@/composables/tables/data-table/sort';
import { type GroupHeader, isRow } from '@/composables/tables/data-table/types';

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
   * data to display for empty state
   * text and icon
   * @example :empty="{ icon: 'transactions-line', label: 'No transactions found' }"
   */
  empty?: {
    label?: string;
    description?: string;
  };
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
  groupExpandButtonPosition?: 'start' | 'end';
  disabledRows?: readonly T[];
  multiPageSelect?: boolean;
  itemClass?: ((item: T) => string) | string;
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
  empty = { label: 'No item found' },
  hideDefaultHeader = false,
  hideDefaultFooter = false,
  rounded = 'md',
  singleExpand = false,
  stickyHeader = false,
  stickyOffset,
  globalItemsPerPage = undefined,
  groupExpandButtonPosition = 'start',
  disabledRows,
  multiPageSelect = false,
  itemClass = '',
} = defineProps<Props<T, IdType>>();

const emit = defineEmits<{
  'update:options': [value: { pagination?: TablePaginationData; sort?: TableSortData<T> }];
  'copy:group': [value: GroupData<T>];
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
    'tfoot': () => any;
  }
>>();

const tableDefaults = useTable();

const stickyHeaderOffset = computed<number | undefined>(() =>
  stickyOffset !== undefined ? stickyOffset : get(tableDefaults.stickyOffset),
);

const table = useTemplateRef<HTMLTableElement>('table');
const tableScroller = useTemplateRef<HTMLElement>('tableScroller');

const { stick } = useStickyTableHeader(
  () => stickyHeader,
  stickyHeaderOffset,
  { table, tableScroller },
);

const hasExpandedItemSlot = computed<boolean>(() => !!slots['expanded-item']);

const { expandable, isExpanded, onToggleExpand } = useTableExpansion<T, IdType>(
  { rowAttr, singleExpand },
  { expanded, hasExpandedItemSlot },
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
  isExpandedGroup,
  isHiddenRow,
  onToggleExpandGroup,
  onUngroup,
  onCopyGroup,
} = useTableGrouping<T, IdType>(
  { rowAttr },
  {
    group,
    collapsed,
    sorted,
    emitCopyGroup: (value: GroupData<T>) => emit('copy:group', value),
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

const { columns, colspan, headerSlots, cellValue } = useTableColumns<T, IdType>({
  cols: () => cols,
  columnAttr,
  rows: () => rows,
  expandable,
  groupKeys,
  selectedData,
  slots,
});

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

// Sort triggers selection reset — handled here to avoid circular dependency between sort and selection
function onSort(payload: Parameters<typeof applySort>[0]): void {
  applySort(payload);
  if (!multiPageSelect)
    onToggleAll(false);
  resetCheckboxShiftState();
}

function onPaginate(): void {
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

const ui = computed<ReturnType<typeof dataTableStyles>>(() => dataTableStyles({
  outlined,
  rounded,
  dense,
  striped,
}));
</script>

<template>
  <div
    :class="ui.wrapper()"
    data-id="table-wrapper"
  >
    <RuiTablePagination
      v-if="paginationData && !hideDefaultHeader"
      v-model="paginationData"
      :dense="dense"
      :loading="loading"
      :disable-per-page="disablePerPage"
      data-id="table-pagination"
      @update:model-value="onPaginate()"
    />
    <div
      ref="tableScroller"
      :class="ui.scroller()"
      data-id="table-scroller"
    >
      <table
        ref="table"
        :class="ui.table()"
        :aria-busy="loading"
      >
        <RuiTableHead
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
        </RuiTableHead>
        <RuiTableHead
          v-if="stickyHeader"
          :loading="loading"
          :capitalize-headers="!cols"
          :colspan="colspan"
          :column-attr="columnAttr"
          :columns="columns"
          :dense="dense"
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
        </RuiTableHead>
        <tbody :class="ui.tbody()">
          <!-- eslint-disable-next-line vue/require-explicit-slots -- defined via Partial<Record<...>> in defineSlots -->
          <slot
            v-if="slots['body.prepend']"
            :colspan="colspan"
            name="body.prepend"
          />
          <template v-for="(row, index) in filtered">
            <tr
              v-if="!isRow(row)"
              :key="`row-${index}`"
              :class="[ui.tr({ rowVariant: 'group' })]"
              data-id="row-group"
            >
              <!-- eslint-disable-next-line vue/require-explicit-slots -- defined via Partial<Record<...>> in defineSlots -->
              <slot
                name="group.header"
                :colspan="colspan"
                :header="row"
                :is-open="isExpandedGroup(row.group)"
                :toggle="() => onToggleExpandGroup(row.group, row.identifier)"
              >
                <td
                  :class="[ui.td()]"
                  class="!p-2"
                  :colspan="colspan"
                >
                  <div class="flex items-center gap-2">
                    <RuiExpandButton
                      v-if="groupExpandButtonPosition === 'start'"
                      :expanded="isExpandedGroup(row.group)"
                      @click="onToggleExpandGroup(row.group, row.identifier)"
                    />
                    <!-- eslint-disable-next-line vue/require-explicit-slots -- defined via Partial<Record<...>> in defineSlots -->
                    <slot
                      :group-key="groupKey"
                      name="group.header.content"
                      :header="row"
                    >
                      <span>{{ groupKey }}: {{ row.identifier }}</span>
                      <RuiButton
                        size="sm"
                        variant="text"
                        icon
                        data-id="group-copy-button"
                        @click="onCopyGroup({ key: groupKey, value: row.group })"
                      >
                        <RuiIcon
                          name="lu-copy"
                          size="16"
                        />
                      </RuiButton>
                    </slot>
                    <RuiTooltip
                      :popper="{ placement: 'top' }"
                      class="ml-auto mr-2"
                    >
                      <template #activator>
                        <RuiButton
                          size="sm"
                          variant="text"
                          icon
                          data-id="group-ungroup-button"
                          @click="onUngroup()"
                        >
                          <RuiIcon
                            name="lu-trash-2"
                            size="14"
                          />
                        </RuiButton>
                      </template>
                      Ungroup
                    </RuiTooltip>
                    <RuiExpandButton
                      v-if="groupExpandButtonPosition === 'end'"
                      :expanded="isExpandedGroup(row.group)"
                      @click="onToggleExpandGroup(row.group, row.identifier)"
                    />
                  </div>
                </td>
              </slot>
            </tr>
            <template v-else>
              <tr
                :key="`row-${index}`"
                :class="[
                  ui.tr({ rowVariant: isSelected(row[rowAttr]) ? 'selected' : undefined }),
                  typeof itemClass === 'string' ? itemClass : itemClass(row),
                ]"
                :aria-selected="selectedData ? isSelected(row[rowAttr]) : undefined"
                data-id="row"
              >
                <td
                  v-if="selectedData"
                  :class="ui.checkbox()"
                  colspan="1"
                  rowspan="1"
                >
                  <RuiCheckbox
                    :data-id="`table-toggle-check-${index}`"
                    :model-value="isSelected(row[rowAttr])"
                    :disabled="isDisabledRow(row[rowAttr])"
                    :size="dense ? 'sm' : undefined"
                    color="primary"
                    class="select-none"
                    hide-details
                    @update:model-value="onSelect($event, row[rowAttr], true)"
                    @click="onCheckboxClick($event, row[rowAttr], index)"
                  />
                </td>

                <td
                  v-for="(column, subIndex) in columns"
                  :key="subIndex"
                  :class="[
                    ui.td({ class: getAlignClass(column.align) }),
                    column.cellClass,
                  ]"
                  :colspan="column.colspan ?? 1"
                  :rowspan="column.rowspan ?? 1"
                >
                  <slot
                    v-if="column.key === 'expand'"
                    :name="`item.${column.key.toString()}`"
                    :column="column"
                    :row="row"
                    :index="index"
                  >
                    <RuiExpandButton
                      v-if="!slots['item.expand']"
                      :expanded="isExpanded(row[rowAttr])"
                      @click="onToggleExpand(row)"
                    />
                  </slot>
                  <slot
                    v-else
                    :column="column"
                    :index="index"
                    :name="`item.${column.key.toString()}`"
                    :row="row"
                  >
                    {{ cellValue(row, column.key) }}
                  </slot>
                </td>
              </tr>

              <tr
                v-if="expandable && isExpanded(row[rowAttr])"
                :key="`row-expand-${index}`"
                :class="ui.tr({ rowVariant: 'expandable' })"
                data-id="row-expanded"
              >
                <td
                  :colspan="colspan"
                  :class="[ui.td()]"
                >
                  <!-- eslint-disable-next-line vue/require-explicit-slots -- defined via Partial<Record<...>> in defineSlots -->
                  <slot
                    name="expanded-item"
                    :row="row"
                    :index="index"
                  />
                </td>
              </tr>
            </template>
          </template>
          <tr v-if="loading && noData">
            <td
              :class="ui.tbodyLoader()"
              :colspan="colspan"
              data-id="tbody-loader"
            >
              <div :class="ui.tbodyLoaderContent()">
                <RuiProgress
                  color="primary"
                  variant="indeterminate"
                  circular
                />
              </div>
            </td>
          </tr>
          <tr
            v-if="noData && empty && !loading"
            :class="ui.tr({ rowVariant: 'empty' })"
            data-id="row-empty"
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
                :class="ui.td()"
                :colspan="colspan"
              >
                <!-- eslint-disable-next-line vue/require-explicit-slots -- defined via Partial<Record<...>> in defineSlots -->
                <slot name="no-data">
                  <RuiTableEmptyState
                    :label="empty.label"
                    :description="empty.description"
                  >
                    <!-- eslint-disable-next-line vue/require-explicit-slots -- defined via Partial<Record<...>> in defineSlots -->
                    <template
                      v-if="slots['empty-description']"
                      #description
                    >
                      <slot name="empty-description" />
                    </template>
                  </RuiTableEmptyState>
                </slot>
              </td>
            </Transition>
          </tr>
          <!-- eslint-disable-next-line vue/require-explicit-slots -- defined via Partial<Record<...>> in defineSlots -->
          <slot
            v-if="slots['body.append']"
            :colspan="colspan"
            name="body.append"
          />
        </tbody>
        <tfoot>
          <!-- eslint-disable-next-line vue/require-explicit-slots -- defined via Partial<Record<...>> in defineSlots -->
          <slot name="tfoot" />
        </tfoot>
      </table>
    </div>
    <RuiTablePagination
      v-if="paginationData && !hideDefaultFooter"
      v-model="paginationData"
      :dense="dense"
      :loading="loading"
      :disable-per-page="disablePerPage"
      data-id="table-pagination"
      @update:model-value="onPaginate()"
    />
  </div>
</template>
