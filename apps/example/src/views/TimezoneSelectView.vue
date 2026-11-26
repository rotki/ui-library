<script setup lang="ts">
import { RuiTimezoneSelect } from '@rotki/ui-library';
import { objectOmit } from '@vueuse/shared';
import { type ExtractPropTypes, ref } from 'vue';
import ComponentView from '@/components/ComponentView.vue';

type RuiTimezoneSelectProps = ExtractPropTypes<typeof RuiTimezoneSelect['props']>;

const timezoneSelects = ref<RuiTimezoneSelectProps[]>([
  {
    modelValue: undefined,
  },
  {
    modelValue: 'Europe/Madrid',
  },
  {
    clearable: true,
    modelValue: 'America/New_York',
  },
  {
    disabled: true,
    modelValue: 'UTC',
  },
  {
    dense: true,
    modelValue: 'Asia/Tokyo',
  },
  {
    errorMessages: ['A timezone is required'],
    modelValue: undefined,
  },
]);
</script>

<template>
  <ComponentView data-id="timezone-selects">
    <template #title>
      Timezone Select
    </template>
    <div class="grid gap-6 grid-cols-2">
      <RuiTimezoneSelect
        v-for="(field, i) in timezoneSelects"
        :key="i"
        v-model="field.modelValue"
        :data-id="`timezone-select-${i}`"
        v-bind="objectOmit(field, ['modelValue'])"
      />
    </div>
  </ComponentView>
</template>
