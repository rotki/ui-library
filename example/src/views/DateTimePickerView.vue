<script setup lang="ts">
import type { ExtractPropTypes } from 'vue';
import ComponentView from '@/components/ComponentView.vue';
import { RuiDateTimePicker } from '@rotki/ui-library';
import { objectOmit } from '@vueuse/shared';

type RuiDateTimePickerProps = ExtractPropTypes<typeof RuiDateTimePicker['props']>;

const timePickers = ref<RuiDateTimePickerProps[]>([{
  modelValue: new Date(2023, 0, 2, 20, 20),
}]);
</script>

<template>
  <ComponentView data-cy="timepickers">
    <template #title>
      Time Pickers
    </template>
    <div>
      <RuiDateTimePicker
        v-for="(field, i) in timePickers"
        :key="i"
        v-model="field.modelValue"
        v-bind="objectOmit(field, ['modelValue'])"
      />
    </div>
  </ComponentView>
</template>
