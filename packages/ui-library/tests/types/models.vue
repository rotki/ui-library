<script setup lang="ts">
/*
 * Checked by `vue-tsc -p tsconfig.strict-templates.json`, never rendered. A `v-model` takes a ref of
 * exactly the type the component emits: no `undefined` it never sends, and the single or multiple
 * shape the binding asks for.
 */
import {
  type DataTableColumn,
  type DataTableSortColumn,
  type DataTableSortData,
  RuiAccordion,
  RuiAccordions,
  RuiAutoComplete,
  RuiButton,
  RuiButtonGroup,
  RuiDataTable,
  RuiDateTimePicker,
  RuiFileUpload,
  RuiMenuSelect,
  RuiRadio,
  RuiRadioGroup,
  RuiTab,
  RuiTabs,
  type TablePaginationData,
} from '@/components';

interface Row {
  id: number;
  name: string;
}

const options: Row[] = [{ id: 1, name: 'one' }];
const columns: DataTableColumn<Row>[] = [{ key: 'name', label: 'Name' }];

const id = ref<number>(1);
const optionalId = ref<number | undefined>();
const ids = ref<number[]>([]);
const name = ref<string>('one');

const radio = ref<string>('a');

const single = ref<number>(1);
const optionalSingle = ref<number | undefined>();
const multiple = ref<number[]>([]);

const file = ref<File | undefined>();
const files = ref<File[]>([]);

const panel = ref<number>(0);
const panels = ref<number[]>([]);

const tab = ref<string>('a');
const literalTab = ref<'a' | 'b'>('a');
const numericTab = ref<number>(0);

const epoch = ref<number | undefined>();
const date = ref<Date | undefined>();

const selected = ref<number[]>([]);
const expanded = ref<Row[]>([]);
const pagination = ref<TablePaginationData>({ page: 1, total: 0, limit: 10 });
const sort = ref<DataTableSortData<Row>>([]);
const sortColumns = ref<DataTableSortColumn<Row>[] | DataTableSortColumn<Row>>([]);
const collapsed = ref<Row[]>([]);

const flag = ref<boolean>(false);
</script>

<template>
  <RuiMenuSelect
    v-model="id"
    :options="options"
    key-attr="id"
    text-attr="name"
  />
  <RuiMenuSelect
    v-model="optionalId"
    :options="options"
    key-attr="id"
    text-attr="name"
    clearable
  />

  <RuiAutoComplete
    v-model="id"
    :options="options"
    key-attr="id"
    text-attr="name"
  />
  <RuiAutoComplete
    v-model="ids"
    :options="options"
    key-attr="id"
    text-attr="name"
  />
  <RuiAutoComplete
    v-model="name"
    :options="['one', 'two']"
  />

  <RuiRadioGroup v-model="radio">
    <RuiRadio value="a" />
  </RuiRadioGroup>

  <RuiButtonGroup
    v-model="single"
    required
  >
    <RuiButton :model-value="1" />
  </RuiButtonGroup>
  <RuiButtonGroup v-model="optionalSingle">
    <RuiButton :model-value="1" />
  </RuiButtonGroup>
  <RuiButtonGroup v-model="multiple">
    <RuiButton :model-value="1" />
  </RuiButtonGroup>

  <RuiFileUpload v-model="file" />
  <RuiFileUpload
    v-model="files"
    multiple
  />

  <RuiAccordions v-model="panel">
    <RuiAccordion />
  </RuiAccordions>
  <RuiAccordions
    v-model="panels"
    multiple
  >
    <RuiAccordion />
  </RuiAccordions>

  <RuiTabs v-model="tab">
    <RuiTab value="a" />
  </RuiTabs>
  <RuiTabs v-model="literalTab">
    <RuiTab value="a" />
  </RuiTabs>
  <RuiTabs v-model="numericTab">
    <RuiTab />
  </RuiTabs>

  <RuiDateTimePicker v-model="epoch" />
  <RuiDateTimePicker
    v-model="epoch"
    type="epoch"
  />
  <RuiDateTimePicker
    v-model="date"
    type="date"
  />

  <RuiDataTable
    v-model="selected"
    v-model:expanded="expanded"
    v-model:pagination="pagination"
    v-model:sort="sort"
    v-model:collapsed="collapsed"
    :rows="options"
    :cols="columns"
    row-attr="id"
  />
  <RuiDataTable
    v-model:sort="sortColumns"
    :rows="options"
    :cols="columns"
    row-attr="id"
  />

  <!-- @vue-expect-error a tab value is a string or a number -->
  <RuiTabs v-model="flag" />
  <!-- @vue-expect-error the picker emits an epoch when no type is given, not a Date -->
  <RuiDateTimePicker v-model="date" />
</template>
