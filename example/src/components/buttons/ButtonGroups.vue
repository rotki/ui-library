<script setup lang='ts'>
import { objectOmit } from '@vueuse/shared';
import { RuiButton, RuiButtonGroup, RuiIcon } from '@rotki/ui-library';
import ComponentGroup from '@/components/ComponentGroup.vue';
import { type ButtonGroupData, generateButtonGroupData } from '@/utils/buttons';

const attributes: Partial<ButtonGroupData>[] = [
  {},
  { vertical: true },
  { variant: 'outlined' },
  { variant: 'text' },
  { variant: 'outlined', size: 'lg' },
  { variant: 'outlined', size: 'lg', rounded: true },
  { variant: 'outlined', size: 'sm' },
  { variant: 'outlined', size: 'sm', rounded: true },
];

const buttonGroups = ref<ButtonGroupData[]>([]);

onBeforeMount(() => {
  set(buttonGroups, generateButtonGroupData(attributes));
});
</script>

<template>
  <ComponentGroup
    data-cy="button-groups"
    class="grid gap-4 grid-rows-2 grid-cols-2 justify-items-start mb-14"
    :items="buttonGroups"
  >
    <template #title>
      Button Groups
    </template>

    <template #item="{ item: buttonGroup }">
      <RuiButtonGroup v-bind="objectOmit(buttonGroup, ['count', 'rounded'])">
        <RuiButton @click="buttonGroup.count--">
          Decrease
        </RuiButton>
        <RuiButton @click="buttonGroup.count++">
          Increase
        </RuiButton>
        <RuiButton @click="buttonGroup.count++">
          <RuiIcon name="add-fill" />
        </RuiButton>
      </RuiButtonGroup>
      <div class="mt-2">
        Counts: {{ buttonGroup.count }}
      </div>
    </template>
  </ComponentGroup>
</template>
