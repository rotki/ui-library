<script lang="ts" setup>
import { type AlertProps, RuiAlert } from '@rotki/ui-library';
import ComponentView from '@/components/ComponentView.vue';

interface AlertData extends Omit<AlertProps, 'title' | 'description'> {
  clicks?: number;
  closed?: boolean;
}

const colors = ['primary', 'secondary', 'error', 'warning', 'info', 'success'] as const;
const attributes: Partial<AlertData>[] = [
  {},
  { variant: 'filled' },
  { variant: 'outlined' },
  { clicks: 0 },
  { clicks: 0, closeable: true },
];

const alerts = ref<AlertData[]>([]);

function createAlert(type: typeof colors[number], options: Partial<AlertData>): AlertData {
  return {
    type,
    ...options,
    ...(['primary', 'secondary'].includes(type) ? { icon: 'information-line' } : {}),
  };
}

function generateAlerts(): AlertData[] {
  const alerts: AlertData[] = [];
  for (const attrs of attributes) {
    for (const color of colors) {
      alerts.push(createAlert(color, attrs));
    }
  }
  return alerts;
}

onBeforeMount(() => {
  set(alerts, generateAlerts());
});
</script>

<template>
  <ComponentView data-cy="alerts">
    <template #title>
      Alerts
    </template>

    <div class="grid gap-4 grid-rows-2 grid-cols-3">
      <RuiAlert
        v-for="(alert, i) in alerts"
        :key="i"
        :action-text="alert.clicks !== undefined ? 'Action' : ''"
        :title="`${alert.type} ${
          alert.clicks !== undefined ? `(${alert.clicks})` : ''
        } ${alert.closed ? '(Closed)' : ''}`"
        description="Description"
        v-bind="alert"
        @action="alert.clicks !== undefined && alert.clicks++"
        @close="alert.closed = true"
      />
    </div>
  </ComponentView>
</template>
