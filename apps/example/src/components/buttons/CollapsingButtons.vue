<script lang="ts" setup>
import { type ButtonProps, RuiButton, RuiIcon, type RuiIcons } from '@rotki/ui-library';

interface ToolbarButton {
  label: string;
  icon: RuiIcons;
  size?: ButtonProps['size'];
  variant?: ButtonProps['variant'];
}

const buttons: ToolbarButton[] = [
  { icon: 'lu-refresh-ccw', label: 'Refresh', variant: 'outlined' },
  { icon: 'lu-file-down', label: 'Export', variant: 'text' },
  { icon: 'lu-plus', label: 'Add account' },
  { icon: 'lu-settings', label: 'Settings', size: 'sm', variant: 'outlined' },
];
</script>

<template>
  <div class="mb-14">
    <h3 class="text-h6 mb-3">
      Collapse below lg
    </h3>
    <div
      class="flex items-center gap-2"
      data-id="collapsing-toolbar"
    >
      <RuiButton
        v-for="button in buttons"
        :key="button.label"
        :variant="button.variant"
        :size="button.size"
        color="primary"
        collapse-below="lg"
        :data-id="`collapsing-${button.label.toLowerCase().replace(' ', '-')}`"
      >
        <template #prepend>
          <RuiIcon :name="button.icon" />
        </template>
        {{ button.label }}
      </RuiButton>
    </div>
  </div>
</template>
