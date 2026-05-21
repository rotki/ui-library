<script lang="ts" setup>
import { RuiAutoComplete, RuiChip } from '@rotki/ui-library/components';

interface CountryOption {
  id: number;
  label: string;
  continent: string;
  disabled?: boolean;
}

const countries: CountryOption[] = [
  { continent: 'Europe', id: 1, label: 'Germany' },
  { continent: 'Europe', id: 2, label: 'France' },
  { continent: 'Europe', id: 3, label: 'Spain' },
  { continent: 'Asia', id: 4, label: 'India' },
  { continent: 'Asia', id: 5, label: 'Indonesia' },
  { continent: 'Africa', id: 6, label: 'Nigeria' },
];

const flatOptions: CountryOption[] = [
  { continent: 'Europe', id: 1, label: 'Germany' },
  { continent: 'Europe', disabled: true, id: 2, label: 'France (disabled)' },
  { continent: 'Europe', id: 3, label: 'Spain' },
  { continent: 'Asia', disabled: true, id: 4, label: 'India (disabled)' },
  { continent: 'Asia', id: 5, label: 'Indonesia' },
];

const groupedValue = ref<number>();
const groupedFnValue = ref<number>();

function groupByContinentUpper(item: CountryOption): string {
  return item.continent.toUpperCase();
}
const customHeaderValue = ref<number>();
const disabledValue = ref<number>();
const groupedDisabledValue = ref<number>();
</script>

<template>
  <div data-id="auto-completes-grouping">
    <h2 class="text-2xl font-bold mb-6">
      Grouping &amp; Disabled Items
    </h2>

    <div class="grid gap-6 grid-cols-2">
      <div class="py-4">
        <RuiAutoComplete
          v-model="groupedValue"
          clearable
          :options="countries"
          group-by="continent"
          key-attr="id"
          text-attr="label"
          label="Grouped by string key"
          data-id="ac-grouping-string"
        />
      </div>

      <div class="py-4">
        <RuiAutoComplete
          v-model="groupedFnValue"
          clearable
          :options="countries"
          :group-by="groupByContinentUpper"
          key-attr="id"
          text-attr="label"
          label="Grouped by function (uppercased)"
          data-id="ac-grouping-fn"
        />
      </div>

      <div class="py-4">
        <RuiAutoComplete
          v-model="customHeaderValue"
          clearable
          :options="countries"
          group-by="continent"
          key-attr="id"
          text-attr="label"
          label="Custom #group-header slot"
          data-id="ac-grouping-custom-header"
        >
          <template #group-header="{ group, items }">
            <div
              class="px-3 py-2 bg-rui-primary/10 flex items-center justify-between"
              :data-id="`custom-header-${group}`"
            >
              <span class="font-bold text-rui-primary">{{ group }}</span>
              <RuiChip size="sm">
                {{ items.length }}
              </RuiChip>
            </div>
          </template>
        </RuiAutoComplete>
      </div>

      <div class="py-4">
        <RuiAutoComplete
          v-model="disabledValue"
          clearable
          :options="flatOptions"
          item-disabled="disabled"
          key-attr="id"
          text-attr="label"
          label="Flat list with disabled items"
          data-id="ac-grouping-disabled"
        />
      </div>

      <div class="py-4">
        <RuiAutoComplete
          v-model="groupedDisabledValue"
          clearable
          :options="flatOptions"
          group-by="continent"
          item-disabled="disabled"
          key-attr="id"
          text-attr="label"
          label="Grouped with disabled items"
          data-id="ac-grouping-grouped-disabled"
        />
      </div>
    </div>
  </div>
</template>
