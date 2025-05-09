<script lang="ts" setup generic="T extends object, K extends keyof T = keyof T">
import RuiButton from '@/components/buttons/button/RuiButton.vue';
import RuiCheckbox from '@/components/forms/checkbox/RuiCheckbox.vue';
import RuiIcon from '@/components/icons/RuiIcon.vue';
import RuiBadge from '@/components/overlays/badge/RuiBadge.vue';
import RuiProgress from '@/components/progress/RuiProgress.vue';

/**
 * Represents a sortable column name for a given type.
 * The column name must be a key of the passed data object type.
 * @template T - The type of the data in the column.
 */
export type TableRowKey<T> = keyof T extends string ? keyof T : never;

export interface BaseTableColumn<T> {
  key: TableRowKey<T> | string;
  sortable?: boolean;
  direction?: 'asc' | 'desc';
  align?: 'start' | 'center' | 'end';
  class?: string;
  cellClass?: string;
  colspan?: string | number;
  rowspan?: string | number;

  [key: string]: any;
}

/**
 * Represents a sortable table column.
 * This is used to ensure that when using sortable with a true value,
 * the key matches to an actual property of the object passed.
 *
 * @template T - The type of data in the table column.
 */
export interface SortableTableColumn<T> extends BaseTableColumn<T> {
  sortable: true;
}

/**
 * An interface representing a column in a table that cannot be sorted.
 * This can be mapped to an actual property of the object or to a virtual column.
 *
 * @typeparam T - The type of data in the table.
 */
export interface NoneSortableTableColumn<T> extends BaseTableColumn<T> {
  sortable?: false;
}

export type TableColumn<T> =
  | SortableTableColumn<T>
  | NoneSortableTableColumn<T>;

export interface SortColumn<T> {
  column?: TableRowKey<T>;
  direction: 'asc' | 'desc';
}

export type TableSortData<T> = SortColumn<T> | SortColumn<T>[] | undefined;

export type TableRowKeyData<T> = TableRowKey<T> | TableRowKey<T>[] | undefined;

export interface GroupData<T> {
  key: string;
  value?: Partial<T>;
}

export type GroupKey<T> = TableColumn<T>['key'];

export type GroupKeys<T> = GroupKey<T> | GroupKey<T>[] | undefined;

export interface Props<T> {
  loading?: boolean;
  stickyHeader?: boolean;
  stick?: boolean;
  selectable?: boolean;
  disableCheckAll?: boolean;
  noData?: boolean;
  colspan?: number;
  columns?: TableColumn<T>[];
  capitalizeHeaders?: boolean;
  isAllSelected?: boolean;
  indeterminate?: boolean;
  dense?: boolean;
  sortedMap?: Partial<Record<TableRowKey<T>, SortColumn<T>>>;
  sortData?: TableSortData<T>;
  columnAttr?: keyof TableColumn<T>;
  dataId?: string;
}

const props = withDefaults(defineProps<Props<T>>(), {
  loading: false,
  stickyHeader: false,
  stick: false,
  selectable: false,
  disableCheckAll: false,
  noData: false,
  colspan: 0,
  columns: undefined,
  capitalizeHeaders: false,
  isAllSelected: false,
  indeterminate: false,
  dense: false,
  sortedMap: () => ({}),
  columnAttr: 'label',
  sortData: undefined,
  dataId: 'head-main',
});

const emit = defineEmits<{
  (e: 'select:all', value: boolean): void;
  (
    e: 'sort',
    value: {
      key: TableRowKey<T>;
      direction?: 'asc' | 'desc';
    },
  ): void;
}>();

function onSort({ key, direction }: TableColumn<T>) {
  return emit('sort', {
    key: key as TableRowKey<T>,
    direction: direction ?? 'asc',
  });
}

const onToggleAll = (checked: boolean) => emit('select:all', checked);

const isSortedBy = (key: TableColumn<T>['key']) => key in props.sortedMap;

function getSortIndex(key: TableColumn<T>['key']): number {
  const sortBy = props.sortData;

  if (!sortBy || !Array.isArray(sortBy) || !isSortedBy(key))
    return -1;

  return sortBy.findIndex(sort => sort.column === key);
}

