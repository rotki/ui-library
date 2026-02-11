<script lang="ts" setup>
import type { SideNavLink } from '@/types';

const props = defineProps<{
  navigation: Array<{
    title: string;
    links: SideNavLink[];
  }>;
}>();

const route = useRoute();

const { navigation } = toRefs(props);
const links = computed<SideNavLink[]>(() =>
  get(navigation).flatMap(section => section.links),
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
  <div :class="$style.nav">
    <dl :class="$style.nav__list">
      <div v-if="previousPage">
        <dt :class="$style.nav__item">
          Previous
        </dt>
        <dd class="mt-1">
          <RouterLink
            :class="$style.nav__link"
            :to="previousPage.to"
          >
            <span aria-hidden="true">&larr;</span> {{ previousPage.title }}
          </RouterLink>
        </dd>
      </div>
      <div
        v-if="nextPage"
        :class="$style.nav__next"
      >
        <dt :class="$style.nav__item">
          Next
        </dt>
        <dd class="mt-1">
          <RouterLink
            :class="$style.nav__link"
            :to="nextPage.to"
          >
            {{ nextPage.title }} <span aria-hidden="true">&rarr;</span>
          </RouterLink>
        </dd>
      </div>
    </dl>
  </div>
</template>

<style lang="scss" module>
.nav {
  @apply flex-auto py-4;

  &__list {
    @apply mt-12 flex border-t border-slate-100 pt-6;
  }

  &__item {
    @apply text-sm font-medium text-slate-900;
  }

  &__next {
    @apply ml-auto text-right;
  }

  &__link {
    @apply text-base font-semibold text-slate-500 hover:text-slate-600;
  }
}

:global(.dark) {
  .nav {
    &__list {
      @apply border-slate-800;
    }

    &__item {
      @apply text-white;
    }

    &__link {
      @apply text-slate-400 hover:text-slate-300;
    }
  }
}
</style>
