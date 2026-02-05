<script lang="ts" setup>
import type { ExtendedUser } from '@/data/tables';
import {
  type DataTableColumn,
  type DataTableSortData,
  RuiButton,
  RuiDataTable,
  RuiIcon,
} from '@rotki/ui-library/components';
import { ref } from 'vue';
import { columns as baseColumns, fixedRows } from '@/data/table-configs';

// Cast columns to ExtendedUser type for proper typing
const columns = baseColumns as DataTableColumn<ExtendedUser>[];

const singleSort = ref<DataTableSortData<ExtendedUser>>({
  column: 'name',
  direction: 'asc',
});

const multiSort = ref<DataTableSortData<ExtendedUser>>([
  { column: 'name', direction: 'asc' },
]);

const sortDisplay = computed<string>(() => {
  const sort = get(singleSort);
  if (!sort || Array.isArray(sort))
    return 'None';
  return `${sort.column} (${sort.direction})`;
});
</script>

<template>
  <div data-cy="data-tables-sorting">
    <h2 class="text-2xl font-bold mb-6">
      Sorting
    </h2>

    <div class="grid grid-cols-1 gap-12">
      <!-- Single column sort -->
      <div
        class="flex flex-col space-y-3"
        data-cy="table-single-sort"
      >
        <h4>Single Column Sort</h4>
        <p class="text-sm text-rui-text-secondary">
          Current sort: {{ sortDisplay }}
        </p>
        <RuiDataTable
          v-model:sort="singleSort"
          :rows="fixedRows"
          :cols="columns"
          row-attr="id"
          outlined
          data-cy="table"
        >
          <template #item.action>
            <RuiButton
              icon
              variant="text"
              size="sm"
            >
              <RuiIcon
                name="lu-ellipsis"
                color="primary"
              />
            </RuiButton>
          </template>
        </RuiDataTable>
      </div>

      <!-- Multi column sort -->
      <div
        class="flex flex-col space-y-3"
        data-cy="table-multi-sort"
      >
        <h4>Multi Column Sort</h4>
        <p class="text-sm text-rui-text-secondary">
          Click multiple column headers to add sort columns
        </p>
        <RuiDataTable
          v-model:sort="multiSort"
          :rows="fixedRows"
          :cols="columns"
          row-attr="id"
          outlined
          data-cy="table"
        >
          <template #item.action>
            <RuiButton
              icon
              variant="text"
              size="sm"
            >
              <RuiIcon
                name="lu-ellipsis"
                color="primary"
              />
            </RuiButton>
          </template>
        </RuiDataTable>
      </div>
    </div>
  </div>
</template>
