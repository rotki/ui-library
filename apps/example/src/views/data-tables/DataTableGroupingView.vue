<script lang="ts" setup>
import type { ExtendedUser } from '@/data/tables';
import {
  type DataTableColumn,
  type DataTableProps,
  type GroupData,
  RuiButton,
  RuiDataTable,
  RuiIcon,
} from '@rotki/ui-library/components';
import { ref } from 'vue';
import { fixedColumns as baseColumns, fixedRows } from '@/data/table-configs';

// Cast columns to ExtendedUser type for proper typing
const fixedColumns = baseColumns as DataTableColumn<ExtendedUser>[];

type TableProps = DataTableProps<ExtendedUser, 'id'>;

const group = ref<TableProps['group']>(['username']);
const collapsed = ref<TableProps['collapsed']>([]);
const lastCopiedGroup = ref<string>('');

const groupEnd = ref<TableProps['group']>(['username']);
const collapsedEnd = ref<TableProps['collapsed']>([]);
const pagination = ref<TableProps['pagination']>({
  limit: 10,
  page: 1,
  total: fixedRows.length,
});

const groupDisplay = computed<string>(() => {
  const g = get(group);
  if (!g)
    return 'None';
  if (Array.isArray(g))
    return g.join(', ');
  return String(g);
});

function onCopyGroup(data: GroupData<ExtendedUser>): void {
  const value = data.value?.[data.key as keyof ExtendedUser];
  set(lastCopiedGroup, `${String(data.key)}: ${String(value)}`);
}
</script>

<template>
  <div data-cy="data-tables-grouping">
    <h2 class="text-2xl font-bold mb-6">
      Row Grouping
    </h2>

    <div class="grid grid-cols-1 gap-12">
      <!-- Basic grouping -->
      <div
        class="flex flex-col space-y-3"
        data-cy="table-grouping-basic"
      >
        <h4>Basic Grouping</h4>
        <p class="text-sm text-rui-text-secondary">
          Grouped by: {{ groupDisplay }}
        </p>
        <p
          v-if="lastCopiedGroup"
          class="text-sm text-rui-text-secondary"
          data-cy="last-copied-group"
        >
          Last copied: {{ lastCopiedGroup }}
        </p>
        <RuiDataTable
          v-model:group="group"
          v-model:collapsed="collapsed"
          :rows="fixedRows"
          :cols="fixedColumns"
          row-attr="id"
          outlined
          data-cy="table"
          @copy:group="onCopyGroup($event)"
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

      <!-- Grouping with expand button at end -->
      <div
        class="flex flex-col space-y-3"
        data-cy="table-grouping-expand-end"
      >
        <h4>Grouping with Expand Button at End</h4>
        <p class="text-sm text-rui-text-secondary">
          Group expand button positioned at the end
        </p>
        <RuiDataTable
          v-model:group="groupEnd"
          v-model:collapsed="collapsedEnd"
          v-model:pagination="pagination"
          :rows="fixedRows"
          :cols="fixedColumns"
          row-attr="id"
          outlined
          group-expand-button-position="end"
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
