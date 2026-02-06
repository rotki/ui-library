<script lang="ts" setup>
import { RuiButton, RuiIcon, RuiMenuSelect } from '@rotki/ui-library';
import { createOptions } from '@/data/options';

const options = createOptions();

const customActivatorValue = ref<number>();
const customSelectionValue = ref<number>();
const customItemValue = ref<number>();
</script>

<template>
  <div data-cy="menu-selects-custom">
    <h2 class="text-2xl font-bold mb-6">
      Menu Selects: Custom Slots
    </h2>

    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      <div class="flex flex-col space-y-2">
        <h4>Custom Activator</h4>
        <RuiMenuSelect
          v-model="customActivatorValue"
          :options="options"
          key-attr="id"
          text-attr="label"
          data-cy="ms-custom-activator"
        >
          <template #activator="{ attrs, disabled, open, value }">
            <RuiButton
              class="!rounded-md border"
              variant="list"
              :disabled="disabled"
              v-bind="{ ...attrs, 'data-cy': 'activator' }"
            >
              {{ value ? value.label : 'Choose option' }}
              <template #append>
                <RuiIcon
                  class="transition"
                  :class="[{ 'rotate-180': open }]"
                  name="lu-chevron-down"
                  size="32"
                />
              </template>
            </RuiButton>
          </template>
        </RuiMenuSelect>
      </div>

      <div class="flex flex-col space-y-2">
        <h4>Custom Selection</h4>
        <RuiMenuSelect
          v-model="customSelectionValue"
          :options="options"
          key-attr="id"
          text-attr="label"
          clearable
          variant="outlined"
          data-cy="ms-custom-selection"
        >
          <template #selection="{ item }">
            {{ item.id }} | {{ item.label }}
          </template>
        </RuiMenuSelect>
      </div>

      <div class="flex flex-col space-y-2">
        <h4>Custom Item Append</h4>
        <RuiMenuSelect
          v-model="customItemValue"
          :options="options"
          key-attr="id"
          text-attr="label"
          :append-width="1.5"
          data-cy="ms-custom-item"
        >
          <template #item.append="{ active }">
            <RuiIcon
              v-if="active"
              class="transition"
              name="lu-check"
              size="24"
              data-cy="check-icon"
            />
          </template>
        </RuiMenuSelect>
      </div>
    </div>
  </div>
</template>
