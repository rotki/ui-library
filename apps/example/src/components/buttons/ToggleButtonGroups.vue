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
    data-cy="toggleable-button-groups"
  >
    <template #title>
      Toggleable Button Groups
    </template>

    <template #item="{ item: buttonGroup }">
      <RuiButtonGroup
        v-bind="objectOmit(buttonGroup, ['modelValue', 'count', 'rounded'])"
        v-model="buttonGroup.modelValue"
      >
        <RuiButton>
          <RuiIcon name="lu-text-align-start" />
        </RuiButton>
        <RuiButton>
          <RuiIcon name="lu-text-align-center" />
        </RuiButton>
        <RuiButton>
          <RuiIcon name="lu-text-align-end" />
        </RuiButton>
        <RuiButton>
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
