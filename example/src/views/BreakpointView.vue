<script setup lang="ts">
import ComponentView from '@/components/ComponentView.vue';
import { RuiChip, useBreakpoint } from '@rotki/ui-library';

const {
  name,
  width,
  isXs,
  isSm,
  isMd,
  isLg,
  isXl,
  is2xl,
  isXsAndUp,
  isSmAndUp,
  isMdAndUp,
  isLgAndUp,
  isXlAndUp,
  is2xlAndUp,
  isXsAndDown,
  isSmAndDown,
  isMdAndDown,
  isLgAndDown,
  isXlAndDown,
  is2xlAndDown,
} = useBreakpoint();

const groups = computed(() => [
  [
    { name: 'Name', value: get(name) },
    { name: 'Width', value: get(width) },
  ],
  [
    { name: 'isXs', value: get(isXs) },
    { name: 'isSm', value: get(isSm) },
    { name: 'isMd', value: get(isMd) },
    { name: 'isLg', value: get(isLg) },
    { name: 'isXl', value: get(isXl) },
    { name: 'is2xl', value: get(is2xl) },
  ],
  [
    { name: 'isXsAndUp', value: get(isXsAndUp) },
    { name: 'isSmAndUp', value: get(isSmAndUp) },
    { name: 'isMdAndUp', value: get(isMdAndUp) },
    { name: 'isLgAndUp', value: get(isLgAndUp) },
    { name: 'isXlAndUp', value: get(isXlAndUp) },
    { name: 'is2xlAndUp', value: get(is2xlAndUp) },
  ],
  [
    { name: 'isXsAndDown', value: get(isXsAndDown) },
    { name: 'isSmAndDown', value: get(isSmAndDown) },
    { name: 'isMdAndDown', value: get(isMdAndDown) },
    { name: 'isLgAndDown', value: get(isLgAndDown) },
    { name: 'isXlAndDown', value: get(isXlAndDown) },
    { name: 'is2xlAndDown', value: get(is2xlAndDown) },
  ],
]);
</script>

<template>
  <ComponentView data-cy="breakpoint">
    <template #title>
      Breakpoint
    </template>

    <h5 class="text-h5 mb-8 text-rui-text-secondary">
      Resize the browser window!
    </h5>
    <div>
      <div class="grid sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        <div
          v-for="(group, i) in groups"
          :key="i"
          class="flex flex-col gap-1"
        >
          <div
            v-for="(item, j) in group"
            :key="j"
            class="flex gap-4 items-center"
          >
            <span class="text-subtitle-2 font-bold">{{ item.name }}:</span>
            <RuiChip
              tile
              size="sm"
              :color="item.value === true ? 'primary' : undefined"
            >
              {{ item.value }}
            </RuiChip>
          </div>
        </div>
      </div>
    </div>
  </ComponentView>
</template>
