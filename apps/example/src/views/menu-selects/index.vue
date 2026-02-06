<script lang="ts" setup>
import { RuiCard, RuiIcon } from '@rotki/ui-library/components';
import { RouterLink } from 'vue-router';

const sections = [
  {
    title: 'Basic',
    description: 'Variants, disabled, loading, messages, required, hint',
    route: '/menu-selects/basic',
    icon: 'lu-list',
  },
  {
    title: 'Selection',
    description: 'Select, clearable, autoSelectFirst, keyboard nav',
    route: '/menu-selects/selection',
    icon: 'lu-pointer',
  },
  {
    title: 'Read-only',
    description: 'Read-only variants',
    route: '/menu-selects/readonly',
    icon: 'lu-lock',
  },
  {
    title: 'Custom',
    description: 'Custom activator, selection, item slots',
    route: '/menu-selects/custom',
    icon: 'lu-settings',
  },
];
</script>

<template>
  <div data-cy="menu-selects-index">
    <h2 class="text-2xl font-bold mb-6">
      Menu Selects
    </h2>

    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      <RouterLink
        v-for="section in sections"
        :key="section.route"
        :to="section.route"
        class="no-underline"
      >
        <RuiCard
          variant="outlined"
          class="h-full hover:border-primary transition-colors cursor-pointer"
          :data-cy="`link-${section.route}`"
        >
          <template #header>
            <div class="flex items-center gap-2">
              <RuiIcon
                :name="section.icon"
                class="text-primary"
              />
              <span>{{ section.title }}</span>
            </div>
          </template>
          <p class="text-sm text-rui-text-secondary">
            {{ section.description }}
          </p>
        </RuiCard>
      </RouterLink>
    </div>
  </div>
</template>
