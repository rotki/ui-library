<script
  lang="ts"
  setup
  generic="T extends object, IdType extends keyof T = keyof T"
>
import { type Ref } from 'vue';
import Button from '@/components/buttons/button/Button.vue';
import Checkbox from '@/components/forms/checkbox/Checkbox.vue';
import Icon from '@/components/icons/Icon.vue';
import Progress from '@/components/progress/Progress.vue';
import RuiBadge from '@/components/overlays/badge/Badge.vue';
import ExpandButton from '@/components/tables/ExpandButton.vue';
import TablePagination, {
  type TablePaginationData,
} from './TablePagination.vue';

/**
 * Represents a sortable column name for a given type.
 * The column name must be a key of the passed data object type.
 * @template T - The type of the data in the column.
 */
export type SortableColumnName<T> = keyof T;

/**
 * Represents the name of a column in a dataset.
 *
 * The `ColumnName` type can either be a `SortableColumnName` or a string.
 *
 * @typeparam T - The type of the dataset containing the column name.
 */
export type ColumnName<T> = SortableColumnName<T> | string;

export interface BaseTableColumn {
  direction?: 'asc' | 'desc';
  align?: 'start' | 'center' | 'end';
  class?: string;
  cellClass?: string;

  [key: string]: any;
}

/**
 * Represents a sortable table column.
 * This is used to ensure that when using sortable with a true value,
 * the key matches to an actual property of the object passed.
 *
 * @template T - The type of data in the table column.
 */
export interface SortableTableColumn<T> extends BaseTableColumn {
  key: SortableColumnName<T>;
  sortable: true;
}

/**
 * An interface representing a column in a table that cannot be sorted.
 * This can be mapped to an actual property of the object or to a virtual column.
 *
 * @typeparam T - The type of data in the table.
 */
export interface NoneSortableTableColumn<T> extends BaseTableColumn {
  key: string | SortableColumnName<T>;
  sortable?: false;
}

export type TableColumn<T> =
  | SortableTableColumn<T>
  | NoneSortableTableColumn<T>;

export interface SortColumn<T> {
  column?: SortableColumnName<T>;
  direction: 'asc' | 'desc';
}

export interface TableOptions<T> {
  pagination?: TablePaginationData;
  sort?: SortColumn<T> | SortColumn<T>[];
}

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
  sort?: SortColumn<T> | SortColumn<T>[];
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
  columnAttr?: string;
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
   * make expansion work like accordion
   */
  stickyHeader?: boolean;
  stickyOffset?: number;
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
  striped: false,
  paginationModifiers: undefined,
  sortModifiers: undefined,
  empty: () => ({ label: 'No item found' }),
  hideDefaultFooter: false,
  rounded: 'md',
  expanded: undefined,
  singleExpand: false,
  stickyHeader: false,
  stickyOffset: 0,
});

const emit = defineEmits<{
  (e: 'update:model-value', value?: T[IdType][]): void;
  (e: 'update:expanded', value: T[]): void;
  (e: 'update:pagination', value: TablePaginationData): void;
  (e: 'update:sort', value?: SortColumn<T> | SortColumn<T>[]): void;
  (e: 'update:options', value: TableOptions<T>): void;
}>();

const css = useCssModule();
const { stickyOffset } = toRefs(props);
const { stick, table, tableScroller } = useStickyTableHeader(stickyOffset);

const getKeys = <T extends object>(t: T) =>
  Object.keys(t) as SortableColumnName<T>[];

/**
 * Prepare the columns from props or generate using first item in the list
 */
const columns = computed<TableColumn<T>[]>(() => {
  const data =
    props.cols ??
    getKeys(props.rows[0] ?? {}).map(
      (key) =>
        ({
          key: key.toString(),
          [props.columnAttr]: key.toString(),
        }) satisfies NoneSortableTableColumn<T>,
    );

  if (get(expandable)) {
    return [
      ...data,
      {
        key: 'expand',
        sortable: false,
      },
    ];
  }

  return data;
});

