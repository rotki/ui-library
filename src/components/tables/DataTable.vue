<script lang="ts" setup>
import Button from '@/components/buttons/button/Button.vue';
import Checkbox from '@/components/forms/checkbox/Checkbox.vue';
import Chip from '@/components/chips/Chip.vue';
import Icon from '@/components/icons/Icon.vue';
import Progress from '@/components/progress/Progress.vue';
import TablePagination, {
  type TablePaginationData,
} from './TablePagination.vue';

export interface TableColumn {
  key: string;
  sortable?: boolean;
  direction?: 'asc' | 'desc';
  align?: 'start' | 'center' | 'end';
  class?: string;
  cellClass?: string;
  [key: string]: any;
}

export interface SortColumn {
  column?: string;
  direction: 'asc' | 'desc';
}

export interface TableOptions {
  pagination?: TablePaginationData;
  sort?: SortColumn | SortColumn[];
}

export interface Props {
  /**
   * list of items for each row
   */
  rows: Array<Record<string, any>>;
  /**
   * the attribute used to identify each row uniquely for selection, usually `id`
   */
  rowAttr: string;
  /**
   * model for selected rows, add a v-model to support row selection
   */
  modelValue?: string[];
  /**
   * model for insternal searching
   */
  search?: string;
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
  paginationModifiers?: { external: boolean };
  /**
   * model for sort column/columns data
   * single column sort
   * @example v-model:sort="{ column: 'name', direction: 'asc' }"
   * multi columns sort
   * @example v-model:sort="[{ column: 'name', direction: 'asc' }]"
   */
  sort?: SortColumn | SortColumn[];
  /**
   * modifiers for specifying externally sorted tables
   * use this when api controls sorting
   * single column sort
   * @example v-model:sort.external="{ column: 'name', direction: 'asc' }"
   * multi columns sort
   * @example v-model:sort.external="[{ column: 'name', direction: 'asc' }]"
   */
  sortModifiers?: { external: boolean };
  /**
   * list of column definitions
   */
  cols?: Array<TableColumn>;
  /**
   * attribute to use from column definitions to display column titles
   */
  columnAttr?: string;
  /**
   * flag to show a more or less spaceous table
   */
  dense?: boolean;
  /**
   * flag to outline the flag with a border
   */
  outlined?: boolean;
  /**
   * flag to show loading state of the table
   * triggers an indefinite progress at the bottom of the table header
   */
  loading?: boolean;
  /**
   * data to display for empty state
   * text and icon
   * @example :empty="{ icon: 'transactions-line', label: 'No transactions found' }"
   */
  empty?: { label?: string; description?: string };
}

defineOptions({
  name: 'RuiDataTable',
});

const props = withDefaults(defineProps<Props>(), {
  modelValue: undefined,
  search: '',
  cols: undefined,
  pagination: undefined,
  columnAttr: 'label',
  sort: undefined,
  loading: false,
  paginationModifiers: undefined,
  sortModifiers: undefined,
  empty: () => ({ label: 'No item found' }),
});

const emit = defineEmits<{
  (e: 'update:model-value', value?: string[]): void;
  (e: 'update:pagination', value?: TablePaginationData): void;
  (e: 'update:sort', value?: SortColumn | SortColumn[]): void;
  (e: 'update:options', value?: TableOptions): void;
}>();

const {
  cols,
  rows,
  modelValue,
  columnAttr,
  rowAttr,
  pagination,
  paginationModifiers,
  search,
  sort,
  loading,
  sortModifiers,
} = toRefs(props);

const css = useCssModule();

/**
 * Prepare the columns from props or generate using first item in the list
 */
const columns = computed(
  () =>
    get(cols) ??
    Object.keys(get(rows)[0] ?? {}).map((key) => ({
      key,
      [get(columnAttr)]: key,
      sortable: false,
      class: '',
    })),
);

const selectedData = computed({
  get() {
    return get(modelValue);
  },
  set(value) {
    emit('update:model-value', value);
  },
});

/**
 * Pagination is different for search
 * since search is only used for internal filtering
 * we return the length of search results as total
 */
const paginationData = computed({
  get() {
    const paginated = get(pagination);
    if (!paginated || !get(search)) {
      return paginated;
    }

    return {
      total: get(searchData).length,
      limit: paginated.limit,
      page: paginated.page,
      limits: paginated.limits,
    };
  },
  set(value) {
    emit('update:pagination', value);
    emit('update:options', {
      pagination: value,
      sort: get(sort),
    });
  },
});

