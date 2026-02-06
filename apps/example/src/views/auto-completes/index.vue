<script lang="ts" setup>
import { RuiCard, RuiIcon } from '@rotki/ui-library/components';
import { RouterLink } from 'vue-router';

const sections = [
  {
    title: 'Basic',
    description: 'Variants, disabled, loading, messages, required',
    route: '/auto-completes/basic',
    icon: 'lu-text-cursor-input',
  },
  {
    title: 'Selection',
    description: 'Single/multi select, chips, clearable, hide selected',
    route: '/auto-completes/selection',
    icon: 'lu-square-check',
  },
  {
    title: 'Search',
    description: 'Filtering, custom values, no-data states, placeholder',
    route: '/auto-completes/search',
    icon: 'lu-search',
  },
  {
    title: 'Read-only',
    description: 'Read-only variants with pre-selected values',
    route: '/auto-completes/readonly',
    icon: 'lu-lock',
  },
  {
    title: 'Custom Slots',
    description: 'Custom activator and item slots',
    route: '/auto-completes/custom',
    icon: 'lu-blocks',
  },
];
</script>

<template>
  <div data-cy="auto-completes-index">
    <h2
      data-cy="auto-completes"
      class="text-2xl font-bold mb-6"
    >
      Auto Completes
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
