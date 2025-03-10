<script lang="ts" setup>
import ComponentView from '@/components/ComponentView.vue';
import { type LogoProps, RuiIcon, type RuiIcons, RuiLogo } from '@rotki/ui-library';

const icons = ref<{ name: RuiIcons; size: number }[]>([
  { name: 'lu-moon', size: 24 },
  { name: 'lu-sun', size: 24 },
  { name: 'lu-arrow-right', size: 24 },
]);

const logos = ref<(LogoProps & { name: string })[]>([
  { name: 'Default' },
  { name: 'Custom', logo: 'drawer' },
  { name: 'Custom failed fallback to default', logo: 'nonExistingKey' },
  { name: 'Custom failed fallback to default with app name', logo: 'nonExistingKey', text: true },
  { name: 'Default with app name', text: true },
  { name: 'Custom with app name', logo: 'emptyScreen', text: true },
]);
</script>

<template>
  <ComponentView data-cy="icons">
    <template #title>
      Icons
    </template>

    <div class="grid gap-4 grid-rows-2 grid-cols-6">
      <RuiIcon
        v-for="(icon, i) in icons"
        :key="i"
        v-bind="icon"
      />
    </div>

    <h2
      class="text-h4 mb-6"
      data-cy="logos"
    >
      rotki Logo
    </h2>

    <div class="grid gap-4 grid-rows-2 grid-cols-3">
      <div
        v-for="(logo, i) in logos"
        :key="i"
      >
        <RuiLogo
          v-bind="logo"
        />
        <div class="mt-4">
          {{ logo.name }}
        </div>
      </div>
    </div>
  </ComponentView>
</template>