const selectedData = computed<T[IdType][] | undefined>({
  get() {
    return props.modelValue;
  },
  set(value) {
    emit('update:model-value', value);
  },
});

const rowIdentifier = computed(() => props.rowAttr);

const expandable = computed(() => props.expanded && slots['expanded-item']);

const internalPaginationState: Ref<TablePaginationData | undefined> = ref();

const pagination = computed(() => props.pagination);

watchImmediate(pagination, (pagination) => {
  set(internalPaginationState, pagination);
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
        total: get(searchData).length,
        limit: props.itemsPerPage,
        page: 1,
      };
    }

    return {
      total: get(searchData).length,
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
  const mapped: Partial<Record<SortableColumnName<T>, SortColumn<T>>> = {};
  const sortBy = get(sortData);
  if (!sortBy) {
    return mapped;
  }

  if (!Array.isArray(sortBy)) {
    if (sortBy.column) {
      mapped[sortBy.column] = sortBy;
    }
    return mapped;
  }

  return sortBy.reduce((acc, curr) => {
    if (!curr.column) {
      return acc;
    }

    return { ...acc, [curr.column]: curr };
  }, mapped);
});

/**
 * list if ids of the visible table rows used for check-all and uncheck-all
 */
const visibleIdentifiers = computed(() => {
  const selectBy = props.rowAttr;

  if (!selectBy) {
    return [];
  }

  return get(filtered)?.map((row) => row[selectBy]) ?? [];
});

/**
 * Flag to know when all rows are selected for the current screen
 */
const isAllSelected = computed(() => {
  const selectedRows = get(selectedData);
  if (!selectedRows) {
    return false;
  }

  return (
    selectedRows.length > 0 &&
    get(visibleIdentifiers).every((id) => selectedRows.includes(id))
  );
});

/**
 * rows filtered based on search query if it exists
 */
const searchData = computed(() => {
  const query = props.search?.toLocaleLowerCase();
  if (!query) {
    return props.rows;
  }

  return props.rows.filter((row) =>
    getKeys(row).some((key) =>
      `${row[key]}`.toLocaleLowerCase().includes(query),
    ),
  );
});

/**
 * sort the search results
 */
const sorted = computed(() => {
  const sortBy = get(sortData);
  const data = [...get(searchData)];
  if (!sortBy || props.sortModifiers?.external) {
    return data;
  }

  const sortOptions: Intl.CollatorOptions = {
    numeric: true,
    ignorePunctuation: true,
  };

  const sort = (by: SortColumn<T>) => {
    data.sort((a, b) => {
      const column = by.column;
      if (!column) {
        return 0;
      }
      if (by.direction === 'desc') {
        return `${b[column]}`.localeCompare(
          `${a[column]}`,
          undefined,
          sortOptions,
        );
      }

      return `${a[column]}`.localeCompare(
        `${b[column]}`,
        undefined,
        sortOptions,
      );
    });
  };

  if (!Array.isArray(sortBy)) {
    sort(sortBy);
  } else {
    sortBy.forEach(sort);
  }

  return data;
});

/**
 * comprises search, sorted and paginated data
 */
const filtered = computed(() => {
  const result = get(sorted);

  const paginated = get(paginationData);
  const limit = paginated.limit;
  if (paginated && !props.paginationModifiers?.external) {
    const start = (paginated.page - 1) * limit;
    const end = start + limit;
    return result.slice(start, end);
  }

  return result;
});

const filteredMap = computed(() =>
  get(filtered).map((row) => row[props.rowAttr]),
);

const indeterminate = computed(() => {
  const selectedRows = get(selectedData);
  if (!selectedRows) {
    return false;
  }
  return selectedRows.length > 0 && !get(isAllSelected);
});

const noData = computed(() => get(filtered).length === 0);

