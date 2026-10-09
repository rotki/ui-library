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
  belowAppBar?: boolean;
}

const navigationDrawers = ref<NavigationDrawerItem[]>([
  { modelValue: false, label: 'Left', temporary: true, belowAppBar: true, ariaLabel: 'Left navigation' },
  { modelValue: false, label: 'Right', position: 'right', temporary: true, belowAppBar: true, ariaLabel: 'Right navigation' },
  { modelValue: false, label: 'Persistent', temporary: false, belowAppBar: true, ariaLabel: 'Persistent navigation' },
  { modelValue: false, label: 'With Overlay', temporary: true, overlay: true, belowAppBar: true, ariaLabel: 'Overlay navigation' },
  { modelValue: false, label: 'Overlay Over App Bar', temporary: true, overlay: true, ariaLabel: 'Full height navigation' },
]);
</script>

<template>
  <ComponentView data-id="navigation-drawers">
    <template #title>
      Navigation Drawers
    </template>

    <div class="grid gap-4 grid-cols-2">
      <div
        v-for="(navigationDrawer, i) in navigationDrawers"
        :key="i"
        :data-id="`navigation-drawer-${i}`"
      >
        <RuiNavigationDrawer
          v-bind="navigationDrawer"
          v-model="navigationDrawer.modelValue"
        >
          <template #activator="{ attrs }">
            <RuiButton
              color="primary"
              data-id="activator"
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
