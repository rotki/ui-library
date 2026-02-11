<script lang="ts" setup>
import { RuiButton, RuiNavigationDrawer } from '@rotki/ui-library';
import ComponentView from '@/components/ComponentView.vue';

interface NavigationDrawerItem {
  label: string;
  modelValue: boolean;
  temporary?: boolean;
  stateless?: boolean;
  width?: string | number;
  miniVariant?: boolean;
  overlay?: boolean;
  position?: 'left' | 'right';
  ariaLabel?: string;
}

const navigationDrawers = ref<NavigationDrawerItem[]>([
  { modelValue: false, label: 'Left', temporary: true, ariaLabel: 'Left navigation' },
  { modelValue: false, label: 'Right', position: 'right', temporary: true, ariaLabel: 'Right navigation' },
  { modelValue: false, label: 'Persistent', temporary: false, ariaLabel: 'Persistent navigation' },
  { modelValue: false, label: 'With Overlay', temporary: true, overlay: true, ariaLabel: 'Overlay navigation' },
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
