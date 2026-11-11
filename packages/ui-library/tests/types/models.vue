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
  RuiSimpleSelect,
  RuiTab,
  RuiTabItem,
  RuiTabItems,
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
const nullableName = ref<string | null>(null);

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
const nullableEpoch = ref<number | null>(null);
const nullableDate = ref<Date | null>(null);
const date = ref<Date | undefined>();

const selected = ref<number[]>([]);
const expanded = ref<Row[]>([]);
const pagination = ref<TablePaginationData>({ page: 1, total: 0, limit: 10 });
const sort = ref<DataTableSortData<Row>>([]);
const sortColumns = ref<DataTableSortColumn<Row>[] | DataTableSortColumn<Row>>([]);
const sortSingle = ref<DataTableSortColumn<Row>>({ column: 'name', direction: 'asc' });
const sortMultiple = ref<DataTableSortColumn<Row>[]>([]);
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
  <RuiMenuSelect
    v-model="name"
    :options="[{ id: 'one' }]"
    key-attr="id"
    clearable
    value-on-clear=""
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
  <RuiAutoComplete
    v-model="name"
    :options="['one', 'two']"
    clearable
    value-on-clear=""
  />
  <RuiAutoComplete
    v-model="nullableName"
    :options="['one', 'two']"
    clearable
    :value-on-clear="null"
  />
  <RuiAutoComplete
    v-model="optionalId"
    :options="options"
    key-attr="id"
    text-attr="name"
    clearable
  />
  <RuiAutoComplete
    v-model="optionalId"
    :options="options"
    key-attr="id"
    text-attr="name"
    :clearable="flag"
  />
  <RuiAutoComplete
    v-model="ids"
    :options="options"
    key-attr="id"
    text-attr="name"
    clearable
  />

  <RuiRadioGroup v-model="radio">
    <RuiRadio value="a" />
  </RuiRadioGroup>
  <RuiRadio
    v-model="radio"
    value="a"
  />

  <RuiSimpleSelect
    v-model="name"
    :options="['one', 'two']"
  />
  <RuiSimpleSelect
    v-model="id"
    :options="[1, 2]"
  />

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
  <RuiTabItems v-model="tab">
    <RuiTabItem value="a" />
  </RuiTabItems>
  <RuiTabItems v-model="numericTab">
    <RuiTabItem />
  </RuiTabItems>

  <RuiDateTimePicker v-model="epoch" />
  <RuiDateTimePicker
    v-model="epoch"
    type="epoch"
  />
  <RuiDateTimePicker
    v-model="date"
    type="date"
  />
  <RuiDateTimePicker
    v-model="nullableEpoch"
    allow-empty
    :value-on-clear="null"
  />
  <RuiDateTimePicker
    v-model="nullableDate"
    type="date"
    allow-empty
    :value-on-clear="null"
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

  <RuiDataTable
    v-model:sort="sortSingle"
    :rows="options"
    :cols="columns"
    row-attr="id"
  />
  <RuiDataTable
    v-model:sort="sortMultiple"
    :rows="options"
    :cols="columns"
    row-attr="id"
  />

  <!-- @vue-expect-error a number model cannot take the strings these options update it to -->
  <RuiSimpleSelect
    v-model="id"
    :options="['one']"
  />
  <!-- @vue-expect-error a tab value is a string or a number -->
  <RuiTabs v-model="flag" />
  <!-- @vue-expect-error a clearable select sends undefined unless it has a clear value -->
  <RuiAutoComplete
    v-model="name"
    :options="['one', 'two']"
    clearable
  />
  <!-- @vue-expect-error a clearable bound to a boolean may be on, so the update may be undefined -->
  <RuiAutoComplete
    v-model="id"
    :options="options"
    key-attr="id"
    text-attr="name"
    :clearable="flag"
  />
  <!-- @vue-expect-error a clearable select sends undefined unless it has a clear value -->
  <RuiMenuSelect
    v-model="id"
    :options="options"
    key-attr="id"
    text-attr="name"
    clearable
  />
  <!-- @vue-expect-error clearing sends null, which a string model cannot take -->
  <RuiAutoComplete
    v-model="name"
    :options="['one', 'two']"
    clearable
    :value-on-clear="null"
  />
  <!-- @vue-expect-error the picker emits an epoch when no type is given, not a Date -->
  <RuiDateTimePicker v-model="date" />
  <!-- @vue-expect-error clearing still sends undefined without a clear value -->
  <RuiDateTimePicker
    v-model="nullableEpoch"
    allow-empty
  />
</template>
