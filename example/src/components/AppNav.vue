<script lang="ts" setup>
import { RuiButton, RuiButtonGroup, RuiIcon, type RuiIcons, ThemeMode, useRotkiTheme } from '@rotki/ui-library';

const { switchThemeScheme, store } = useRotkiTheme();

interface Theme {
  name: string;
  value: ThemeMode;
  icon: RuiIcons;
}

const themes: Theme[] = [
  { name: 'Light', value: ThemeMode.light, icon: 'sun-line' },
  { name: 'Dark', value: ThemeMode.dark, icon: 'moon-line' },
  { name: 'System', value: ThemeMode.auto, icon: 'macbook-line' },
];

const onSwitchTheme = ({ value }: Theme) => switchThemeScheme(value);
</script>

<template>
  <header :class="$style.header">
    <div
      :class="$style['header-wrapper']"
      class="wrapper"
    >
      <RouterLink
        :to="{ name: 'buttons' }"
        aria-label="Home page"
        class="flex items-center space-x-3"
      >
        <img
          alt="rotki"
          class="h-8"
          src="../assets/logo.png"
        />
      </RouterLink>
      <div
        class="relative flex basis-0 justify-end gap-6 sm:gap-8 md:flex-grow"
      >
        <span class="sr-only">Theme</span>
        <RuiButtonGroup
          v-model="store"
          color="primary"
          required
        >
          <RuiButton
            v-for="theme in themes"
            :key="theme.value"
            :model-value="theme.value"
            @click="onSwitchTheme(theme)"
          >
            <RuiIcon
              :name="theme.icon"
              :size="16"
            />
          </RuiButton>
        </RuiButtonGroup>
      </div>
    </div>
  </header>
</template>

<style lang="scss" module>
.header {
  @apply sticky top-0 z-50 flex flex-wrap items-center bg-white shadow-md shadow-slate-900/5;
  @apply transition duration-500 py-5;
}

.header-wrapper {
  @apply flex flex-wrap items-center justify-between;
}

:global(.dark) {
  .header {
    @apply bg-[#272727] shadow-none;
  }
}
</style>
