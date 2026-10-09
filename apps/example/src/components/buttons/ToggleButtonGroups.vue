<script setup lang='ts'>
import { RuiButton, RuiButtonGroup, RuiIcon } from '@rotki/ui-library';
import { objectOmit } from '@vueuse/shared';
import ComponentGroup from '@/components/ComponentGroup.vue';
import { type ButtonGroupData, generateButtonGroupData } from '@/utils/buttons';

const attributes: Partial<ButtonGroupData>[] = [
  { activeColor: 'warning' },
  { required: true, activeColor: 'warning' },
  { disabled: true },
  { required: true, disabled: true },
  { },
  { required: true },
  { vertical: true },
  { vertical: true, variant: 'outlined' },
  { variant: 'outlined' },
  { variant: 'text' },
  { variant: 'segmented' },
  { required: true, variant: 'segmented' },
];

const toggleButtons = ref<ButtonGroupData[]>([]);

onBeforeMount(() => {
  set(toggleButtons, generateButtonGroupData(attributes, 0));
});
</script>

<template>
  <ComponentGroup
    :items="toggleButtons"
    class="grid gap-4 grid-rows-2 grid-cols-2 justify-items-start mb-14"
    data-id="toggleable-button-groups"
  >
    <template #title>
      Toggleable Button Groups
    </template>

    <template #item="{ item: buttonGroup }">
      <RuiButtonGroup
        v-bind="objectOmit(buttonGroup, ['modelValue', 'count', 'rounded'])"
        v-model="buttonGroup.modelValue"
      >
        <RuiButton :model-value="0">
          <RuiIcon name="lu-text-align-start" />
        </RuiButton>
        <RuiButton :model-value="1">
          <RuiIcon name="lu-text-align-center" />
        </RuiButton>
        <RuiButton :model-value="2">
          <RuiIcon name="lu-text-align-end" />
        </RuiButton>
        <RuiButton :model-value="3">
          <RuiIcon name="lu-text-align-justify" />
        </RuiButton>
      </RuiButtonGroup>
      <div
        v-if="buttonGroup.required"
        class="mt-2 text-rui-error"
      >
        required: *
      </div>
    </template>
  </ComponentGroup>
</template>
