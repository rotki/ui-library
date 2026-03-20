<script lang="ts" setup>
import {
  RuiButton,
  RuiDataTable,
  RuiIcon,
} from '@rotki/ui-library/components';
import { fixedColumns, fixedRows } from '@/data/table-configs';
</script>

<template>
  <div data-id="data-tables-basic">
    <h2 class="text-2xl font-bold mb-6">
      Basic Tables
    </h2>

    <div class="grid grid-cols-1 gap-12">
      <!-- With Column definitions -->
      <div
        class="flex flex-col space-y-3"
        data-id="table-columns-defined"
      >
        <h4>With Column definitions</h4>
        <RuiDataTable
          :rows="fixedRows"
          :cols="fixedColumns"
          row-attr="id"
          hide-default-footer
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

      <!-- No Column definitions (auto-generated) -->
      <div
        class="flex flex-col space-y-3"
        data-id="table-auto-columns"
      >
        <h4>No Column definitions (auto-generated)</h4>
        <RuiDataTable
          :rows="fixedRows"
          row-attr="id"
          data-id="table"
        />
      </div>

      <!-- Outlined -->
      <div
        class="flex flex-col space-y-3"
        data-id="table-outlined"
      >
        <h4>Outlined</h4>
        <RuiDataTable
          :rows="fixedRows"
          :cols="fixedColumns"
          row-attr="id"
          outlined
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

      <!-- Dense -->
      <div
        class="flex flex-col space-y-3"
        data-id="table-dense"
      >
        <h4>Dense</h4>
        <RuiDataTable
          :rows="fixedRows"
          :cols="fixedColumns"
          row-attr="id"
          outlined
          dense
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

      <!-- Striped -->
      <div
        class="flex flex-col space-y-3"
        data-id="table-striped"
      >
        <h4>Striped</h4>
        <RuiDataTable
          :rows="fixedRows"
          :cols="fixedColumns"
          row-attr="id"
          outlined
          striped
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
    </div>
  </div>
</template>
