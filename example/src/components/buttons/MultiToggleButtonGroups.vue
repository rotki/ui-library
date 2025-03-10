<script setup lang='ts'>
import type { ButtonGroupData } from '@/utils/buttons';
import ComponentGroup from '@/components/ComponentGroup.vue';
import { RuiButton, RuiButtonGroup, RuiIcon } from '@rotki/ui-library';
import { objectOmit } from '@vueuse/shared';

const attributes: Partial<ButtonGroupData>[] = [
  { activeColor: 'warning', required: true },
  { disabled: true, required: true },
  { vertical: true },
  { variant: 'outlined' },
  { variant: 'text' },
];

const multipleToggleButtons = ref<ButtonGroupData[]>([]);

onBeforeMount(() => {
  set(multipleToggleButtons, generateButtonGroupData(attributes, ['center']));
});
</script>

<template>
  <ComponentGroup
    :items="multipleToggleButtons"
    data-cy="multiple-toggleable-button-groups"
    class="grid gap-4 grid-rows-2 grid-cols-2 justify-items-start"
  >
    <template #title>
      Multiple Toggleable Button Groups
    </template>

    <template #item="{ item: buttonGroup }">
      <RuiButtonGroup
        v-bind="objectOmit(buttonGroup, ['modelValue', 'count', 'rounded'])"
        v-model="buttonGroup.modelValue"
      >
        <RuiButton model-value="left">
          <RuiIcon name="lu-align-left" />
        </RuiButton>
        <RuiButton model-value="center">
          <RuiIcon name="lu-align-center" />
        </RuiButton>
        <RuiButton model-value="right">
          <RuiIcon name="lu-align-right" />
        </RuiButton>
        <RuiButton model-value="justify">
          <RuiIcon name="lu-align-justify" />
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
