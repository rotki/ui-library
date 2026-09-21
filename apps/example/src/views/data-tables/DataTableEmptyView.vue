<script lang="ts" setup>
import {
  RuiButton,
  RuiDataTable,
  RuiIcon,
} from '@rotki/ui-library/components';
import { fixedColumns, fixedRows } from '@/data/table-configs';

const retries = ref<number>(0);
</script>

<template>
  <div data-id="data-tables-empty">
    <h2 class="text-2xl font-bold mb-6">
      Empty &amp; Loading States
    </h2>

    <div class="grid grid-cols-1 gap-12">
      <!-- Empty table -->
      <div
        class="flex flex-col space-y-3"
        data-id="table-empty"
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
          data-id="table"
        />
      </div>

      <!-- Empty table with action slot -->
      <div
        class="flex flex-col space-y-3"
        data-id="table-empty-action"
      >
        <h4>Empty Table with Action</h4>
        <RuiDataTable
          :rows="[]"
          :cols="fixedColumns"
          :empty="{ label: 'No item found' }"
          row-attr="id"
          outlined
          rounded="md"
          data-id="table"
        >
          <template #empty-description>
            <div class="flex space-x-1 items-center">
              <span>No users found,</span>
              <RuiButton
                variant="text"
                size="sm"
                class="gap-1"
              >
                create users
                <RuiIcon
                  name="lu-plus"
                  color="primary"
                />
              </RuiButton>
            </div>
          </template>
        </RuiDataTable>
      </div>

      <!-- Loading without data -->
      <div
        class="flex flex-col space-y-3"
        data-id="table-loading-empty"
      >
        <h4>Loading without Data</h4>
        <RuiDataTable
          :rows="[]"
          :cols="fixedColumns"
          row-attr="id"
          outlined
          rounded="lg"
          loading
          data-id="table"
        />
      </div>

      <!-- Loading with data -->
      <div
        class="flex flex-col space-y-3"
        data-id="table-loading-data"
      >
        <h4>Loading with Data</h4>
        <RuiDataTable
          :rows="fixedRows"
          :cols="fixedColumns"
          row-attr="id"
          outlined
          loading
          data-id="table"
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

      <!-- Failed read without data -->
      <div
        class="flex flex-col space-y-3"
        data-id="table-error-empty"
      >
        <h4>Error without Data</h4>
        <p
          class="text-sm text-rui-text-secondary"
          data-id="retry-count"
        >
          Retries: {{ retries }}
        </p>
        <RuiDataTable
          :rows="[]"
          :cols="fixedColumns"
          error="The server did not respond in time."
          error-title="Could not load users"
          retry-text="Retry"
          row-attr="id"
          outlined
          data-id="table"
          @retry="retries++"
        />
      </div>

      <!-- Failed refresh with data -->
      <div
        class="flex flex-col space-y-3"
        data-id="table-error-data"
      >
        <h4>Error with Data from an Earlier Read</h4>
        <RuiDataTable
          :rows="fixedRows"
          :cols="fixedColumns"
          :items-per-page="5"
          error="Refreshing failed, showing the last loaded users."
          row-attr="id"
          outlined
          data-id="table"
        />
      </div>
    </div>
  </div>
</template>
