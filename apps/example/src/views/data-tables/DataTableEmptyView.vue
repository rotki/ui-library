<script lang="ts" setup>
import {
  RuiButton,
  RuiDataTable,
  RuiIcon,
} from '@rotki/ui-library/components';
import { fixedColumns, fixedRows } from '@/data/table-configs';
</script>

<template>
  <div data-cy="data-tables-empty">
    <h2 class="text-2xl font-bold mb-6">
      Empty &amp; Loading States
    </h2>

    <div class="grid grid-cols-1 gap-12">
      <!-- Empty table -->
      <div
        class="flex flex-col space-y-3"
        data-cy="table-empty"
      >
        <h4>Empty Table</h4>
        <RuiDataTable
          :rows="[]"
          :cols="fixedColumns"
          :empty="{
            label: 'No item found',
            description: 'No users found in the database',
          }"
          row-attr="id"
          outlined
          rounded="sm"
          data-cy="table"
        />
      </div>

      <!-- Empty table with action slot -->
      <div
        class="flex flex-col space-y-3"
        data-cy="table-empty-action"
      >
        <h4>Empty Table with Action</h4>
        <RuiDataTable
          :rows="[]"
          :cols="fixedColumns"
          :empty="{ label: 'No item found' }"
          row-attr="id"
          outlined
          rounded="md"
          data-cy="table"
        >
          <template #empty-description>
            <div class="flex space-x-1 items-center">
              <span>No users found,</span>
              <RuiButton
                variant="text"
                size="sm"
              >
                create users
                <template #append>
                  <RuiIcon
                    name="lu-plus"
                    color="primary"
                  />
                </template>
              </RuiButton>
            </div>
          </template>
        </RuiDataTable>
      </div>

      <!-- Loading without data -->
      <div
        class="flex flex-col space-y-3"
        data-cy="table-loading-empty"
      >
        <h4>Loading without Data</h4>
        <RuiDataTable
          :rows="[]"
          :cols="fixedColumns"
          row-attr="id"
          outlined
          rounded="lg"
          loading
          data-cy="table"
        />
      </div>

      <!-- Loading with data -->
      <div
        class="flex flex-col space-y-3"
        data-cy="table-loading-data"
      >
        <h4>Loading with Data</h4>
        <RuiDataTable
          :rows="fixedRows"
          :cols="fixedColumns"
          row-attr="id"
          outlined
          loading
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
