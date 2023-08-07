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
  align?: 'left' | 'right';
  class?: string;
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
  rows: Array<Record<string, any>>;
  modelValue?: string[];
  search?: string;
  rowAttr?: string;
  pagination?: TablePaginationData;
  sort?: SortColumn | SortColumn[];
  cols?: Array<TableColumn>;
  columnAttr?: string;
  dense?: boolean;
  outlined?: boolean;
  loading?: boolean;
}

defineOptions({
  name: 'RuiDataTable',
  inheritAttrs: false,
});

const props = withDefaults(defineProps<Props>(), {
  modelValue: undefined,
  rowAttr: '',
  search: '',
  cols: undefined,
  pagination: undefined,
  columnAttr: 'label',
  sort: undefined,
  loading: false,
});

const emit = defineEmits<{
  'update:model-value': [value?: string[]];
  'update:pagination': [value?: TablePaginationData];
  'update:sort': [value?: SortColumn | SortColumn[]];
  'update:options': [value?: TableOptions];
}>();

const {
  cols,
  rows,
  modelValue,
  columnAttr,
  rowAttr,
  pagination,
  search,
  sort,
} = toRefs(props);

const css = useCssModule();

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

const paginationData = computed({
  get() {
    return get(pagination);
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

const visibleIdentifiers = computed(() => {
  const selectBy = get(rowAttr);

  if (!selectBy) {
    return [];
  }

  return get(filtered)?.map((row) => row[selectBy]) ?? [];
});

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

const sorted = computed(() => {
  const sortBy = get(sortData);
  const data = [...get(rows)];
  if (!sortBy) {
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

const filtered = computed(() => {
  const query = get(search)?.toLocaleLowerCase();
  let result = [];
  if (!query) {
    result = get(sorted);
  } else {
    result = get(sorted).filter((row) =>
      Object.keys(row).some((key) =>
        `${row[key]}`.toLocaleLowerCase().includes(query),
      ),
    );
  }

  const paginated = get(pagination);
  if (paginated) {
    const start = (paginated.page - 1) * paginated.limit;
    const end = start + paginated.limit;
    return result.slice(start, end);
  }

  return result;
});

const indeterminate = computed(() => {
  const selectedRows = get(selectedData);
  if (!selectedRows) {
    return false;
  }
  return selectedRows.length > 0 && !get(isAllSelected);
});

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

const onToggleAll = (checked: boolean) => {
  if (checked) {
    set(
      selectedData,
      Array.from(
        new Set([...(get(selectedData) ?? []), ...get(visibleIdentifiers)]),
      ),
    );
  } else {
    set(selectedData, []);
  }
};

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
</script>

<template>
  <div :class="[css.wrapper, { [css.outlined]: outlined }]">
    <div :class="css.scroller">
      <table :class="[css.base, { [css.dense]: dense }]">
        <thead :class="css.thead">
          <tr :class="css.tr">
            <th v-if="selectedData" scope="col" :class="css.checkbox">
              <Checkbox
                :model-value="isAllSelected"
                :indeterminate="indeterminate"
                :disabled="!filtered?.length"
                hide-details
                color="primary"
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
                column.align === 'right' ? css.align__right : css.align__left,
                {
                  capitalize: !cols,
                  [css.sortable]: column.sortable,
                },
              ]"
            >
              <slot :name="`${column.key}-header`" :column="column">
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

                  <template v-if="column.align === 'right'" #prepend>
                    <Icon
                      :class="css.sort__icon"
                      name="arrow-down-line"
                      size="18"
                    />
                  </template>

                  <template
                    v-if="!column.align || column.align === 'left'"
                    #append
                  >
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
          <tr v-if="loading" :class="css.thead__loader">
            <th
              scope="col"
              :class="css.progress"
              :colspan="columns.length + (selectedData ? 1 : 0)"
            >
              <div class="h-0">
                <Progress variant="indeterminate" color="primary" />
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
                @update:model-value="onSelect($event, row[rowAttr])"
              />
            </td>

            <td
              v-for="(column, subIndex) in columns"
              :key="subIndex"
              :class="[
                css.td,
                column.align === 'right' ? css.align__right : css.align__left,
              ]"
            >
              <slot
                :name="`${column.key}-data`"
                :column="column"
                :row="row"
                :index="index"
              >
                {{ row[column.key] }}
              </slot>
            </td>
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
    />
  </div>
</template>

<style module lang="scss">
.wrapper {
  @apply relative divide-y divide-black/[0.12];
  &.outlined {
    @apply rounded-xl border border-black/[0.12];
  }

  .scroller {
    @apply overflow-x-auto overflow-y-hidden;
  }

  .base {
    @apply min-w-full table-fixed divide-y divide-black/[0.12] whitespace-nowrap mx-auto my-0;
    max-width: fit-content;

    .thead {
      .tr {
        .th {
          @apply p-4;

          &.align__left {
            @apply text-left rtl:text-right;
          }

          &.align__right {
            @apply text-right rtl:text-left;
          }

          &.sortable {
            &.align__left {
              @apply pl-2;
            }

            &.align__right {
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
        @apply border-none;

        .progress {
          @apply p-0 relative w-full h-0;
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
      }

      .td {
        @apply whitespace-nowrap p-4 text-rui-text text-body-2;

        &.align__left {
          @apply text-left rtl:text-right;
        }

        &.align__right {
          @apply text-right rtl:text-left;
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

    .base {
      @apply divide-gray-700;
      .thead {
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
