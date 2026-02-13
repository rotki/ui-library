<script lang="ts" setup generic="T extends object, IdType extends keyof T = keyof T">
import RuiButton from '@/components/buttons/button/RuiButton.vue';
import RuiCheckbox from '@/components/forms/checkbox/RuiCheckbox.vue';
import RuiIcon from '@/components/icons/RuiIcon.vue';
import RuiTooltip from '@/components/overlays/tooltip/RuiTooltip.vue';
import RuiProgress from '@/components/progress/RuiProgress.vue';
import RuiExpandButton from '@/components/tables/RuiExpandButton.vue';
import RuiTableHead, {
  type GroupData,
  type TableColumn,
  type TableRowKeyData,
  type TableSortData,
} from '@/components/tables/RuiTableHead.vue';
import RuiTablePagination, {
  type TablePaginationData,
} from '@/components/tables/RuiTablePagination.vue';
import noDataPlaceholder from '@/components/tables/table_no_data_placeholder.svg';
import noDataPlaceholderDark from '@/components/tables/table_no_data_placeholder_dark.svg';
import { useTable } from '@/composables/defaults/table';
import { useStickyTableHeader } from '@/composables/sticky-header';
import { useTableColumns } from '@/composables/tables/data-table/columns';
import { useTableExpansion } from '@/composables/tables/data-table/expansion';
import { useTableGrouping } from '@/composables/tables/data-table/grouping';
import { useTablePagination } from '@/composables/tables/data-table/pagination';
import { useTableSelection } from '@/composables/tables/data-table/selection';
import { useTableSort } from '@/composables/tables/data-table/sort';
import { type GroupHeader, isRow } from '@/composables/tables/data-table/types';
import { useRotkiTheme } from '@/composables/theme';

export type { GroupedTableRow, GroupHeader, TableOptions } from '@/composables/tables/data-table/types';

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
  disabledRows?: T[];
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

const { isDark } = useRotkiTheme();

const stickyHeaderOffset = computed<number | undefined>(() =>
  stickyOffset !== undefined ? stickyOffset : get(tableDefaults.stickyOffset),
);

const table = useTemplateRef<HTMLTableElement>('table');
const tableScroller = useTemplateRef<HTMLElement>('tableScroller');

const { stick } = useStickyTableHeader(
  toRef(() => stickyHeader),
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
</script>

<template>
  <div
    :class="[$style.wrapper, $style[`rounded__${rounded}`], { [$style.outlined]: outlined }]"
    data-id="table-wrapper"
  >
    <RuiTablePagination
      v-if="paginationData && !hideDefaultHeader"
      v-model="paginationData"
      :dense="dense"
      :loading="loading"
      :disable-per-page="disablePerPage"
      data-cy="table-pagination"
      @update:model-value="onPaginate()"
    />
    <div
      ref="tableScroller"
      :class="$style.scroller"
      data-id="table-scroller"
    >
      <table
        ref="table"
        :class="[$style.table, { [$style.dense]: dense }]"
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
        <tbody :class="[$style.tbody, { [$style['tbody--striped'] ?? '']: striped }]">
          <slot
            v-if="slots['body.prepend']"
            :colspan="colspan"
            name="body.prepend"
          />
          <template v-for="(row, index) in filtered">
            <tr
              v-if="!isRow(row)"
              :key="`row-${index}`"
              :class="[$style.tr, $style.tr__group]"
              data-id="row-group"
            >
              <slot
                name="group.header"
                :colspan="colspan"
                :header="row"
                :is-open="isExpandedGroup(row.group)"
                :toggle="() => onToggleExpandGroup(row.group, row.identifier)"
              >
                <td
                  :class="[$style.td]"
                  class="!p-2"
                  :colspan="colspan"
                >
                  <div class="flex items-center gap-2">
                    <RuiExpandButton
                      v-if="groupExpandButtonPosition === 'start'"
                      :expanded="isExpandedGroup(row.group)"
                      @click="onToggleExpandGroup(row.group, row.identifier)"
                    />
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
                        data-cy="group-copy-button"
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
                  $style.tr,
                  { [$style.tr__selected ?? '']: isSelected(row[rowAttr]) },
                  typeof itemClass === 'string' ? itemClass : itemClass(row),
                ]"
                :aria-selected="selectedData ? isSelected(row[rowAttr]) : undefined"
                data-id="row"
              >
                <td
                  v-if="selectedData"
                  :class="$style.checkbox"
                  colspan="1"
                  rowspan="1"
                >
                  <RuiCheckbox
                    :data-cy="`table-toggle-check-${index}`"
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
                    $style.td,
                    column.cellClass,
                    $style[`align__${column.align ?? 'start'}`],
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
                :class="[$style.tr, $style.tr__expandable]"
                data-id="row-expanded"
              >
                <td
                  :colspan="colspan"
                  :class="[$style.td]"
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
          <tr v-if="loading && noData">
            <td
              :class="$style.tbody__loader"
              :colspan="colspan"
              data-id="tbody-loader"
            >
              <RuiProgress
                color="primary"
                variant="indeterminate"
                circular
              />
            </td>
          </tr>
          <tr
            v-if="noData && empty && !loading"
            :class="[$style.tr, $style.tr__empty]"
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
                :class="$style.td"
                :colspan="colspan"
              >
                <slot name="no-data">
                  <div :class="$style.empty">
                    <img
                      :src="isDark ? noDataPlaceholderDark : noDataPlaceholder"
                      :alt="empty.label"
                      class="h-32"
                    />
                    <p
                      v-if="empty.label"
                      :class="$style.empty__label"
                      data-id="empty-label"
                    >
                      {{ empty.label }}
                    </p>

                    <slot name="empty-description">
                      <p
                        v-if="empty.description"
                        :class="$style.empty__description"
                        data-id="empty-description"
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
            v-if="slots['body.append']"
            :colspan="colspan"
            name="body.append"
          />
        </tbody>
        <tfoot>
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
  }
  &.rounded__md {
    @apply rounded-[.75rem];
  }
  &.rounded__lg {
    @apply rounded-[1rem];
  }

  .scroller {
    @apply overflow-x-auto overflow-y-hidden;
    clip-path: inset(0 0 0 0);
  }

  .table {
    @apply min-w-full table-fixed divide-y divide-black/[0.12] whitespace-nowrap mx-auto my-0 max-w-fit relative border-black/[0.12];

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
            @apply flex flex-col gap-3 items-center justify-center flex-1 min-h-56 my-4;

            &__label {
              @apply text-body-1 leading-none font-bold text-center text-current pb-0 mb-0;
            }

            &__description {
              @apply text-body-2 text-center text-rui-text-secondary pb-0 mb-0;
            }
          }
        }
      }

      &__loader {
        @apply py-8 text-center min-h-56;
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
      @apply divide-white/[0.12] border-white/[0.12];

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
