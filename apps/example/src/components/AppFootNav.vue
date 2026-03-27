<script lang="ts" setup>
import type { SideNavLink } from '@/types';

const { navigation } = defineProps<{
  navigation: Array<{
    title: string;
    links: SideNavLink[];
  }>;
}>();

const route = useRoute();

const links = computed<SideNavLink[]>(() =>
  navigation.flatMap(section => section.links),
);
const currentPage = computed<SideNavLink | undefined>(() =>
  get(links).find(link => link.to === route.path),
);
const currentPageIndex = computed<number>(() => {
  const current = get(currentPage);
  return current ? get(links).indexOf(current) : -1;
});

const hasPrev = computed<boolean>(() => get(currentPageIndex) > 0);
const hasNext = computed<boolean>(() => get(currentPageIndex) < get(links).length);

const previousPage = computed<SideNavLink | false | undefined>(
  () => get(hasPrev) && get(links)[get(currentPageIndex) - 1],
);

const nextPage = computed<SideNavLink | false | undefined>(
  () => get(hasNext) && get(links)[get(currentPageIndex) + 1],
);
</script>

<template>
  <div class="flex-auto py-4">
    <dl class="mt-12 flex border-t border-slate-100 dark:border-slate-800 pt-6">
      <div v-if="previousPage">
        <dt class="text-sm font-medium text-slate-900 dark:text-white">
          Previous
        </dt>
        <dd class="mt-1">
          <RouterLink
            class="text-base font-semibold text-slate-500 dark:text-slate-400 hover:text-slate-600 dark:hover:text-slate-300"
            :to="previousPage.to"
          >
            <span aria-hidden="true">&larr;</span> {{ previousPage.title }}
          </RouterLink>
        </dd>
      </div>
      <div
        v-if="nextPage"
        class="ml-auto text-right"
      >
        <dt class="text-sm font-medium text-slate-900 dark:text-white">
          Next
        </dt>
        <dd class="mt-1">
          <RouterLink
            class="text-base font-semibold text-slate-500 dark:text-slate-400 hover:text-slate-600 dark:hover:text-slate-300"
            :to="nextPage.to"
          >
            {{ nextPage.title }} <span aria-hidden="true">&rarr;</span>
          </RouterLink>
        </dd>
      </div>
    </dl>
  </div>
</template>
