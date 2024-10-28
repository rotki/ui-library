<script lang="ts" setup>
import {
  type BadgeProps,
  RuiBadge,
  RuiButton,
} from '@rotki/ui-library/components';
import ComponentView from '@/components/ComponentView.vue';

const defaultModelValue = true;
const defaultText = '1';
const icon = 'star-fill';
const placement = 'bottom';
const colors = ['default', 'primary', 'secondary', 'error', 'warning', 'info', 'success'] as const;

const badges = ref<BadgeProps[]>();

function createBadge(color: typeof colors[number], options: Partial<BadgeProps> = {}): BadgeProps {
  return {
    modelValue: defaultModelValue,
    text: defaultText,
    color,
    ...options,
  };
}

function generateBadges(): BadgeProps[] {
  return [
    ...colors.map(color => createBadge(color)),
    ...colors.map(color => createBadge(color, { placement })),
    ...colors.map(color => createBadge(color, { left: true })),
    ...colors.map(color => createBadge(color, { left: true, placement })),
    ...colors.map(color => createBadge(color, { icon })),
    ...colors.map(color => createBadge(color, { placement, icon })),
    ...colors.map(color => createBadge(color, { left: true, icon, offsetX: -20 })),
    ...colors.map(color => createBadge(color, { left: true, placement, icon, offsetX: -20 })),
    ...colors.map(color => createBadge(color, { icon, text: undefined })),
    ...colors.map(color => createBadge(color, { icon, text: undefined, placement })),
    ...colors.map(color => createBadge(color, { icon, text: undefined, left: true })),
    ...colors.map(color => createBadge(color, { icon, text: undefined, left: true, placement })),
    ...colors.map(color => createBadge(color, { dot: true })),
    ...colors.map(color => createBadge(color, { dot: true, placement })),
    ...colors.map(color => createBadge(color, { dot: true, left: true })),
    ...colors.map(color => createBadge(color, { dot: true, left: true, placement })),
  ];
}

onBeforeMount(() => {
  set(badges, generateBadges());
});
</script>

<template>
  <ComponentView data-cy="badges">
    <template #title>
      Badges
    </template>

    <div class="grid gap-6 grid-cols-3 lg:grid-cols-7">
      <div
        v-for="(badge, i) in badges"
        :key="i"
        class="p-4"
      >
        <RuiBadge
          v-bind="badge"
          :data-cy="`badge-${i}`"
        >
          <RuiButton @click="badge.modelValue = !badge.modelValue">
            Badge
          </RuiButton>
        </RuiBadge>
      </div>
    </div>
  </ComponentView>
</template>