const colspan = computed(() => {
  let columnLength = get(columns).length;
  if (get(selectedData)) {
    columnLength++;
  }

  return columnLength;
});

const isSortedBy = (key: ColumnName<T>) => key in get(sortedMap);

const getSortIndex = (key: ColumnName<T>) => {
  const sortBy = get(sortData);

  if (!sortBy || !Array.isArray(sortBy) || !isSortedBy(key)) {
    return -1;
  }

  return sortBy.findIndex((sort) => sort.column === key) ?? -1;
};

const isSelected = (identifier: T[IdType]) => {
  const selection = get(selectedData);
  if (!selection) {
    return false;
  }

  return selection.includes(identifier);
};

const isExpanded = (identifier: T[IdType]) => {
  const { expanded } = props;
  if (!expanded?.length) {
    return false;
  }

  return expanded.some((data) => data[props.rowAttr] === identifier);
};

const onToggleExpand = (row: T) => {
  const { expanded } = props;
  if (!expanded) {
    return;
  }

  const key = props.rowAttr;
  const rowExpanded = isExpanded(row[key]);

  if (props.singleExpand) {
    return emit('update:expanded', rowExpanded ? [] : [row]);
  }

  return emit(
    'update:expanded',
    rowExpanded
      ? expanded.filter((item) => item[key] !== row[key])
      : [...expanded, row],
  );
};

/**
 * Sort to handle single sort or multiple sort columns
 */
const onSort = ({
  key,
  direction,
}: {
  key: SortableColumnName<T>;
  direction?: 'asc' | 'desc';
}) => {
  const sortBy = get(sortData);
  if (!sortBy) {
    return;
  }

  if (!Array.isArray(sortBy)) {
    if (isSortedBy(key)) {
      const newDirection = !direction || direction === 'asc' ? 'desc' : 'asc';

      if (sortBy.direction === newDirection) {
        set(sortData, { ...sortBy, column: undefined, direction: 'asc' });
      } else {
        set(sortData, {
          ...sortBy,
          direction: sortBy.direction === 'asc' ? 'desc' : 'asc',
        });
      }
    } else {
      set(sortData, { column: key, direction: direction || 'asc' });
    }
    return;
  }

  if (isSortedBy(key)) {
    const newDirection = !direction || direction === 'asc' ? 'desc' : 'asc';

    const index = getSortIndex(key);
    const sortByCol = sortBy[index];

    if (sortByCol.direction === newDirection) {
      sortBy.splice(index, 1);
    } else {
      sortByCol.direction = sortByCol.direction === 'asc' ? 'desc' : 'asc';
    }
    set(sortData, sortBy);
  } else {
    set(sortData, [...sortBy, { column: key, direction: direction || 'asc' }]);
  }
};

/**
 * toggles selected rows
 * @param {boolean} checked checkbox state
 */
const onToggleAll = (checked: boolean) => {
  if (checked) {
    set(
      selectedData,
      Array.from(
        new Set([...(get(selectedData) ?? []), ...get(visibleIdentifiers)]),
      ),
    );
  } else {
    set(
      selectedData,
      get(selectedData)?.filter(
        (identifier) => !get(filteredMap).includes(identifier),
      ),
    );
  }
};

/**
 * toggles a single row
 * @param {boolean} checked checkbox state
 * @param {string} value the id of the selected row
 */
const onSelect = (checked: boolean, value: T[typeof props.rowAttr]) => {
  const selectedRows = get(selectedData);
  if (!selectedRows) {
    return false;
  }

  if (checked) {
    set(selectedData, [...selectedRows, value]);
  } else {
    set(
      selectedData,
      [...selectedRows].filter((r) => r !== value),
    );
  }
};

const search = computed(() => props.search);
/**
 * When the search query changes, we reset the current page to 1
 */
watch(search, () => {
  const pagination = get(paginationData);
  if (pagination) {
    pagination.page = 1;
  }
});

