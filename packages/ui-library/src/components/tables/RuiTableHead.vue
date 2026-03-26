<script lang="ts" setup generic="T extends object, K extends keyof T = keyof T">
import RuiButton from '@/components/buttons/button/RuiButton.vue';
import RuiCheckbox from '@/components/forms/checkbox/RuiCheckbox.vue';
import RuiIcon from '@/components/icons/RuiIcon.vue';
import RuiBadge from '@/components/overlays/badge/RuiBadge.vue';
import RuiProgress from '@/components/progress/RuiProgress.vue';
import { getAlignClass, getSortButtonAlignClass, SortDirection, TableAlign } from '@/components/tables/table-props';
import { tv } from '@/utils/tv';

/**
 * Represents a sortable column name for a given type.
 * The column name must be a key of the passed data object type.
 * @template T - The type of the data in the column.
 */
export type TableRowKey<T> = keyof T extends string ? keyof T : never;

export interface BaseTableColumn<T> {
  key: TableRowKey<T> | string;
  sortable?: boolean;
  direction?: SortDirection;
  align?: TableAlign;
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

export type TableColumn<T> = SortableTableColumn<T> | NoneSortableTableColumn<T>;

export interface SortColumn<T> {
  column?: TableRowKey<T>;
  direction: SortDirection;
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

const {
  loading = false,
  stickyHeader = false,
  stick = false,
  selectable = false,
  disableCheckAll = false,
  colspan = 0,
  columns,
  capitalizeHeaders = false,
  isAllSelected = false,
  indeterminate = false,
  dense = false,
  sortedMap = {} as Partial<Record<TableRowKey<T>, SortColumn<T>>>,
  columnAttr = 'label',
  sortData,
  dataId = 'head-main',
} = defineProps<Props<T>>();

const emit = defineEmits<{
  'select:all': [value: boolean];
  'sort': [value: { key: TableRowKey<T>; direction?: SortDirection }];
}>();

const tableHeadStyles = tv({
  slots: {
    thead: 'divide-y divide-black/[0.12] dark:divide-white/[0.12]',
    checkbox: 'px-2 w-[3.625rem] max-w-[3.625rem] [&_label]:ml-0',
    th: 'p-4',
    columnText: 'text-rui-text dark:text-white font-medium text-sm leading-6',
    sortButton: 'inline-flex group/sort',
    sortIcon: 'transition opacity-0 rotate-180 group-hover/sort:opacity-60',
    loaderRow: 'border-none',
    progress: 'p-0 h-0',
    progressWrapper: 'h-0 -mt-1',
  },
  variants: {
    position: {
      default: {},
      sticky: { thead: 'top-0 z-10 absolute' },
      fixed: {
        thead: 'top-0 z-10 fixed',
        th: 'bg-white dark:bg-[#121212] border-b border-b-black/[0.12] dark:border-b-white/[0.12]',
      },
    },
    dense: {
      true: { th: 'py-[0.38rem]' },
    },
  },
  defaultVariants: {
    position: 'default',
  },
});

const headerPosition = computed<'default' | 'sticky' | 'fixed'>(() => {
  if (stickyHeader && stick)
    return 'fixed';
  if (stickyHeader)
    return 'sticky';
  return 'default';
});

const ui = computed<ReturnType<typeof tableHeadStyles>>(() => tableHeadStyles({
  position: get(headerPosition),
  dense,
}));

function getSortIconClass(key: TableColumn<T>['key']): string | undefined {
  if (!isSortedBy(key))
    return undefined;
  const direction = getSortDirection(key);
  return `!opacity-100 ${direction === SortDirection.asc ? '!rotate-180' : '!rotate-0'}`;
}

function onSort({ key, direction }: TableColumn<T>): void {
  return emit('sort', {
    key: key as TableRowKey<T>,
    direction: direction ?? SortDirection.asc,
  });
}

function onToggleAll(checked: boolean) {
  return emit('select:all', checked);
}

function isSortedBy(key: TableColumn<T>['key']): boolean {
  return key in sortedMap;
}

function getSortIndex(key: TableColumn<T>['key']): number {
  if (!sortData || !Array.isArray(sortData) || !isSortedBy(key))
    return -1;

  return sortData.findIndex(sort => sort.column === key);
}

function getSortDirection(key: TableColumn<T>['key']): SortDirection | undefined {
  return sortedMap[key]?.direction;
}
</script>

<template>
  <thead
    :data-id="dataId"
    :class="ui.thead()"
  >
    <tr>
      <th
        v-if="selectable"
        :class="ui.checkbox()"
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
          data-id="table-toggle-check-all"
          hide-details
          @update:model-value="onToggleAll($event)"
        />
      </th>

      <th
        v-for="column in columns"
        :key="column.key"
        :class="[
          ui.th({ class: getAlignClass(column.align, column.sortable) }),
          column.class,
          { capitalize: !capitalizeHeaders },
        ]"
        scope="col"
        :colspan="column.colspan ?? 1"
        :rowspan="column.rowspan ?? 1"
        :data-id="column.sortable ? 'column-sortable' : undefined"
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
              :class="ui.sortButton({ class: getSortButtonAlignClass(column.align) })"
              :data-sorted="isSortedBy(column.key) || undefined"
              :data-direction="getSortDirection(column.key)"
              size="sm"
              variant="text"
              @click="onSort(column)"
            >
              <span
                :class="ui.columnText()"
                data-id="column-text"
              >
                <slot
                  :name="`header.text.${column.key.toString()}`"
                  :column="column"
                >
                  {{ column[columnAttr] }}
                </slot>
              </span>

              <template
                v-if="column.align === TableAlign.end"
                #prepend
              >
                <RuiIcon
                  :class="ui.sortIcon({ class: getSortIconClass(column.key) })"
                  name="lu-arrow-down"
                  size="18"
                />
              </template>

              <template #append>
                <RuiIcon
                  v-if="column.align !== TableAlign.end"
                  :class="ui.sortIcon({ class: getSortIconClass(column.key) })"
                  name="lu-arrow-down"
                  size="18"
                />
              </template>
            </RuiButton>
          </RuiBadge>
          <span
            v-else
            :class="ui.columnText()"
            data-id="column-text"
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
      :class="ui.loaderRow()"
      data-id="thead-loader"
    >
      <th
        :class="ui.progress()"
        :colspan="colspan"
        scope="col"
      >
        <div :class="ui.progressWrapper()">
          <RuiProgress
            color="primary"
            variant="indeterminate"
          />
        </div>
      </th>
    </tr>
  </thead>
</template>
