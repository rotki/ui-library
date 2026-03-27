<script lang="ts" setup>
import type { SideNavLink } from '@/types';

defineProps<{
  navigation: Array<{
    title: string;
    links: SideNavLink[];
  }>;
}>();

const route = useRoute();
</script>

<template>
  <nav class="text-base lg:text-sm">
    <ul
      class="space-y-9"
      role="list"
    >
      <li
        v-for="(section, i) in navigation"
        :key="i"
      >
        <h2 class="font-medium text-slate-900 dark:text-white">
          {{ section.title }}
        </h2>
        <ul
          class="mt-2 space-y-2 border-l-2 border-slate-100 dark:border-slate-800 lg:mt-4 lg:space-y-4 lg:border-slate-200"
          role="list"
        >
          <li
            v-for="(link, j) in section.links"
            :key="j"
            class="relative"
          >
            <RouterLink
              class="block w-full pl-3.5 before:pointer-events-none before:absolute before:-left-1 before:top-1/2 before:h-1.5 before:w-1.5 before:-translate-y-1/2 before:rounded-full before:transition-all"
              :class="{
                'text-slate-500 dark:text-slate-400 before:hidden before:bg-slate-300 dark:before:bg-slate-700 hover:text-slate-600 dark:hover:text-slate-300 hover:before:block': link.to !== route.path,
              }"
              exact-active-class="font-semibold text-sky-500 before:bg-sky-500"
              :to="link.to"
            >
              {{ link.title }}
            </RouterLink>
          </li>
        </ul>
      </li>
    </ul>
  </nav>
</template>
