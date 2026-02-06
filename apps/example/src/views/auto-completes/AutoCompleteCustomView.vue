<script lang="ts" setup>
import {
  RuiAutoComplete,
  RuiButton,
  RuiIcon,
} from '@rotki/ui-library/components';
import { ref } from 'vue';
import { createOptions, type SelectOption } from '@/data/options';

const options = createOptions();

const activatorValue = ref<number | undefined>(undefined);
const itemValue = ref<number | undefined>(undefined);

function getDisplayText(value?: SelectOption | SelectOption[]): string {
  const defaultText = 'Choose Option';
  return (Array.isArray(value) ? value?.[0]?.label?.toString() : value?.label?.toString()) ?? defaultText;
}
</script>

<template>
  <div data-cy="auto-completes-custom">
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
          data-cy="ac-custom-activator"
        >
          <template #activator="{ attrs, disabled, open, value }">
            <RuiButton
              class="!rounded-md border"
              variant="list"
              :disabled="disabled"
              v-bind="{ ...attrs, 'data-cy': 'activator' }"
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
          data-cy="ac-custom-item"
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
    </div>
  </div>
</template>
