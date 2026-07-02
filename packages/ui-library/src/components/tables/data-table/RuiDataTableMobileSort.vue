<script lang="ts" setup generic="T extends object">
import type { SortColumn, TableColumn, TableRowKey } from '@/components/tables/RuiTableHead.vue';
import RuiButton from '@/components/buttons/button/RuiButton.vue';
import RuiIcon from '@/components/icons/RuiIcon.vue';
import RuiMenu from '@/components/overlays/menu/RuiMenu.vue';
import { SortDirection } from '@/components/tables/table-props';

const {
  columns,
  columnAttr = 'label',
  sortedMap,
  dense = false,
} = defineProps<{
  columns: TableColumn<T>[];
  columnAttr?: keyof TableColumn<T>;
  sortedMap: Partial<Record<TableRowKey<T>, SortColumn<T>>>;
  dense?: boolean;
}>();

const emit = defineEmits<{
  sort: [value: { key: TableRowKey<T>; direction?: SortDirection }];
}>();

const sortableColumns = computed<TableColumn<T>[]>(() => columns.filter(column => column.sortable));

function columnLabel(column: TableColumn<T>): string {
  const label = column[columnAttr];
  return label === undefined || label === null ? String(column.key) : String(label);
}

function sortDirection(key: TableColumn<T>['key']): SortDirection | undefined {
  return sortedMap[key as TableRowKey<T>]?.direction;
}

function isActive(key: TableColumn<T>['key']): boolean {
  return (key as TableRowKey<T>) in sortedMap;
}

const activeLabel = computed<string>(() => {
  const active = get(sortableColumns).filter(column => isActive(column.key));
  if (active.length === 0)
    return 'Sort';
  if (active.length === 1)
    return columnLabel(active[0]!);
  return `${active.length} sorts`;
});

// Mirror RuiTableHead: emit the column's configured default direction so the
// sort composable performs the same asc → desc → none cycle on repeat taps.
function onSelect(column: TableColumn<T>): void {
  emit('sort', {
    key: column.key as TableRowKey<T>,
    direction: (column.direction as SortDirection | undefined) ?? SortDirection.asc,
  });
}
</script>

<template>
  <RuiMenu
    :dense="dense"
    :options="{ placement: 'bottom-end' }"
    data-id="table-mobile-sort"
  >
    <template #activator="{ attrs }">
      <RuiButton
        :size="dense ? 'sm' : undefined"
        variant="outlined"
        v-bind="attrs"
        data-id="table-mobile-sort-activator"
      >
        <template #prepend>
          <RuiIcon
            name="lu-arrow-up-down"
            size="18"
          />
        </template>
        {{ activeLabel }}
      </RuiButton>
    </template>
    <div class="py-1 min-w-40">
      <RuiButton
        v-for="column in sortableColumns"
        :key="column.key.toString()"
        variant="text"
        size="sm"
        class="!justify-between w-full !rounded-none"
        :data-id="`table-mobile-sort-option-${column.key}`"
        :data-active="isActive(column.key)"
        :data-direction="sortDirection(column.key)"
        @click="onSelect(column)"
      >
        {{ columnLabel(column) }}
        <template #append>
          <RuiIcon
            v-if="isActive(column.key)"
            name="lu-arrow-down"
            :class="sortDirection(column.key) === 'asc' ? 'rotate-180' : ''"
            size="16"
          />
          <span
            v-else
            class="w-4"
          />
        </template>
      </RuiButton>
    </div>
  </RuiMenu>
</template>
