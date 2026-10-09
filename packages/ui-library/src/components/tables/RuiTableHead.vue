<script lang="ts" setup generic="T extends object, K extends keyof T = keyof T">
import type { RuiIcons } from '@/icons';
import RuiButton from '@/components/buttons/button/RuiButton.vue';
import RuiCheckbox from '@/components/forms/checkbox/RuiCheckbox.vue';
import RuiIcon from '@/components/icons/RuiIcon.vue';
import RuiProgress from '@/components/progress/RuiProgress.vue';
import { NESTED_BAR } from '@/components/tables/data-table-styles';
import { getAlignClass, getSortButtonAlignClass, SortDirection, TableAlign } from '@/components/tables/table-props';
import { tv } from '@/utils/tv';

/**
 * A sortable column name for `T`, the type of the data in the column: the name
 * must be a key of that object type.
 */
export type TableRowKey<T> = keyof T extends string ? keyof T : never;

export interface BaseTableColumn<T> {
  key: TableRowKey<T> | string;
  sortable?: boolean;
  direction?: SortDirection;
  align?: TableAlign;
  class?: string;
  cellClass?: string;
  tdClass?: string;
  colspan?: string | number;
  rowspan?: string | number;
  /**
   * hide this column when the table is rendered in its stacked mobile layout
   */
  mobileHidden?: boolean;
  /**
   * pin this column to the card header (top row) in the stacked mobile layout
   * instead of rendering it as a label/value pair. Intended for action columns
   * such as an overflow menu. Ignored on non-mobile layouts.
   */
  mobileHeader?: boolean;

  [key: string]: any;
}

/**
 * A sortable table column, which ties `sortable: true` to a key that is a real
 * property of `T`, the type of data in the table.
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
    thead: 'between:border-t between:border-b-0 between:border-rui-divider',
    checkbox: `px-2 w-14.5 max-w-14.5 [&_label]:ml-0 bg-rui-surface-muted ${NESTED_BAR}`,
    // tinted like the pagination bar, framing the body; opaque, so rows scroll behind a stuck header
    th: `[:where(&)]:px-4 bg-rui-surface-muted ${NESTED_BAR}`,
    // labels read as secondary to the data; the sorted column's label steps up to primary
    columnText: 'text-rui-text-secondary font-medium text-[0.8125rem] leading-5',
    // the negative margin cancels the button's own padding so the label lines up with the cells below
    sortButton: 'inline-flex group/sort -mx-1.5',
    // a faint resting icon marks sortable columns for keyboard and touch users
    sortIcon: 'transition opacity-30 group-hover/sort:opacity-60 group-focus-visible/sort:opacity-60',
    // tucked against the arrow, closer than the button's gap
    sortPosition: 'text-[0.6875rem] leading-none font-semibold tabular-nums text-rui-text-secondary',
    /*
     * The row is always there and only its bar comes and goes: a collapsed-border table gives even a
     * zero-height row half a pixel, so adding the row on load pushed the body down.
     */
    loaderRow: 'border-none',
    progress: 'p-0 h-0',
    progressWrapper: 'h-0 -mt-1',
  },
  variants: {
    position: {
      default: {},
      sticky: { thead: 'top-0 z-rui-raised absolute' },
      fixed: {
        thead: 'top-0 z-rui-raised fixed',
        th: 'border-b border-b-rui-divider',
      },
    },
    // a fixed height evens out rows with and without sort buttons; `:where()` lets a column's `class` win
    dense: {
      true: { th: '[:where(&)]:py-0.5 [:where(&)]:h-8' },
      false: { th: '[:where(&)]:py-1 [:where(&)]:h-10' },
    },
  },
  defaultVariants: {
    position: 'default',
    dense: false,
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
  return `opacity-100! ${direction === SortDirection.asc ? 'rotate-180' : 'rotate-0'}`;
}

/**
 * An unsorted column shows a neutral up-down icon, so nothing reads as sorted
 * until it is; the sorted column shows its direction.
 */
function getSortIconName(key: TableColumn<T>['key']): RuiIcons {
  return isSortedBy(key) ? 'lu-arrow-down' : 'lu-arrow-up-down';
}

