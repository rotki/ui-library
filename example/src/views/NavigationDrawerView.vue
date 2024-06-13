<script lang="ts" setup>
import { ref } from 'vue';
import { type NavigationDrawerProps, RuiButton, RuiNavigationDrawer } from '@rotki/ui-library';

interface ExtraProperties {
  label: string;
}

type NavigationDrawerData = NavigationDrawerProps & ExtraProperties;
const navigationDrawers = ref<NavigationDrawerData[]>([
  { modelValue: false, label: 'Left', temporary: true },
  { modelValue: false, label: 'Right', position: 'right', temporary: true },
  { modelValue: false, label: 'Persistent', temporary: false },
]);
</script>

<template>
  <div>
    <h2
      class="text-h4 mb-6"
      data-cy="navigation-drawers"
    >
      Navigation Drawers
    </h2>
    <div class="grid gap-4 grid-cols-2">
      <div
        v-for="(navigationDrawer, i) in navigationDrawers"
        :key="i"
        :data-cy="`navigation-drawer-${i}`"
      >
        <RuiNavigationDrawer
          v-bind="navigationDrawer"
          v-model="navigationDrawer.modelValue"
          content-class="!top-16"
        >
          <template #activator="{ attrs }">
            <RuiButton
              color="primary"
              data-cy="activator"
              v-bind="attrs"
            >
              {{ navigationDrawer.label }}
            </RuiButton>
          </template>

          <div class="p-4">
            {{ navigationDrawer.label }} Navigation Drawer
          </div>
        </RuiNavigationDrawer>
      </div>
    </div>
  </div>
</template>
