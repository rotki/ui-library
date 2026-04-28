<script setup lang="ts">
import type { ExtractPropTypes } from 'vue';
import { RuiButton, RuiDateTimePicker, RuiMenu } from '@rotki/ui-library';
import { objectOmit } from '@vueuse/shared';
import ComponentView from '@/components/ComponentView.vue';

type RuiDateTimePickerProps = ExtractPropTypes<typeof RuiDateTimePicker['props']>;

const timePickers = ref<RuiDateTimePickerProps[]>([{
  modelValue: new Date(2023, 0, 2, 20, 20),
}]);

const parentMenuOpen = ref<boolean>(false);
const pickerMenuOpen = ref<boolean>(false);
const insideMenuValue = ref<Date | undefined>(new Date(2023, 0, 2, 20, 20));
</script>

<template>
  <ComponentView data-id="timepickers">
    <template #title>
      DateTime Pickers
    </template>
    <div>
      <RuiDateTimePicker
        v-for="(field, i) in timePickers"
        :key="i"
        v-model="field.modelValue"
        v-bind="objectOmit(field, ['modelValue'])"
      />
    </div>
    <div
      class="mt-8"
      data-id="picker-inside-menu-section"
    >
      <h3 class="text-lg font-semibold mb-4">
        Inside Parent Menu
      </h3>
      <RuiMenu
        v-model="parentMenuOpen"
        :persistent="pickerMenuOpen"
        :close-on-content-click="false"
      >
        <template #activator="{ attrs }">
          <RuiButton
            v-bind="attrs"
            data-id="parent-menu-activator"
          >
            Open parent menu
          </RuiButton>
        </template>
        <div
          class="p-4 w-[360px]"
          data-id="parent-menu-content"
        >
          <RuiDateTimePicker
            v-model="insideMenuValue"
            v-model:menu-open="pickerMenuOpen"
            data-id="picker-inside-menu"
            variant="outlined"
          />
        </div>
      </RuiMenu>
    </div>
  </ComponentView>
</template>
