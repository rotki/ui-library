<script lang="ts" setup generic="T extends object">
import type { TableColumn } from '@/components/tables/RuiTableHead.vue';
import { useDataTableColumns, useDataTableRowIdentity, useDataTableStyling } from '@/components/tables/data-table/context';
import RuiDataTableEmptyRow from '@/components/tables/data-table/RuiDataTableEmptyRow.vue';
import RuiDataTableErrorRow from '@/components/tables/data-table/RuiDataTableErrorRow.vue';
import RuiDataTableGroupRow from '@/components/tables/data-table/RuiDataTableGroupRow.vue';
import RuiDataTableLoadingRow from '@/components/tables/data-table/RuiDataTableLoadingRow.vue';
import RuiDataTableRow from '@/components/tables/data-table/RuiDataTableRow.vue';
import { type GroupHeader, isRow } from '@/composables/tables/data-table/types';

const { error, loading, noData } = defineProps<{
  filtered: (T | GroupHeader<T>)[];
  loading: boolean;
  noData: boolean;
  empty: { label?: string; description?: string };
  error: string;
  errorTitle: string;
  retryText: string;
}>();

const emit = defineEmits<{
  retry: [];
}>();

defineSlots<Partial<
  Record<`item.${string}`, (props: { column: TableColumn<T>; row: T; index: number }) => any> & {
    'body.prepend'?: (props: { colspan: number }) => any;
    'body.append'?: (props: { colspan: number }) => any;
    'group.header'?: (props: {
      colspan: number;
      header: GroupHeader<T>;
      isOpen: boolean;
      toggle: () => void;
    }) => any;
    'group.header.content'?: (props: { header: GroupHeader<T>; groupKey: string }) => any;
    'expanded-item'?: (props: { row: T; index: number }) => any;
    'no-data'?: () => any;
    'empty-description'?: () => any;
    'error'?: () => any;
  }
>>();

const { classes, colspan } = useDataTableStyling();
const { itemSlotKeys } = useDataTableColumns<T>();
const { getRowId } = useDataTableRowIdentity<T>();

/**
 * Loading outranks a failure, which outranks the empty state: rows that did
 * not arrive are not rows that are not there. Rows kept from an earlier read
 * stay below the error.
 */
const showError = computed<boolean>(() => !!error && !loading);

/**
 * Rows shown while a read is in flight are the previous result, so they dim
 * until it lands. An empty table shows its loading row instead, undimmed.
 */
const stale = computed<boolean>(() => loading && !noData);
</script>

<template>
  <tbody
    class="transition-opacity duration-150"
    :class="[classes.tbody, { 'opacity-50': stale }]"
    :data-stale="stale || undefined"
  >
    <!-- eslint-disable-next-line vue/require-explicit-slots -- defined via Partial<Record<...>> in defineSlots -->
    <slot
      v-if="$slots['body.prepend']"
      :colspan="colspan"
      name="body.prepend"
    />
    <RuiDataTableErrorRow
      v-if="showError"
      :message="error"
      :title="errorTitle"
      :retry-text="retryText"
      @retry="emit('retry')"
    >
      <template
        v-if="$slots.error"
        #error
      >
        <!-- eslint-disable-next-line vue/require-explicit-slots -- defined via Partial<Record<...>> in defineSlots -->
        <slot name="error" />
      </template>
    </RuiDataTableErrorRow>
    <template v-for="(row, index) in filtered">
      <RuiDataTableGroupRow
        v-if="!isRow(row)"
        :key="`group-${row.identifier}`"
        :row="row"
      >
        <template
          v-if="$slots['group.header']"
          #group.header="slotData"
        >
          <!-- eslint-disable-next-line vue/require-explicit-slots -- defined via Partial<Record<...>> in defineSlots -->
          <slot
            name="group.header"
            v-bind="slotData"
          />
        </template>
        <template
          v-if="$slots['group.header.content']"
          #group.header.content="slotData"
        >
          <!-- eslint-disable-next-line vue/require-explicit-slots -- defined via Partial<Record<...>> in defineSlots -->
          <slot
            name="group.header.content"
            v-bind="slotData"
          />
        </template>
      </RuiDataTableGroupRow>
      <RuiDataTableRow
        v-else
        :key="`row-${getRowId(row)}`"
        :row="row"
        :index="index"
      >
        <template
          v-for="key in itemSlotKeys"
          #[`item.${key}`]="slotData"
        >
          <!-- eslint-disable-next-line vue/require-explicit-slots -- defined via Partial<Record<...>> in defineSlots -->
          <slot
            :name="`item.${key}`"
            v-bind="slotData"
          />
        </template>
        <template
          v-if="$slots['expanded-item']"
          #expanded-item="slotData"
        >
          <!-- eslint-disable-next-line vue/require-explicit-slots -- defined via Partial<Record<...>> in defineSlots -->
          <slot
            name="expanded-item"
            v-bind="slotData"
          />
        </template>
      </RuiDataTableRow>
    </template>
    <RuiDataTableLoadingRow v-if="loading && noData" />
    <RuiDataTableEmptyRow
      v-if="noData && empty && !loading && !showError"
      :empty="empty"
    >
      <template
        v-if="$slots['no-data']"
        #no-data
      >
        <!-- eslint-disable-next-line vue/require-explicit-slots -- defined via Partial<Record<...>> in defineSlots -->
        <slot name="no-data" />
      </template>
      <template
        v-if="$slots['empty-description']"
        #empty-description
      >
        <!-- eslint-disable-next-line vue/require-explicit-slots -- defined via Partial<Record<...>> in defineSlots -->
        <slot name="empty-description" />
      </template>
    </RuiDataTableEmptyRow>
    <!-- eslint-disable-next-line vue/require-explicit-slots -- defined via Partial<Record<...>> in defineSlots -->
    <slot
      v-if="$slots['body.append']"
      :colspan="colspan"
      name="body.append"
    />
  </tbody>
</template>
