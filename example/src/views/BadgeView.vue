<script lang="ts" setup>
import {
  type BadgeProps,
  RuiBadge,
  RuiButton,
} from '@rotki/ui-library/components';
import ComponentView from '@/components/ComponentView.vue';

const defaultModelValue = true;
const defaultText = '1';
const icon = 'lu-star';
const placement = 'bottom';
const colors = ['default', 'primary', 'secondary', 'error', 'warning', 'info', 'success'] as const;

const attributes: Partial<BadgeProps>[] = [
  {},
  { placement },
  { left: true },
  { left: true, placement },
  { icon },
  { placement, icon },
  { left: true, icon, offsetX: -20 },
  { left: true, placement, icon, offsetX: -20 },
  { icon, text: undefined },
  { icon, text: undefined, placement },
  { icon, text: undefined, left: true },
  { icon, text: undefined, left: true, placement },
  { dot: true },
  { dot: true, placement },
  { dot: true, left: true },
  { dot: true, left: true, placement },
];

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
  const badges: BadgeProps[] = [];
  for (const attribute of attributes) {
    for (const color of colors) {
      badges.push(createBadge(color, attribute));
    }
  }
  return badges;
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
