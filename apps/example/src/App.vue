<script lang="ts" setup>
import { RouterView } from 'vue-router';
import AppFooter from '@/components/AppFooter.vue';
import AppFootNav from '@/components/AppFootNav.vue';
import AppNav from '@/components/AppNav.vue';
import AppSideNav from '@/components/AppSideNav.vue';

const navigation = ref([
  {
    title: 'Components',
    links: [
      { to: '/', title: 'Buttons' },
      { to: '/icons', title: 'Icons' },
      { to: '/checkboxes', title: 'Checkboxes' },
      { to: '/switches', title: 'Switches' },
      { to: '/radios', title: 'Radio' },
      { to: '/text-fields', title: 'Text Fields' },
      { to: '/text-areas', title: 'Text Areas' },
      { to: '/sliders', title: 'Sliders' },
      { to: '/auto-completes', title: 'Auto Complete' },
      { to: '/steppers', title: 'Steppers' },
      { to: '/progress', title: 'Progress' },
      { to: '/loaders', title: 'Loaders' },
      { to: '/chips', title: 'Chips' },
      { to: '/alerts', title: 'Alerts' },
      { to: '/tooltips', title: 'Tooltips' },
      { to: '/menus', title: 'Menus' },
      { to: '/menu-selects', title: 'Menu Selects' },
      { to: '/simple-selects', title: 'Simple Selects' },
      { to: '/data-tables', title: 'Data Tables' },
      { to: '/dividers', title: 'Dividers' },
      { to: '/cards', title: 'Cards' },
      { to: '/tabs', title: 'Tabs' },
      { to: '/badges', title: 'Badges' },
      { to: '/accordions', title: 'Accordions' },
      { to: '/dialogs', title: 'Dialogs' },
      { to: '/bottom-sheets', title: 'Bottom Sheets' },
      { to: '/color-pickers', title: 'Color Picker' },
      { to: '/navigation-drawers', title: 'Navigation Drawer' },
      { to: '/notification', title: 'Notification' },
      { to: '/calendars', title: 'Calendars' },
      { to: '/datetimepickers', title: 'Date Time Pickers' },
      { to: '/timepickers', title: 'Time Pickers' },
    ],
  },
  {
    title: 'Utilities',
    links: [
      {
        to: '/breakpoint',
        title: 'Breakpoint',
      },
    ],
  },
]);
</script>

<template>
  <AppNav />
  <main
    :class="$style.main"
    class="wrapper"
  >
    <div class="relative flex">
      <div class="relative flex-none">
        <div :class="$style.sidenav">
          <AppSideNav :navigation="navigation" />
        </div>
      </div>

      <div class="flex flex-col grow space-y-6 justify-between">
        <RouterView />

        <div>
          <AppFootNav :navigation="navigation" />
          <AppFooter />
        </div>
      </div>
    </div>
  </main>
</template>

<style lang="scss" module>
.main {
  @apply flex flex-col pt-8;
  min-height: calc(100vh - 4.5rem);

  .content {
    min-height: calc(100% - 8rem);
  }
}

.sidenav {
  @apply sticky top-[4.5rem] -ml-0.5 mr-4 h-[calc(100vh-6.5rem)] w-56 overflow-y-auto overflow-x-hidden py-8 pl-0.5 pr-8;
}
</style>
