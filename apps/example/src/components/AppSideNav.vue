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
  <nav :class="$style.navigation">
    <ul
      class="space-y-9"
      role="list"
    >
      <li
        v-for="(section, i) in navigation"
        :key="i"
      >
        <h2 :class="$style.section__title">
          {{ section.title }}
        </h2>
        <ul
          :class="$style.section__menu"
          role="list"
        >
          <li
            v-for="(link, j) in section.links"
            :key="j"
            class="relative"
          >
            <RouterLink
              :class="[
                $style.link,
                link.to !== route.path ? $style.link__inactive : '',
              ]"
              :exact-active-class="$style.link__active"
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

<style lang="scss" module>
.navigation {
  @apply text-base lg:text-sm;

  .section {
    &__title {
      @apply font-medium text-slate-900;
    }

    &__menu {
      @apply mt-2 space-y-2 border-l-2 border-slate-100 lg:mt-4 lg:space-y-4 lg:border-slate-200;

      .link {
        @apply block w-full pl-3.5 before:pointer-events-none before:absolute before:-left-1 before:top-1/2;
        @apply before:h-1.5 before:w-1.5 before:-translate-y-1/2 before:rounded-full before:transition-all;

        &__inactive {
          @apply text-slate-500 before:hidden before:bg-slate-300 hover:text-slate-600 hover:before:block;
        }

        &__active {
          @apply font-semibold text-sky-500 before:bg-sky-500;
        }
      }
    }
  }
}

:global(.dark) {
  .navigation {
    .section {
      &__title {
        @apply text-white;
      }

      &__menu {
        @apply border-slate-800;

        .link {
          &__inactive {
            @apply text-slate-400 before:bg-slate-700 hover:text-slate-300;
          }
        }
      }
    }
  }
}
</style>
