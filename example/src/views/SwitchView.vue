<script lang="ts" setup>
import ComponentGroup from '@/components/ComponentGroup.vue';
import ComponentView from '@/components/ComponentView.vue';
import { RuiSwitch, type SwitchProps } from '@rotki/ui-library';

type SwitchData = SwitchProps & {
  value?: boolean;
};

const colors = ['primary', 'secondary', 'error', 'warning', 'info', 'success'] as const;
const attributes: Partial<SwitchData>[] = [
  { value: false },
  { value: true },
  { value: false, size: 'sm' },
  { value: false, disabled: true },
  { value: true, disabled: true },
  { value: false, hint: 'Switch hint' },
  { value: false, errorMessages: ['Switch error message'] },
  { value: false, successMessages: ['Switch success message'] },
];

const switches = ref<SwitchData[]>([]);

function createSwitch(color: typeof colors[number], options: Partial<SwitchData>): SwitchData {
  return {
    color,
    ...options,
  };
}

function generateSwitches(): SwitchData[] {
  const switches: SwitchData[] = [];
  for (const attrs of attributes) {
    for (const color of colors) {
      switches.push(createSwitch(color, attrs));
    }
  }
  return switches;
}

onBeforeMount(() => {
  set(switches, generateSwitches());
});
</script>

<template>
  <ComponentView data-cy="switches">
    <template #title>
      Switches
    </template>

    <ComponentGroup
      :items="switches"
      class="grid gap-3 grid-rows-2 grid-cols-6"
    >
      <template #item="{ item }">
        <RuiSwitch
          v-model="item.value"
          v-bind="item"
        >
          <span class="capitalize"> {{ item.color }} </span>
        </RuiSwitch>
      </template>
    </ComponentGroup>
  </ComponentView>
</template>
