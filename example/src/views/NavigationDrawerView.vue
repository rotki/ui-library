<script lang="ts" setup>
import { ref } from 'vue';
import { type NavigationDrawerProps, RuiButton, RuiNavigationDrawer } from '@rotki/ui-library';
import ComponentView from '@/components/ComponentView.vue';

interface ExtraProperties {
  label: string;
}

type NavigationDrawerData = NavigationDrawerProps & ExtraProperties;
const navigationDrawers = ref<NavigationDrawerData[]>([
  { modelValue: false, label: 'Left', temporary: true },
  { modelValue: false, label: 'Right', position: 'right', temporary: true },
  { modelValue: false, label: 'Persistent', temporary: false },
  { modelValue: false, label: 'With Overlay', temporary: true, overlay: true },
]);
</script>

<template>
  <ComponentView data-cy="navigation-drawers">
    <template #title>
      Navigation Drawers
    </template>

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
  </ComponentView>
</template>
