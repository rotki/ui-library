<script lang="ts" setup>
import { type AlertProps, RuiAlert } from '@rotki/ui-library';
import ComponentView from '@/components/ComponentView.vue';

type AlertData = Omit<
  AlertProps & { clicks?: number; closed?: boolean },
  'title' | 'description'
>;

const alerts = ref<AlertData[]>([
  { type: 'primary', icon: 'information-line' },
  { type: 'secondary', icon: 'information-line' },
  { type: 'error' },
  { type: 'warning' },
  { type: 'info' },
  { type: 'success' },

  { variant: 'filled', type: 'primary', icon: 'information-line' },
  { variant: 'filled', type: 'secondary', icon: 'information-line' },
  { variant: 'filled', type: 'error' },
  { variant: 'filled', type: 'warning' },
  { variant: 'filled', type: 'info' },
  { variant: 'filled', type: 'success' },

  { variant: 'outlined', type: 'primary', icon: 'information-line' },
  {
    variant: 'outlined',
    type: 'secondary',
    icon: 'information-line',
  },
  { variant: 'outlined', type: 'error' },
  { variant: 'outlined', type: 'warning' },
  { variant: 'outlined', type: 'info' },
  { variant: 'outlined', type: 'success' },

  {
    clicks: 0,
    type: 'primary',
    icon: 'information-line',
  },
  {
    clicks: 0,
    type: 'secondary',
    icon: 'information-line',
  },
  { clicks: 0, type: 'error' },
  { clicks: 0, type: 'warning' },
  { clicks: 0, type: 'info' },
  { clicks: 0, type: 'success' },

  {
    clicks: 0,
    closeable: true,
    type: 'primary',
    icon: 'information-line',
  },
  {
    clicks: 0,
    closeable: true,
    closed: false,
    type: 'secondary',
    icon: 'information-line',
  },
  {
    clicks: 0,
    closeable: true,
    closed: false,
    type: 'error',
  },
  {
    clicks: 0,
    closeable: true,
    closed: false,
    type: 'warning',
  },
  {
    clicks: 0,
    closeable: true,
    closed: false,
    type: 'info',
  },
  {
    clicks: 0,
    closeable: true,
    closed: false,
    type: 'success',
  },
]);
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
