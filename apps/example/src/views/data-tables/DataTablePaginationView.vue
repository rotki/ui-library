<script lang="ts" setup>
import {
  RuiButton,
  RuiDataTable,
  RuiIcon,
  type TablePaginationData,
} from '@rotki/ui-library/components';
import { ref } from 'vue';
import { fixedColumns, fixedRows } from '@/data/table-configs';

const pagination = ref<TablePaginationData>({
  limit: 5,
  page: 1,
  total: fixedRows.length,
});

const paginationNoPerPage = ref<TablePaginationData>({
  limit: 5,
  page: 1,
  total: fixedRows.length,
});

const paginationHideHeader = ref<TablePaginationData>({
  limit: 5,
  page: 1,
  total: fixedRows.length,
});

const paginationHideFooter = ref<TablePaginationData>({
  limit: 5,
  page: 1,
  total: fixedRows.length,
});

const paginationSticky = ref<TablePaginationData>({
  limit: 5,
  page: 1,
  total: fixedRows.length,
});
</script>

<template>
  <div data-cy="data-tables-pagination">
    <h2 class="text-2xl font-bold mb-6">
      Pagination
    </h2>

    <div class="grid grid-cols-1 gap-12">
      <!-- Basic pagination -->
      <div
        class="flex flex-col space-y-3"
        data-cy="table-pagination-basic"
      >
        <h4>Basic Pagination</h4>
        <p class="text-sm text-rui-text-secondary">
          Page {{ pagination.page }} of {{ Math.ceil(pagination.total / pagination.limit) }}
        </p>
        <RuiDataTable
          v-model:pagination="pagination"
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

      <!-- Pagination without per-page selector -->
      <div
        class="flex flex-col space-y-3"
        data-cy="table-pagination-no-per-page"
      >
        <h4>Pagination (disabled per-page selector)</h4>
        <RuiDataTable
          v-model:pagination="paginationNoPerPage"
          :rows="fixedRows"
          :cols="fixedColumns"
          row-attr="id"
          outlined
          disable-per-page
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

      <!-- Hide header pagination -->
      <div
        class="flex flex-col space-y-3"
        data-cy="table-pagination-hide-header"
      >
        <h4>Hide Header Pagination</h4>
        <p class="text-sm text-rui-text-secondary">
          Only footer pagination is visible
        </p>
        <RuiDataTable
          v-model:pagination="paginationHideHeader"
          :rows="fixedRows"
          :cols="fixedColumns"
          row-attr="id"
          outlined
          hide-default-header
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

      <!-- Hide footer pagination -->
      <div
        class="flex flex-col space-y-3"
        data-cy="table-pagination-hide-footer"
      >
        <h4>Hide Footer Pagination</h4>
        <p class="text-sm text-rui-text-secondary">
          Only header pagination is visible
        </p>
        <RuiDataTable
          v-model:pagination="paginationHideFooter"
          :rows="fixedRows"
          :cols="fixedColumns"
          row-attr="id"
          outlined
          hide-default-footer
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

      <!-- Sticky header -->
      <div
        class="flex flex-col space-y-3"
        data-cy="table-pagination-sticky"
      >
        <h4>Sticky Header</h4>
        <p class="text-sm text-rui-text-secondary">
          Table header stays visible when scrolling (scroll the table to test)
        </p>
        <div class="h-48 overflow-auto">
          <RuiDataTable
            v-model:pagination="paginationSticky"
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
          </RuiDataTable>
        </div>
      </div>
    </div>
  </div>
</template>
