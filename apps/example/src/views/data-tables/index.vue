<script lang="ts" setup>
import { RuiCard, RuiIcon } from '@rotki/ui-library/components';
import { RouterLink } from 'vue-router';

const sections = [
  {
    title: 'Basic',
    description: 'Column definitions, auto-generated columns, outlined, dense, striped',
    route: '/data-tables/basic',
    icon: 'lu-table',
  },
  {
    title: 'Sorting',
    description: 'Single and multi-column sorting',
    route: '/data-tables/sorting',
    icon: 'lu-arrow-up-down',
  },
  {
    title: 'Pagination',
    description: 'Page navigation and items per page',
    route: '/data-tables/pagination',
    icon: 'lu-chevrons-left-right-ellipsis',
  },
  {
    title: 'Search',
    description: 'Filtering rows with search input',
    route: '/data-tables/search',
    icon: 'lu-search',
  },
  {
    title: 'Selection',
    description: 'Row selection with checkboxes',
    route: '/data-tables/selection',
    icon: 'lu-square-check',
  },
  {
    title: 'Expandable',
    description: 'Expandable rows with custom content',
    route: '/data-tables/expandable',
    icon: 'lu-chevron-down',
  },
  {
    title: 'Grouping',
    description: 'Group rows by column values',
    route: '/data-tables/grouping',
    icon: 'lu-group',
  },
  {
    title: 'Empty States',
    description: 'Empty and loading states',
    route: '/data-tables/empty',
    icon: 'lu-inbox',
  },
];
</script>

<template>
  <div data-cy="data-tables-index">
    <h2
      data-cy="datatables"
      class="text-2xl font-bold mb-6"
    >
      Data Tables
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
