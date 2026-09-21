<script lang="ts" setup>
import type { BaseUser, ExtendedUser } from '@/data/tables';
import {
  RuiButton,
  RuiCard,
  RuiDataTable,
  RuiIcon,
  RuiTableRowExpander,
} from '@rotki/ui-library/components';
import { fixedColumns, fixedRows } from '@/data/table-configs';

const expandedMultiple = ref<ExtendedUser[]>([]);
const expandedSingle = ref<ExtendedUser[]>([]);
const expandedCustom = ref<ExtendedUser[]>([]);
const expandedNested = ref<ExtendedUser[]>(fixedRows.slice(0, 1));

const nestedOuterColumns = fixedColumns.filter(column => column.key === 'id' || column.key === 'name');

function isExpanded(row: BaseUser, expanded: ExtendedUser[]): boolean {
  return expanded.some(item => item.id === row.id);
}

function toggleRow(row: BaseUser, expanded: ExtendedUser[]): void {
  const index = expanded.findIndex(item => item.id === row.id);
  if (index === -1) {
    expanded.push(row as ExtendedUser);
  }
  else {
    expanded.splice(index, 1);
  }
}
</script>

<template>
  <div data-id="data-tables-expandable">
    <h2 class="text-2xl font-bold mb-6">
      Expandable Rows
    </h2>

    <div class="grid grid-cols-1 gap-12">
      <!-- Multiple expandable -->
      <div
        class="flex flex-col space-y-3"
        data-id="table-expandable-multiple"
      >
        <h4>Multiple Expandable</h4>
        <p class="text-sm text-rui-text-secondary">
          Multiple rows can be expanded at once
        </p>
        <RuiDataTable
          v-model:expanded="expandedMultiple"
          :rows="fixedRows"
          :cols="fixedColumns"
          row-attr="id"
          outlined
          sticky-header
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
          <template #expanded-item>
            <RuiCard data-id="expanded-content">
              <template #header>
                Expanded content
              </template>
              <p>This is the expanded row content.</p>
            </RuiCard>
          </template>
        </RuiDataTable>
      </div>

      <!-- Single expandable -->
      <div
        class="flex flex-col space-y-3"
        data-id="table-expandable-single"
      >
        <h4>Single Expandable</h4>
        <p class="text-sm text-rui-text-secondary">
          Only one row can be expanded at a time
        </p>
        <RuiDataTable
          v-model:expanded="expandedSingle"
          :rows="fixedRows"
          :cols="fixedColumns"
          row-attr="id"
          outlined
          single-expand
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
          <template #expanded-item>
            <RuiCard data-id="expanded-content">
              <template #header>
                Expanded content
              </template>
              <p>This is the expanded row content.</p>
            </RuiCard>
          </template>
        </RuiDataTable>
      </div>

      <!-- Custom expand control -->
      <div
        class="flex flex-col space-y-3"
        data-id="table-expandable-custom"
      >
        <h4>Custom Expand Control</h4>
        <p class="text-sm text-rui-text-secondary">
          Custom expand button using RuiTableRowExpander
        </p>
        <RuiDataTable
          v-model:expanded="expandedCustom"
          :rows="fixedRows"
          :cols="[{ key: 'expand' }, ...fixedColumns]"
          row-attr="id"
          outlined
          single-expand
          data-id="table"
        >
          <template #item.expand="{ row }">
            <RuiTableRowExpander
              icon="lu-circle-arrow-down"
              :expanded="isExpanded(row, expandedCustom)"
              @click="toggleRow(row, expandedCustom)"
            />
          </template>
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
          <template #expanded-item>
            <RuiCard data-id="expanded-content">
              <template #header>
                Expanded content
              </template>
              <p>This is the expanded row content.</p>
            </RuiCard>
          </template>
        </RuiDataTable>
      </div>

      <!-- Nested table wider than its parent -->
      <div
        class="flex flex-col space-y-3 max-w-xl"
        data-id="table-expandable-nested"
      >
        <h4>Nested Table</h4>
        <p class="text-sm text-rui-text-secondary">
          The expanded panel keeps to the table's visible width, so the wide nested table scrolls on its own
        </p>
        <RuiDataTable
          v-model:expanded="expandedNested"
          :rows="fixedRows.slice(0, 3)"
          :cols="nestedOuterColumns"
          row-attr="id"
          outlined
          hide-default-footer
          hide-default-header
          data-id="table"
        >
          <template #expanded-item>
            <RuiDataTable
              :rows="fixedRows.slice(0, 3)"
              :cols="fixedColumns"
              row-attr="id"
              outlined
              dense
              hide-default-footer
              data-id="nested-table"
            />
          </template>
        </RuiDataTable>
      </div>
    </div>
  </div>
</template>
