<script lang="ts" setup>
import { RuiButton, RuiButtonGroup, RuiIcon, type RuiIcons, ThemeMode, useRotkiTheme } from '@rotki/ui-library';

const { switchThemeScheme, store } = useRotkiTheme();

interface Theme {
  name: string;
  value: ThemeMode;
  icon: RuiIcons;
}

const themes: Theme[] = [
  { name: 'Light', value: ThemeMode.light, icon: 'lu-sun' },
  { name: 'Dark', value: ThemeMode.dark, icon: 'lu-moon' },
  { name: 'System', value: ThemeMode.auto, icon: 'lu-monitor' },
];

const onSwitchTheme = ({ value }: Theme) => switchThemeScheme(value);
</script>

<template>
  <header class="sticky top-0 z-50 flex flex-wrap items-center bg-white dark:bg-[#272727] shadow-md dark:shadow-none shadow-slate-900/5 transition duration-500 py-5">
    <div class="wrapper flex flex-wrap items-center justify-between">
      <RouterLink
        to="/"
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