const slots = useSlots();
</script>

<template>
  <div
    :class="[
      css.wrapper,
      css[`rounded__${rounded}`],
      { [css.outlined]: outlined },
    ]"
  >
    <div ref="tableScroller" :class="css.scroller">
      <table
        ref="table"
        :class="[css.table, { [css.dense]: dense }]"
        aria-label=""
      >
        <thead
          data-id="head-main"
          :class="[
            css.thead,
            { [css.sticky__header]: stickyHeader, [css.stick__top]: stick },
          ]"
        >
          <tr :class="css.tr">
            <th v-if="selectedData" scope="col" :class="css.checkbox">
              <Checkbox
                :model-value="isAllSelected"
                :indeterminate="indeterminate"
                :disabled="!filtered?.length"
                hide-details
                color="primary"
                data-cy="table-toggle-check-all"
                @update:model-value="onToggleAll($event)"
              />
            </th>

            <th
              v-for="(column, index) in columns"
              :key="index"
              scope="col"
              :class="[
                css.th,
                column.class,
                css[`align__${column.align ?? 'start'}`],
                {
                  capitalize: !cols,
                  [css.sortable]: column.sortable,
                },
              ]"
            >
              <slot :name="`header.${column.key.toString()}`" :column="column">
                <RuiBadge
                  v-if="column.sortable"
                  :model-value="getSortIndex(column.key) >= 0"
                  :text="`${getSortIndex(column.key) + 1}`"
                  color="secondary"
                  size="sm"
                >
                  <Button
                    :class="[
                      css.sort__button,
                      {
                        [css.sort__active]: isSortedBy(column.key),
                        [css[`sort__${sortedMap[column.key]?.direction}`]]:
                          isSortedBy(column.key),
                      },
                    ]"
                    size="sm"
                    variant="text"
                    @click="onSort(column)"
                  >
                    <span :class="css.column__text">
                      {{ column[columnAttr] }}
                    </span>

                    <template v-if="column.align === 'end'" #prepend>
                      <Icon
                        :class="css.sort__icon"
                        name="arrow-down-line"
                        size="18"
                      />
                    </template>

                    <template #append>
                      <Icon
                        v-if="column.align !== 'end'"
                        :class="css.sort__icon"
                        name="arrow-down-line"
                        size="18"
                      />
                    </template>
                  </Button>
                </RuiBadge>
                <span v-else :class="css.column__text">
                  {{ column[columnAttr] }}
                </span>
              </slot>
            </th>
          </tr>
          <tr
            v-if="loading"
            :class="[
              css.thead__loader,
              { [css.thead__loader_linear]: !noData },
            ]"
          >
            <th scope="col" :class="css.progress" :colspan="colspan">
              <div :class="css.progress__wrapper">
                <Progress
                  variant="indeterminate"
                  color="primary"
                  :circular="noData"
                />
              </div>
            </th>
          </tr>
        </thead>
        <thead v-if="stickyHeader" :class="css.thead" data-id="head-clone">
          <tr :class="css.tr">
            <th v-if="selectedData" scope="col" :class="css.checkbox" />

            <th
              v-for="(column, index) in columns"
              :key="index"
              scope="col"
              :class="[
                css.th,
                column.class,
                css[`align__${column.align ?? 'start'}`],
                {
                  capitalize: !cols,
                  [css.sortable]: column.sortable,
                },
              ]"
            />
          </tr>
        </thead>
        <tbody :class="[css.tbody, { [css['tbody--striped']]: striped }]">
          <template v-for="(row, index) in filtered" :key="index">
            <tr
              :class="[
                css.tr,
                { [css.tr__selected]: isSelected(row[rowIdentifier]) },
              ]"
            >
              <td v-if="selectedData" :class="css.checkbox">
                <Checkbox
                  :model-value="isSelected(row[rowIdentifier])"
                  hide-details
                  color="primary"
                  :data-cy="`table-toggle-check-${index}`"
                  @update:model-value="onSelect($event, row[rowIdentifier])"
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
              >
                <slot
                  v-if="column.key.toString() === 'expand'"
                  :name="`item.${column.key.toString()}`"
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
                  :name="`item.${column.key.toString()}`"
                  :column="column"
                  :row="row"
                  :index="index"
                >
                  {{ row[column.key as keyof T] ?? '' }}
                </slot>
              </td>
            </tr>

            <tr
              v-if="expandable"
              :hidden="!isExpanded(row[rowIdentifier])"
              :class="[css.tr, css.tr__expandable]"
            >
              <td :colspan="colspan" :class="[css.td]">
                <slot name="expanded-item" :row="row" :index="index">
                  expansion content placeholder
                </slot>
              </td>
            </tr>
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
              <td :colspan="colspan" :class="css.td">
                <slot name="no-data">
                  <div :class="css.empty">
                    <p v-if="empty.label" :class="css.empty__label">
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
      :loading="loading"
      :dense="dense"
      data-cy="table-pagination"
    />
  </div>