function getColumnTextClass(key: TableColumn<T>['key']): string {
  return get(ui).columnText({ class: isSortedBy(key) ? 'text-rui-text' : undefined });
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

/**
 * A column's place in a multi-column sort, shown beside its arrow. A lone sorted column shows none,
 * since its arrow already says everything.
 */
function getSortPosition(key: TableColumn<T>['key']): number | undefined {
  if (!Array.isArray(sortData) || sortData.length < 2)
    return undefined;
  const index = getSortIndex(key);
  return index >= 0 ? index + 1 : undefined;
}

function getSortDirection(key: TableColumn<T>['key']): SortDirection | undefined {
  return sortedMap[key]?.direction;
}

function getAriaSort(column: TableColumn<T>): 'ascending' | 'descending' | 'none' | undefined {
  if (!column.sortable)
    return undefined;
  const direction = getSortDirection(column.key);
  if (direction === SortDirection.asc)
    return 'ascending';
  if (direction === SortDirection.desc)
    return 'descending';
  return 'none';
}

/**
 * The name a screen reader hears for a column drawn without a label, since an empty header cell
 * leaves the column unnamed: the built-in expand column is "Details", any other its key.
 *
 * @param column - the column whose label is empty
 * @returns Details or the column key
 */
function getHiddenHeaderText(column: TableColumn<T>): string {
  return column.key === 'expand' ? 'Details' : column.key.toString();
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
          aria-label="Select all rows"
          hide-details
          @update:model-value="onToggleAll($event)"
        />
      </th>

      <th
        v-for="column in columns"
        :key="column.key"
        :class="[
          ui.th({ class: getAlignClass(column.align) }),
          column.class,
          // only labels the table made up from row keys; a label the consumer wrote is shown as written
          { capitalize: capitalizeHeaders },
        ]"
        scope="col"
        :colspan="column.colspan ?? 1"
        :rowspan="column.rowspan ?? 1"
        :aria-sort="getAriaSort(column)"
        :data-id="column.sortable ? 'column-sortable' : undefined"
      >
        <slot
          :column="column"
          :name="`header.${column.key.toString()}`"
        >
          <RuiButton
            v-if="column.sortable"
            :class="ui.sortButton({ class: getSortButtonAlignClass(column.align) })"
            :data-sorted="isSortedBy(column.key) || undefined"
            :data-direction="getSortDirection(column.key)"
            size="sm"
            variant="text"
            @click="onSort(column)"
          >
            <span
              :class="getColumnTextClass(column.key)"
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
              <span
                v-if="getSortPosition(column.key)"
                :class="ui.sortPosition({ class: '-mr-1.5' })"
                data-id="sort-position"
              >
                {{ getSortPosition(column.key) }}
              </span>
              <RuiIcon
                :class="ui.sortIcon({ class: getSortIconClass(column.key) })"
                :name="getSortIconName(column.key)"
                size="18"
              />
            </template>

            <template #append>
              <template v-if="column.align !== TableAlign.end">
                <RuiIcon
                  :class="ui.sortIcon({ class: getSortIconClass(column.key) })"
                  :name="getSortIconName(column.key)"
                  size="18"
                />
                <span
                  v-if="getSortPosition(column.key)"
                  :class="ui.sortPosition({ class: '-ml-1.5' })"
                  data-id="sort-position"
                >
                  {{ getSortPosition(column.key) }}
                </span>
              </template>
            </template>
          </RuiButton>
          <span
            v-else
            :class="ui.columnText()"
            data-id="column-text"
          >
            <slot
              :name="`header.text.${column.key.toString()}`"
              :column="column"
            >
              <template v-if="column[columnAttr]">{{ column[columnAttr] }}</template>
              <span
                v-else
                class="sr-only"
              >
                {{ getHiddenHeaderText(column) }}
              </span>
            </slot>
          </span>
        </slot>
      </th>
    </tr>
    <tr
      :class="ui.loaderRow()"
      :data-id="loading ? 'thead-loader' : undefined"
      :aria-hidden="loading ? undefined : 'true'"
    >
      <!-- a `td`, not a header cell, so it never counts as a column heading -->
      <td
        :class="ui.progress()"
        :colspan="colspan"
      >
        <div
          v-if="loading"
          :class="ui.progressWrapper()"
        >
          <RuiProgress
            color="primary"
            variant="indeterminate"
          />
        </div>
      </td>
    </tr>
  </thead>
</template>
