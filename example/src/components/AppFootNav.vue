<script lang="ts" setup>
import type { SideNavLink } from '@/types';

const props = defineProps<{
  navigation: Array<{
    title: string;
    links: SideNavLink[];
  }>;
}>();

const route = useRoute();
const css = useCssModule();

const { navigation } = toRefs(props);
const links = computed(() =>
  get(navigation).flatMap(section => section.links),
);
const currentPage = computed(() =>
  get(links).find(link => link.to.name === route.name),
);
const currentPageIndex = computed(() => {
  const current = get(currentPage);
  return current ? get(links).indexOf(current) : -1;
});

const hasPrev = computed(() => get(currentPageIndex) > 0);
const hasNext = computed(() => get(currentPageIndex) < get(links).length);

const previousPage = computed(
  () => get(hasPrev) && get(links)[get(currentPageIndex) - 1],
);

const nextPage = computed(
  () => get(hasNext) && get(links)[get(currentPageIndex) + 1],
);
</script>

<template>
  <div :class="css.nav">
    <dl :class="css.nav__list">
      <div v-if="previousPage">
        <dt :class="css.nav__item">
          Previous
        </dt>
        <dd class="mt-1">
          <RouterLink
            :class="css.nav__link"
            :to="previousPage.to"
          >
            <span aria-hidden="true">&larr;</span> {{ previousPage.title }}
          </RouterLink>
        </dd>
      </div>
      <div
        v-if="nextPage"
        :class="css.nav__next"
      >
        <dt :class="css.nav__item">
          Next
        </dt>
        <dd class="mt-1">
          <RouterLink
            :class="css.nav__link"
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
