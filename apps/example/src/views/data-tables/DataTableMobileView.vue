<script lang="ts" setup>
import type { ExtendedUser } from '@/data/tables';
import {
  type DataTableColumn,
  type DataTableSortData,
  RuiButton,
  RuiDataTable,
  RuiIcon,
  type TablePaginationData,
} from '@rotki/ui-library/components';
import { fixedRows } from '@/data/table-configs';

// A trimmed column set with one column hidden in the stacked mobile layout.
const columns: DataTableColumn<ExtendedUser>[] = [
  { key: 'id', label: 'ID', mobileHidden: true },
  { key: 'name', label: 'Full name', sortable: true },
  { key: 'email', label: 'Email address', sortable: true },
  { key: 'phone', align: 'end', label: 'Phone' },
  { key: 'action', label: '', mobileHeader: true },
];

const sort = ref<DataTableSortData<ExtendedUser>>({ column: 'name', direction: 'asc' });
const pagination = ref<TablePaginationData>({ limit: 5, page: 1, total: fixedRows.length });

const expanded = ref<ExtendedUser[]>([]);
const selected = ref<ExtendedUser['id'][]>([]);
</script>

<template>
  <div data-id="data-tables-mobile">
    <h2 class="text-2xl font-bold mb-6">
      Mobile
    </h2>

    <div class="grid grid-cols-1 gap-12">
      <!-- Forced stacked layout -->
      <div
        class="flex flex-col space-y-3 max-w-md"
        data-id="table-mobile-forced"
      >
        <h4>Stacked card layout (forced)</h4>
        <p class="text-sm text-rui-text-secondary">
          Each row becomes a card of label/value pairs. Headers move into the
          sort menu and the pagination collapses to prev/next. The
          <code>ID</code> column is hidden via <code>mobileHidden</code>.
        </p>
        <RuiDataTable
          v-model:sort="sort"
          v-model:pagination="pagination"
          :rows="fixedRows"
          :cols="columns"
          mobile
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

      <!-- Automatic switch at a breakpoint -->
      <div
        class="flex flex-col space-y-3"
        data-id="table-mobile-auto"
      >
        <h4>Automatic switch (mobileBreakpoint)</h4>
        <p class="text-sm text-rui-text-secondary">
          Resize the viewport below 768px: the table switches to the stacked
          layout on its own.
        </p>
        <RuiDataTable
          :rows="fixedRows"
          :cols="columns"
          :mobile-breakpoint="768"
          :pagination="{ limit: 5, page: 1, total: fixedRows.length }"
          :sort="{ column: 'name', direction: 'asc' }"
          row-attr="id"
          outlined
          data-id="table-auto"
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

      <!-- Container-based switch: narrow region of a wide window -->
      <div
        class="flex flex-col space-y-3"
        data-id="table-mobile-container"
      >
        <h4>Container-based switch (mobileBreakpointBasis="container")</h4>
        <p class="text-sm text-rui-text-secondary">
          This table lives in a fixed 360px box. With
          <code>mobile-breakpoint-basis="container"</code> it switches to the
          stacked layout based on its own width, even when the window is wide.
        </p>
        <div class="w-[360px] border border-dashed border-black/20 p-2">
          <RuiDataTable
            :rows="fixedRows"
            :cols="columns"
            :mobile-breakpoint="500"
            mobile-breakpoint-basis="container"
            :pagination="{ limit: 5, page: 1, total: fixedRows.length }"
            :sort="{ column: 'name', direction: 'asc' }"
            row-attr="id"
            outlined
            data-id="table-container"
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

      <!-- Sticky toolbar + expandable rows -->
      <div
        class="flex flex-col space-y-3 max-w-md"
        data-id="table-mobile-sticky"
      >
        <h4>Sticky toolbar + expandable rows</h4>
        <p class="text-sm text-rui-text-secondary">
          With <code>sticky-header</code> the pagination + sort toolbar stays
          pinned while the card list scrolls. The expand toggle moves into the
          card header and the expanded panel attaches beneath the card.
        </p>
        <RuiDataTable
          v-model="selected"
          v-model:expanded="expanded"
          :rows="fixedRows"
          :cols="columns"
          mobile
          sticky-header
          :pagination="{ limit: 5, page: 1, total: fixedRows.length }"
          :sort="{ column: 'name', direction: 'asc' }"
          row-attr="id"
          outlined
          data-id="table-sticky"
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
          <template #expanded-item="{ row }">
            <div
              class="p-2 text-sm"
              data-id="expanded-panel-content"
            >
              Details for {{ row.name }} ({{ row.email }})
            </div>
          </template>
        </RuiDataTable>
      </div>
    </div>
  </div>
</template>