</template>

<style module lang="scss">
.wrapper {
  @apply relative divide-y divide-black/[0.12] overflow-hidden;
  &.outlined {
    @apply rounded-xl border border-black/[0.12];
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

    .thead {
      @apply divide-y divide-black/[0.12];

      &.sticky__header {
        @apply top-0 z-10 absolute;

        &.stick__top {
          @apply fixed;

          tr {
            th {
              @apply bg-white border-b border-b-black/[0.12];
            }
          }
        }
      }

      .tr {
        .th {
          @apply p-4;

          &.align__start {
            @apply text-left rtl:text-right;
          }

          &.align__center {
            @apply text-center;
          }

          &.align__end {
            @apply text-right rtl:text-left;
          }

          &.sortable {
            &.align__start {
              @apply pl-2;
            }

            &.align__center {
              @apply px-1;
            }

            &.align__end {
              @apply pr-2;
            }

            .sort__button {
              @apply inline-flex;

              &:hover .sort__icon {
                @apply opacity-60;
              }

              &.sort {
                &__active {
                  .sort__icon {
                    @apply opacity-100;
                  }
                }

                &__desc {
                  .sort__icon {
                    @apply rotate-0;
                  }
                }

                &__asc {
                  .sort__icon {
                    @apply rotate-180;
                  }
                }
              }
            }

            .sort__icon {
              @apply transition opacity-0 rotate-180;
            }
          }

          .column__text {
            @apply text-rui-text font-medium text-sm leading-6;
          }
        }
      }

      &__loader {
        .progress {
          @apply relative w-full py-8;
        }

        &_linear {
          @apply border-none;

          .progress {
            @apply p-0 h-0;
          }

          .progress__wrapper {
            @apply h-0 -mt-1;
          }
        }
      }
    }

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
              @apply text-body-1 font-bold text-center text-current;
            }

            &__description {
              @apply text-body-2 text-center text-rui-text-secondary;
            }
          }
        }
      }
    }

    .checkbox {
      @apply ps-4 w-14;
    }

    &.dense {
      .thead {
        .tr {
          .th {
            @apply py-[0.38rem];
          }
        }
      }

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
      @apply divide-gray-700;
      .thead {
        @apply divide-y divide-gray-700;

        &.sticky__header.stick__top {
          th {
            @apply bg-[#121212] border-b border-b-gray-700;
          }
        }

        .tr {
          .th {
            @apply text-white;
          }
        }
      }

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
          &__selected {
            @apply bg-rui-dark-primary/[0.08];
          }

          &__expandable {
            @apply bg-[#121212] hover:bg-[#121212];
          }

          .td {
            @apply text-gray-400;
          }
        }
      }
    }
  }
}
</style>
