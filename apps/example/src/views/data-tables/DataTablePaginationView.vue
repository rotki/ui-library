<script lang="ts" setup>
import {
  RuiButton,
  RuiCard,
  RuiDataTable,
  RuiDialog,
  RuiIcon,
  type TablePaginationData,
} from '@rotki/ui-library/components';
import { fixedColumns, fixedRows } from '@/data/table-configs';

const stickyDialogOpen = ref<boolean>(false);

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

const singlePageRows = fixedRows.slice(0, 5);

const paginationSinglePage = ref<TablePaginationData>({
  limit: 10,
  page: 1,
  total: singlePageRows.length,
});

const paginationRaisedLimit = ref<TablePaginationData>({
  limit: 25,
  page: 1,
  total: fixedRows.length,
});

const paginationSticky = ref<TablePaginationData>({
  limit: 5,
  page: 1,
  total: fixedRows.length,
});

const paginationLargeTotal = ref<TablePaginationData>({
  limit: 10,
  page: 1,
  total: 100_000,
});

const paginationLargeTotalDropdown = ref<TablePaginationData>({
  limit: 10,
  page: 1,
  total: 100_000,
});
</script>

<template>
  <div data-id="data-tables-pagination">
    <h2 class="text-2xl font-bold mb-6">
      Pagination
    </h2>

    <div class="grid grid-cols-1 gap-12">
      <!-- Basic pagination -->
      <div
        class="flex flex-col space-y-3"
        data-id="table-pagination-basic"
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

      <!-- Pagination without per-page selector -->
      <div
        class="flex flex-col space-y-3"
        data-id="table-pagination-no-per-page"
      >
        <h4>Pagination (disabled per-page selector)</h4>
        <RuiDataTable
          v-model:pagination="paginationNoPerPage"
          :rows="fixedRows"
          :cols="fixedColumns"
          row-attr="id"
          outlined
          disable-per-page
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

      <!-- Hide header pagination -->
      <div
        class="flex flex-col space-y-3"
        data-id="table-pagination-hide-header"
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

      <!-- Hide footer pagination -->
      <div
        class="flex flex-col space-y-3"
        data-id="table-pagination-hide-footer"
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

      <!-- Large total (jump-to-page input mode) -->
      <div
        class="flex flex-col space-y-3"
        data-id="table-pagination-large-total"
      >
        <h4>Large Total (jump-to-page input)</h4>
        <p class="text-sm text-rui-text-secondary">
          Simulated server-side pagination with total = 100,000 and limit = 10 →
          10,000 pages. The ranges dropdown is replaced by a numeric input.
        </p>
        <RuiDataTable
          v-model:pagination.external="paginationLargeTotal"
          :rows="fixedRows"
          :cols="fixedColumns"
          row-attr="id"
          outlined
          data-id="table"
        />
      </div>

      <!-- Large total with dropdown forced via rangesThreshold=0 -->
      <div
        class="flex flex-col space-y-3"
        data-id="table-pagination-large-total-dropdown"
      >
        <h4>Large Total (dropdown forced)</h4>
        <p class="text-sm text-rui-text-secondary">
          Same total as above but with <code>rangesThreshold = 0</code> — the
          dropdown stays, so you can confirm the escape hatch works.
        </p>
        <RuiDataTable
          v-model:pagination.external="paginationLargeTotalDropdown"
          :rows="fixedRows"
          :cols="fixedColumns"
          :ranges-threshold="0"
          row-attr="id"
          outlined
          data-id="table"
        />
      </div>

      <!-- Every row on a single page -->
      <div
        class="flex flex-col space-y-3"
        data-id="table-pagination-single-page"
      >
        <h4>Single Page</h4>
        <p class="text-sm text-rui-text-secondary">
          Every rows-per-page option fits all rows, so the whole bar is disabled
        </p>
        <RuiDataTable
          v-model:pagination="paginationSinglePage"
          :rows="singlePageRows"
          :cols="fixedColumns"
          row-attr="id"
          outlined
          hide-default-header
          data-id="table"
        />
      </div>

      <!-- A single page only because the limit was raised -->
      <div
        class="flex flex-col space-y-3"
        data-id="table-pagination-raised-limit"
      >
        <h4>Single Page at a Raised Limit</h4>
        <p class="text-sm text-rui-text-secondary">
          The page controls are disabled, but rows per page stays live so the limit can go back down
        </p>
        <RuiDataTable
          v-model:pagination="paginationRaisedLimit"
          :rows="fixedRows"
          :cols="fixedColumns"
          row-attr="id"
          outlined
          hide-default-header
          data-id="table"
        />
      </div>

      <!-- Sticky header -->
      <div
        class="flex flex-col space-y-3"
        data-id="table-pagination-sticky"
      >
        <h4>Sticky Header</h4>
        <p class="text-sm text-rui-text-secondary">
          Table header stays visible when scrolling (scroll the table to test)
        </p>
        <div
          class="h-48 overflow-auto"
          data-id="sticky-scroller"
        >
          <RuiDataTable
            v-model:pagination="paginationSticky"
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
          </RuiDataTable>
        </div>
      </div>

      <!-- Sticky header in a dialog -->
      <div
        class="flex flex-col space-y-3"
        data-id="table-pagination-sticky-dialog"
      >
        <h4>Sticky Header in a Dialog</h4>
        <p class="text-sm text-rui-text-secondary">
          The dialog is transformed, so the stuck header has to be placed relative to it rather than the viewport
        </p>
        <RuiDialog
          v-model="stickyDialogOpen"
          max-width="900"
          data-id="sticky-dialog"
        >
          <template #activator="{ attrs }">
            <RuiButton
              data-id="sticky-dialog-activator"
              v-bind="attrs"
            >
              Open dialog
            </RuiButton>
          </template>
          <RuiCard>
            <template #header>
              Sticky header in a dialog
            </template>
            <div
              class="h-64 overflow-auto"
              data-id="sticky-dialog-scroller"
            >
              <RuiDataTable
                :rows="fixedRows"
                :cols="fixedColumns"
                row-attr="id"
                outlined
                sticky-header
                data-id="table"
              />
            </div>
          </RuiCard>
        </RuiDialog>
      </div>

      <!-- Sticky header in a wrapper that could scroll but does not -->
      <div
        class="flex flex-col space-y-3"
        data-id="table-pagination-sticky-page"
      >
        <h4>Sticky Header in a Card Body</h4>
        <p class="text-sm text-rui-text-secondary">
          The wrapper allows scrolling but has nothing to scroll, so the header sticks to the page
        </p>
        <div class="overflow-y-auto">
          <RuiDataTable
            :rows="fixedRows"
            :cols="fixedColumns"
            row-attr="id"
            outlined
            sticky-header
            data-id="table"
          />
        </div>
      </div>

      <!-- Sticky header in a card body inside a scrolling container -->
      <div
        class="flex flex-col space-y-3"
        data-id="table-pagination-sticky-nested"
      >
        <h4>Sticky Header in a Card Body inside a Scrolling Container</h4>
        <p class="text-sm text-rui-text-secondary">
          The inner wrapper allows scrolling but has nothing to scroll, so the header sticks to the outer container
        </p>
        <div
          class="h-48 overflow-auto"
          data-id="sticky-scroller"
        >
          <div class="overflow-y-auto">
            <RuiDataTable
              :rows="fixedRows"
              :cols="fixedColumns"
              row-attr="id"
              outlined
              sticky-header
              data-id="table"
            />
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
