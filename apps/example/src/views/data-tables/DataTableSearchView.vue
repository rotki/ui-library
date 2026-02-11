<script lang="ts" setup>
import {
  RuiButton,
  RuiDataTable,
  RuiIcon,
  RuiTextField,
  type TablePaginationData,
} from '@rotki/ui-library/components';
import { fixedColumns, fixedRows } from '@/data/table-configs';

const search = ref<string>('');

const searchWithPagination = ref<string>('');
const pagination = ref<TablePaginationData>({
  limit: 5,
  page: 1,
  total: fixedRows.length,
});
</script>

<template>
  <div data-cy="data-tables-search">
    <h2 class="text-2xl font-bold mb-6">
      Search
    </h2>

    <div class="grid grid-cols-1 gap-12">
      <!-- Basic search -->
      <div
        class="flex flex-col space-y-3"
        data-cy="table-search-basic"
      >
        <h4>Basic Search</h4>
        <RuiTextField
          v-model="search"
          placeholder="Search..."
          label="Search"
          class="w-1/2 lg:w-2/5"
          variant="outlined"
          color="primary"
          hide-details
          data-cy="search-input"
        />
        <RuiDataTable
          :rows="fixedRows"
          :cols="fixedColumns"
          :search="search"
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

      <!-- Search with pagination -->
      <div
        class="flex flex-col space-y-3"
        data-cy="table-search-pagination"
      >
        <h4>Search with Pagination</h4>
        <RuiTextField
          v-model="searchWithPagination"
          placeholder="Search..."
          label="Search"
          class="w-1/2 lg:w-2/5"
          variant="outlined"
          color="primary"
          hide-details
          data-cy="search-input"
        />
        <RuiDataTable
          v-model:pagination="pagination"
          :rows="fixedRows"
          :cols="fixedColumns"
          :search="searchWithPagination"
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
