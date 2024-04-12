<script lang="ts" setup>
import { type LogoProps, RuiIcon, RuiLogo } from '@rotki/ui-library';

const icons = ref([
  { name: 'moon-line', size: 24 },
  { name: 'sun-line', size: 24 },
  { name: 'arrow-right-line', size: 24 },
]);

const logos = ref<(LogoProps & { name: string })[]>([
  { name: 'Default' },
  { name: 'Custom', customSrc: 'https://raw.githubusercontent.com/rotki/data/hohoho/assets/icons/drawer_logo.png' },
  { name: 'Custom failed fallback to default', customSrc: 'https://raw.githubusercontent.com/rotki/data/hohoho/assets/icons/drawer_logo' },
  { name: 'Custom failed fallback to default with app name', customSrc: 'https://raw.githubusercontent.com/rotki/data/hohoho/assets/icons/drawer_logo', text: true },
  { name: 'Default with app name', text: true },
  { name: 'Custom with app name', customSrc: 'https://raw.githubusercontent.com/rotki/data/main/assets/icons/drawer_logo.png', text: true },
]);
</script>

<template>
  <div>
    <h2
      class="text-h4 mb-6"
      data-cy="icons"
    >
      Icons
    </h2>
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
  </div>
</template>
