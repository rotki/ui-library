<script lang="ts" setup>
import { RuiSwitch, type SwitchProps } from '@rotki/ui-library';
import ComponentGroup from '@/components/ComponentGroup.vue';
import ComponentView from '@/components/ComponentView.vue';

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

const underLabel = ref<{ sync: boolean; notify: boolean; wrap: boolean }>({ sync: true, notify: false, wrap: false });

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
  <ComponentView data-id="switches">
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

    <h4 class="mt-10 mb-3">
      Details under the label
    </h4>
    <div class="flex gap-10">
      <div
        class="flex flex-col w-80"
        data-id="switch-under-label"
      >
        <RuiSwitch
          v-model="underLabel.sync"
          label="Sync balances on start"
          hint="Refreshes every account when the app opens"
          details="auto"
          details-under-label
          data-id="switch-under-label-md"
        />
        <RuiSwitch
          v-model="underLabel.notify"
          size="sm"
          label="Notify me about new versions"
          error-messages="Could not reach the update server"
          details="auto"
          details-under-label
          data-id="switch-under-label-sm"
        />
      </div>
      <div class="w-40">
        <RuiSwitch
          v-model="underLabel.wrap"
          label="Show the long version of this label"
          hint="A hint under two lines"
          details="auto"
          details-under-label
          data-id="switch-under-label-wrap"
        />
      </div>
    </div>
  </ComponentView>
</template>
