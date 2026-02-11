<script lang="ts" setup>
import {
  RuiButton,
  RuiDataTable,
  RuiIcon,
  type TablePaginationData,
} from '@rotki/ui-library/components';
import { fixedColumns, fixedRows } from '@/data/table-configs';

const selected = ref<number[]>([]);

const selectedMultiPage = ref<number[]>([]);
const pagination = ref<TablePaginationData>({
  limit: 5,
  page: 1,
  total: fixedRows.length,
});

const selectedWithDisabled = ref<number[]>([]);
const disabledRows = fixedRows.slice(0, 3);
</script>

<template>
  <div data-cy="data-tables-selection">
    <h2 class="text-2xl font-bold mb-6">
      Selection
    </h2>

    <div class="grid grid-cols-1 gap-12">
      <!-- Basic selection -->
      <div
        class="flex flex-col space-y-3"
        data-cy="table-selection-basic"
      >
        <h4>Basic Selection</h4>
        <p class="text-sm text-rui-text-secondary">
          Selected: {{ selected.length }} rows
        </p>
        <RuiDataTable
          v-model="selected"
          :rows="fixedRows"
          :cols="fixedColumns"
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

      <!-- Multi-page selection -->
      <div
        class="flex flex-col space-y-3"
        data-cy="table-selection-multi-page"
      >
        <h4>Multi-page Selection</h4>
        <p class="text-sm text-rui-text-secondary">
          Selected: {{ selectedMultiPage.length }} rows (persists across pages)
        </p>
        <RuiDataTable
          v-model="selectedMultiPage"
          v-model:pagination="pagination"
          :rows="fixedRows"
          :cols="fixedColumns"
          row-attr="id"
          outlined
          multi-page-select
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

      <!-- Selection with disabled rows -->
      <div
        class="flex flex-col space-y-3"
        data-cy="table-selection-disabled"
      >
        <h4>Selection with Disabled Rows</h4>
        <p class="text-sm text-rui-text-secondary">
          First 3 rows are disabled and cannot be selected
        </p>
        <RuiDataTable
          v-model="selectedWithDisabled"
          :rows="fixedRows"
          :cols="fixedColumns"
          :disabled-rows="disabledRows"
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
