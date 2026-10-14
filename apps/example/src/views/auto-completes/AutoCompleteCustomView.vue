<script lang="ts" setup>
import {
  RuiAutoComplete,
  RuiButton,
  RuiIcon,
} from '@rotki/ui-library/components';
import { createOptions, type SelectOption } from '@/data/options';

const options = createOptions();

const activatorValue = ref<number>();
const itemValue = ref<number>();
const selectionValue = ref<number>();
const chipPrependValue = ref<number[]>([1, 2]);

function getDisplayText(value?: SelectOption | SelectOption[]): string {
  const defaultText = 'Choose Option';
  return (Array.isArray(value) ? value?.[0]?.label?.toString() : value?.label?.toString()) ?? defaultText;
}
</script>

<template>
  <div data-id="auto-completes-custom">
    <h2 class="text-2xl font-bold mb-6">
      Custom Slots
    </h2>

    <div class="grid gap-6 grid-cols-2">
      <div class="py-4">
        <RuiAutoComplete
          v-model="activatorValue"
          :options="options"
          key-attr="id"
          text-attr="label"
          label="Custom Activator"
          data-id="ac-custom-activator"
        >
          <template #activator="{ attrs, disabled, open, value }">
            <RuiButton
              class="!rounded-md border"
              variant="list"
              :disabled="disabled"
              v-bind="{ ...attrs, 'data-id': 'activator' }"
            >
              {{ getDisplayText(value) }}
              <template #append>
                <RuiIcon
                  class="transition"
                  :class="[{ 'rotate-180': open }]"
                  name="lu-chevron-down"
                  size="24"
                />
              </template>
            </RuiButton>
          </template>
        </RuiAutoComplete>
      </div>

      <div class="py-4">
        <RuiAutoComplete
          v-model="itemValue"
          :options="options"
          key-attr="id"
          text-attr="label"
          :append-width="1.5"
          label="Custom Item"
          data-id="ac-custom-item"
        >
          <template #item.append="{ active }">
            <RuiIcon
              v-if="active"
              class="transition"
              name="lu-check"
              size="24"
            />
          </template>
        </RuiAutoComplete>
      </div>

      <div class="py-4">
        <RuiAutoComplete
          v-model="selectionValue"
          :options="options"
          key-attr="id"
          text-attr="label"
          class="w-56"
          dense
          label="Custom Selection"
          data-id="ac-custom-selection"
        >
          <template #selection="{ item }">
            <div class="flex items-center gap-2">
              <RuiIcon
                name="lu-globe"
                size="16"
              />
              {{ item.label }}
            </div>
          </template>
        </RuiAutoComplete>
      </div>

      <div class="py-4">
        <RuiAutoComplete
          v-model="chipPrependValue"
          :options="options"
          key-attr="id"
          text-attr="label"
          chips
          label="Chip Prepend"
          data-id="ac-custom-chip-prepend"
        >
          <template #selection.prepend>
            <RuiIcon
              name="lu-globe"
              size="16"
              data-id="chip-prepend-icon"
            />
          </template>
        </RuiAutoComplete>
      </div>
    </div>
  </div>
</template>