function getSortDirection(key: TableColumn<T>['key']) {
  return props.sortedMap[key]?.direction;
}
</script>

<template>
  <thead
    :data-id="dataId"
    :class="[
      $style.thead,
      {
        [$style.sticky__header]: stickyHeader,
        [$style.stick__top]: stick,
        [$style.dense]: dense,
      },
    ]"
  >
    <tr :class="$style.tr">
      <th
        v-if="selectable"
        :class="$style.checkbox"
        scope="col"
        colspan="1"
        rowspan="1"
      >
        <RuiCheckbox
          :disabled="disableCheckAll"
          :indeterminate="indeterminate"
          :model-value="isAllSelected"
          :size="dense ? 'sm' : undefined"
          color="primary"
          data-cy="table-toggle-check-all"
          hide-details
          @update:model-value="onToggleAll($event)"
        />
      </th>

      <th
        v-for="(column, index) in columns"
        :key="index"
        :class="[
          $style.th,
          column.class,
          $style[`align__${column.align ?? 'start'}`],
          {
            capitalize: !capitalizeHeaders,
            [$style.sortable]: column.sortable,
          },
        ]"
        scope="col"
        :colspan="column.colspan ?? 1"
        :rowspan="column.rowspan ?? 1"
      >
        <slot
          :column="column"
          :name="`header.${column.key.toString()}`"
        >
          <RuiBadge
            v-if="column.sortable"
            :model-value="getSortIndex(column.key) >= 0"
            :text="`${getSortIndex(column.key) + 1}`"
            :offset-y="dense ? 8 : 0"
            color="secondary"
            size="sm"
          >
            <RuiButton
              :class="[
                $style.sort__button,
                {
                  [$style.sort__active]: isSortedBy(column.key),
                  [$style[`sort__${getSortDirection(column.key)}`]]: isSortedBy(
                    column.key,
                  ),
                },
              ]"
              size="sm"
              variant="text"
              @click="onSort(column)"
            >
              <span :class="$style.column__text">
                <slot
                  :name="`header.text.${column.key.toString()}`"
                  :column="column"
                >
                  {{ column[columnAttr] }}
                </slot>
              </span>

              <template
                v-if="column.align === 'end'"
                #prepend
              >
                <RuiIcon
                  :class="$style.sort__icon"
                  name="lu-arrow-down"
                  size="18"
                />
              </template>

              <template #append>
                <RuiIcon
                  v-if="column.align !== 'end'"
                  :class="$style.sort__icon"
                  name="lu-arrow-down"
                  size="18"
                />
              </template>
            </RuiButton>
          </RuiBadge>
          <span
            v-else
            :class="$style.column__text"
          >
            <slot
              :name="`header.text.${column.key.toString()}`"
              :column="column"
            >
              {{ column[columnAttr] }}
            </slot>
          </span>
        </slot>
      </th>
    </tr>
    <tr
      v-if="loading"
      :class="[$style.thead__loader, $style.thead__loader_linear]"
    >
      <th
        :class="$style.progress"
        :colspan="colspan"
        scope="col"
      >
        <div :class="$style.progress__wrapper">
          <RuiProgress
            color="primary"
            variant="indeterminate"
          />
        </div>
      </th>
    </tr>
  </thead>
</template>

<style module lang="scss">
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

  &.dense {
    .tr {
      .th {
        @apply py-[0.38rem];
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
          @apply pl-3;
        }

        &.align__center {
          @apply px-3;
          .sort__button {
            @apply ml-6;
          }
        }

        &.align__end {
          @apply pr-3;
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

    .checkbox {
      @apply px-2 w-[3.625rem] max-w-[3.625rem];
      label {
        @apply ml-0;
      }
    }
  }

  &__loader {
    .progress {
      @apply relative py-8;
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

:global(.dark) {
  .thead {
    @apply divide-y divide-white/[0.12];

    &.sticky__header.stick__top {
      th {
        @apply bg-[#121212] border-b border-b-white/[0.12];
      }
    }

    .tr {
      .th {
        @apply text-white;
      }
    }
  }
}
</style>
