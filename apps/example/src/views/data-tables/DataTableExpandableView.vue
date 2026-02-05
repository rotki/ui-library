<script lang="ts" setup>
import type { BaseUser, ExtendedUser } from '@/data/tables';
import {
  RuiButton,
  RuiCard,
  RuiDataTable,
  RuiIcon,
  RuiTableRowExpander,
} from '@rotki/ui-library/components';
import { ref } from 'vue';
import { fixedColumns, fixedRows } from '@/data/table-configs';

const expandedMultiple = ref<ExtendedUser[]>([]);
const expandedSingle = ref<ExtendedUser[]>([]);
const expandedCustom = ref<ExtendedUser[]>([]);

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
  <div data-cy="data-tables-expandable">
    <h2 class="text-2xl font-bold mb-6">
      Expandable Rows
    </h2>

    <div class="grid grid-cols-1 gap-12">
      <!-- Multiple expandable -->
      <div
        class="flex flex-col space-y-3"
        data-cy="table-expandable-multiple"
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
          <template #expanded-item>
            <RuiCard data-cy="expanded-content">
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
        data-cy="table-expandable-single"
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
          <template #expanded-item>
            <RuiCard data-cy="expanded-content">
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
        data-cy="table-expandable-custom"
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
          data-cy="table"
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
            <RuiCard data-cy="expanded-content">
              <template #header>
                Expanded content
              </template>
              <p>This is the expanded row content.</p>
            </RuiCard>
          </template>
        </RuiDataTable>
      </div>
    </div>
  </div>
</template>
