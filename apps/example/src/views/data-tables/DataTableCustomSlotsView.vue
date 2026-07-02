<script lang="ts" setup>
import type { ExtendedUser } from '@/data/tables';
import {
  type DataTableColumn,
  RuiButton,
  RuiDataTable,
  RuiIcon,
} from '@rotki/ui-library/components';
import { fixedColumns as baseColumns, fixedRows } from '@/data/table-configs';

// Cast columns to ExtendedUser type for proper typing
const fixedColumns = baseColumns as DataTableColumn<ExtendedUser>[];

const groupContent = ref<keyof ExtendedUser | (keyof ExtendedUser)[]>(['username']);
const collapsedContent = ref<ExtendedUser[]>([]);

const groupFull = ref<keyof ExtendedUser | (keyof ExtendedUser)[]>(['username']);
const collapsedFull = ref<ExtendedUser[]>([]);
</script>

<template>
  <div data-id="data-tables-custom-slots">
    <h2 class="text-2xl font-bold mb-6">
      Custom Slots
    </h2>

    <div class="grid grid-cols-1 gap-12">
      <!-- Custom column header + body prepend/append slots -->
      <div
        class="flex flex-col space-y-3"
        data-id="table-custom-header"
      >
        <h4>Custom Column Header &amp; Body Slots</h4>
        <p class="text-sm text-rui-text-secondary">
          Overrides the <code>header.name</code> column header and adds
          <code>body.prepend</code> / <code>body.append</code> rows
        </p>
        <RuiDataTable
          :rows="fixedRows"
          :cols="fixedColumns"
          row-attr="id"
          outlined
          data-id="table"
        >
          <template #header.name="{ column }">
            <span
              class="inline-flex items-center gap-1 text-rui-primary"
              data-id="custom-header-name"
            >
              <RuiIcon
                name="lu-user"
                size="16"
              />
              {{ column.label }}
            </span>
          </template>
          <template #body.prepend="{ colspan }">
            <tr data-id="body-prepend-row">
              <td
                :colspan="colspan"
                class="p-2 text-sm font-medium text-rui-text-secondary"
              >
                Prepended body row
              </td>
            </tr>
          </template>
          <template #body.append="{ colspan }">
            <tr data-id="body-append-row">
              <td
                :colspan="colspan"
                class="p-2 text-sm font-medium text-rui-text-secondary"
              >
                Appended body row
              </td>
            </tr>
          </template>
        </RuiDataTable>
      </div>

      <!-- Custom group.header.content slot -->
      <div
        class="flex flex-col space-y-3"
        data-id="table-group-header-content"
      >
        <h4>Custom Group Header Content</h4>
        <p class="text-sm text-rui-text-secondary">
          Overrides <code>group.header.content</code> while keeping the default
          expand and ungroup controls
        </p>
        <RuiDataTable
          v-model:group="groupContent"
          v-model:collapsed="collapsedContent"
          :rows="fixedRows"
          :cols="fixedColumns"
          row-attr="id"
          outlined
          data-id="table"
        >
          <template #group.header.content="{ header, groupKey }">
            <span
              class="inline-flex items-center gap-2"
              data-id="custom-group-content"
            >
              <RuiIcon
                name="lu-users"
                size="16"
                color="primary"
              />
              <strong>{{ groupKey }}</strong>
              <span class="text-rui-text-secondary">{{ header.identifier }}</span>
            </span>
          </template>
        </RuiDataTable>
      </div>

      <!-- Full group.header slot override -->
      <div
        class="flex flex-col space-y-3"
        data-id="table-group-header-full"
      >
        <h4>Full Group Header Override</h4>
        <p class="text-sm text-rui-text-secondary">
          Replaces the entire <code>group.header</code> row with a custom cell
          and toggle
        </p>
        <RuiDataTable
          v-model:group="groupFull"
          v-model:collapsed="collapsedFull"
          :rows="fixedRows"
          :cols="fixedColumns"
          row-attr="id"
          outlined
          data-id="table"
        >
          <template #group.header="{ header, isOpen, toggle, colspan }">
            <td
              :colspan="colspan"
              class="p-2 bg-rui-grey-100 dark:bg-rui-grey-800"
            >
              <RuiButton
                size="sm"
                variant="text"
                data-id="custom-group-toggle"
                @click="toggle()"
              >
                <span data-id="custom-group-header">
                  {{ isOpen ? 'Hide' : 'Show' }} {{ header.identifier }}
                </span>
              </RuiButton>
            </td>
          </template>
        </RuiDataTable>
      </div>
    </div>
  </div>
</template>
