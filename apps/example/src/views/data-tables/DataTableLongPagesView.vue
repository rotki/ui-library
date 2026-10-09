<script lang="ts" setup>
import type { ExtendedUser } from '@/data/tables';
import {
  RuiButton,
  RuiCard,
  RuiDataTable,
  RuiDialog,
  type TablePaginationData,
} from '@rotki/ui-library/components';
import { fixedColumns, fixedRows } from '@/data/table-configs';

function longRows(count: number): ExtendedUser[] {
  return Array.from({ length: count }, (_, i): ExtendedUser => ({ ...fixedRows[i % fixedRows.length]!, id: i + 1 }));
}

function firstPage(limit: number, total: number): TablePaginationData {
  return { limit, page: 1, total };
}

const rows = longRows(120);
const nestedOuterRows = fixedRows.slice(0, 3);

const single = ref<TablePaginationData>(firstPage(50, rows.length));
const stackedFirst = ref<TablePaginationData>(firstPage(25, rows.length));
const stackedSecond = ref<TablePaginationData>(firstPage(25, rows.length));
const sideLeft = ref<TablePaginationData>(firstPage(25, rows.length));
const sideRight = ref<TablePaginationData>(firstPage(25, rows.length));
const nested = ref<TablePaginationData>(firstPage(25, rows.length));
const dialogPagination = ref<TablePaginationData>(firstPage(25, rows.length));

const expanded = ref<ExtendedUser[]>(nestedOuterRows.slice(0, 1));
const dialogOpen = ref<boolean>(false);
</script>

<template>
  <div data-id="data-tables-long-pages">
    <h2 class="text-2xl font-bold mb-6">
      Long Pages
    </h2>

    <div class="grid grid-cols-1 gap-12">
      <div
        class="flex flex-col space-y-3 max-w-2xl"
        data-id="long-single"
      >
        <h4>A Long, Wide Table</h4>
        <p class="text-sm text-rui-text-secondary">
          The bar sticks to the bottom of the view while the rows run past it, and stays put when the
          rows scroll sideways. Paging from the bottom brings the new page's first row into view.
        </p>
        <RuiDataTable
          v-model:pagination="single"
          :rows="rows"
          :cols="fixedColumns"
          row-attr="id"
          outlined
          sticky-header
          data-id="table"
        />
      </div>

      <div
        class="flex flex-col space-y-3"
        data-id="long-stacked"
      >
        <h4>Stacked Tables</h4>
        <p class="text-sm text-rui-text-secondary">
          Each bar sticks only while its own table is on screen
        </p>
        <RuiDataTable
          v-model:pagination="stackedFirst"
          :rows="rows"
          :cols="fixedColumns"
          row-attr="id"
          outlined
          data-id="table-first"
        />
        <RuiDataTable
          v-model:pagination="stackedSecond"
          :rows="rows"
          :cols="fixedColumns"
          row-attr="id"
          outlined
          data-id="table-second"
        />
      </div>

      <div
        class="flex flex-col space-y-3"
        data-id="long-side-by-side"
      >
        <h4>Side by Side</h4>
        <p class="text-sm text-rui-text-secondary">
          Both bars stick at once, each under its own column
        </p>
        <div class="grid grid-cols-2 gap-4 items-start">
          <RuiDataTable
            v-model:pagination="sideLeft"
            :rows="rows"
            :cols="fixedColumns.slice(0, 3)"
            row-attr="id"
            outlined
            data-id="table-left"
          />
          <RuiDataTable
            v-model:pagination="sideRight"
            :rows="rows"
            :cols="fixedColumns.slice(0, 3)"
            row-attr="id"
            outlined
            data-id="table-right"
          />
        </div>
      </div>

      <div
        class="flex flex-col space-y-3"
        data-id="long-nested"
      >
        <h4>Nested Table</h4>
        <p class="text-sm text-rui-text-secondary">
          Only the outer table's bar sticks; the nested one stays under its rows
        </p>
        <RuiDataTable
          v-model:expanded="expanded"
          :rows="nestedOuterRows"
          :cols="fixedColumns.slice(0, 3)"
          row-attr="id"
          outlined
          data-id="table"
        >
          <template #expanded-item>
            <RuiDataTable
              v-model:pagination="nested"
              :rows="rows"
              :cols="fixedColumns.slice(0, 3)"
              row-attr="id"
              outlined
              dense
              data-id="nested-table"
            />
          </template>
        </RuiDataTable>
      </div>

      <div
        class="flex flex-col space-y-3"
        data-id="long-dialog"
      >
        <h4>In a Dialog</h4>
        <p class="text-sm text-rui-text-secondary">
          The bar sticks to the bottom of the dialog's scrolling body
        </p>
        <RuiDialog
          v-model="dialogOpen"
          max-width="900"
        >
          <template #activator="{ attrs }">
            <RuiButton
              data-id="long-dialog-activator"
              v-bind="attrs"
            >
              Open dialog
            </RuiButton>
          </template>
          <RuiCard>
            <template #header>
              A long table in a dialog
            </template>
            <div
              class="h-80 overflow-auto"
              data-id="long-dialog-scroller"
            >
              <RuiDataTable
                v-model:pagination="dialogPagination"
                :rows="rows"
                :cols="fixedColumns"
                row-attr="id"
                outlined
                data-id="table"
              />
            </div>
          </RuiCard>
        </RuiDialog>
      </div>
    </div>
  </div>
</template>