const sortData = computed({
  get() {
    return get(sort);
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
  const mapped: Record<string, SortColumn> = {};
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
  const selectBy = get(rowAttr);

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
  const query = get(search)?.toLocaleLowerCase();
  if (!query) {
    return get(rows);
  }

  return get(rows).filter((row) =>
    Object.keys(row).some((key) =>
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
  if (!sortBy || get(sortModifiers)?.external) {
    return data;
  }

  const sortOptions: Intl.CollatorOptions = {
    numeric: true,
    ignorePunctuation: true,
  };

  const sort = (by: SortColumn) => {
    data.sort((a, b) => {
      if (!by.column) {
        return 0;
      }
      if (by.direction === 'desc') {
        return `${b[by.column]}`.localeCompare(
          `${a[by.column]}`,
          undefined,
          sortOptions,
        );
      }

      return `${a[by.column]}`.localeCompare(
        `${b[by.column]}`,
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
 * comprises of search, sorted and paginated data
 */
const filtered = computed(() => {
  const result = get(sorted);

  const paginated = get(pagination);
  if (paginated && !get(paginationModifiers)?.external) {
    const start = (paginated.page - 1) * paginated.limit;
    const end = start + paginated.limit;
    return result.slice(start, end);
  }

  return result;
});

const filteredMap = computed(() =>
  get(filtered).map((row) => row[get(rowAttr)]),
);

const indeterminate = computed(() => {
  const selectedRows = get(selectedData);
  if (!selectedRows) {
    return false;
  }
  return selectedRows.length > 0 && !get(isAllSelected);
});

const noData = computed(() => get(filtered).length === 0);

const isSortedBy = (key: string) => key in get(sortedMap);

const getSortIndex = (key: string) => {
  const sortBy = get(sortData);

  if (!sortBy || !Array.isArray(sortBy) || !isSortedBy(key)) {
    return -1;
  }

  return sortBy.findIndex((sort) => sort.column === key) ?? -1;
};

const isSelected = (identifier: string) => {
  const selection = get(selectedData);
  if (!selection) {
    return false;
  }

  return selection.includes(identifier);
};

/**
 * Sort to handle single sort or multiple sort columns
 */
const onSort = ({
  key,
  direction,
}: {
  key: string;
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
const onSelect = (checked: boolean, value: string) => {
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

/**
 * on changing search query, need to reset pagination page to 1
 */
watch(search, () => {
  const pagination = get(paginationData);
  if (pagination) {
    pagination.page = 1;
  }
});
</script>

<template>
  <div :class="[css.wrapper, { [css.outlined]: outlined }]">
    <div :class="css.scroller">
      <table :class="[css.table, { [css.dense]: dense }]">
        <thead :class="css.thead">
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
              <slot :name="`header.${column.key}`" :column="column">
                <Button
                  v-if="column.sortable"
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

                  <template v-if="column.align !== 'end'" #append>
                    <Icon
                      :class="css.sort__icon"
                      name="arrow-down-line"
                      size="18"
                    />
                    <Chip
                      v-if="getSortIndex(column.key) >= 0"
                      :label="`${getSortIndex(column.key) + 1}`"
                      size="sm"
                      color="grey"
                    />
                  </template>

                  <template v-else-if="getSortIndex(column.key) >= 0" #append>
                    <Chip
                      :label="`${getSortIndex(column.key) + 1}`"
                      size="sm"
                      color="grey"
                    />
                  </template>
                </Button>
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
            <th
              scope="col"
              :class="css.progress"
              :colspan="columns.length + (selectedData ? 1 : 0)"
            >
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
        <tbody :class="css.tbody">
          <tr
            v-for="(row, index) in filtered"
            :key="index"
            :class="[css.tr, { [css.tr__selected]: isSelected(row[rowAttr]) }]"
          >
            <td v-if="selectedData" :class="css.checkbox">
              <Checkbox
                :model-value="isSelected(row[rowAttr])"
                hide-details
                color="primary"
                :data-cy="`table-toggle-check-${index}`"
                @update:model-value="onSelect($event, row[rowAttr])"
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
                :name="`item.${column.key}`"
                :column="column"
                :row="row"
                :index="index"
              >
                {{ row[column.key] }}
              </slot>
            </td>
          </tr>
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
                :colspan="columns.length + (selectedData ? 1 : 0)"
                :class="css.td"
              >
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
        </tbody>
        <tfoot>
          <slot name="tfoot" />
        </tfoot>
      </table>
    </div>
    <TablePagination
      v-if="paginationData"
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

  .scroller {
    @apply overflow-x-auto overflow-y-hidden;
  }

  .table {
    @apply min-w-full table-fixed divide-y divide-black/[0.12] whitespace-nowrap mx-auto my-0;
    max-width: fit-content;

    .thead {
      @apply divide-y divide-black/[0.12];
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
      .tr {
        @apply hover:bg-black/[0.04];

        &__selected {
          @apply bg-rui-primary/[0.08];
        }

        &__empty {
          @apply hover:bg-transparent;
        }
      }

      .td {
        @apply whitespace-nowrap p-4 text-rui-text text-body-2;

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
      @apply rounded-xl border border-white/[0.12];
    }

    .table {
      @apply divide-gray-700;
      .thead {
        @apply divide-y divide-gray-700;
        .tr {
          .th {
            @apply text-white;
          }
        }
      }

      .tbody {
        @apply divide-white/[0.12];
        .tr {
          &__selected {
            @apply bg-rui-dark-primary/[0.08];
          }
        }

        .td {
          @apply text-gray-400;
        }
      }
    }
  }
}
</style>
