<script lang="ts" setup>
import { RuiButton, RuiIcon, type RuiIcons } from '@rotki/ui-library';

interface ListItem {
  label: string;
  icon: RuiIcons;
}

const items: ListItem[] = [
  { icon: 'lu-settings', label: 'Settings' },
  { icon: 'lu-user', label: 'Profile' },
  { icon: 'lu-log-out', label: 'Logout' },
];

const sizes = ['xs', 'sm', undefined, 'lg', 'xl', '2xl'] as const;
</script>

<template>
  <div class="mb-14">
    <h3 class="text-h6 mb-3">
      List variant
    </h3>
    <div class="grid gap-6 grid-cols-3">
      <div
        v-for="size in sizes"
        :key="size ?? 'md'"
        class="rounded border border-rui-grey-300 dark:border-rui-grey-700 overflow-hidden w-56"
        :data-id="`list-button-card-${size ?? 'md'}`"
      >
        <div class="px-3 py-2 text-caption text-rui-text-secondary border-b border-rui-grey-200 dark:border-rui-grey-800">
          size: {{ size ?? 'md (default)' }}
        </div>
        <RuiButton
          v-for="item in items"
          :key="item.label"
          variant="list"
          :size="size"
          :data-id="`list-button-${size ?? 'md'}-${item.label.toLowerCase()}`"
        >
          <template #prepend>
            <RuiIcon :name="item.icon" />
          </template>
          {{ item.label }}
        </RuiButton>
      </div>
    </div>
  </div>
</template>
