<script lang="ts" setup>
import { RouterView } from 'vue-router';
import { ref, useCssModule } from 'vue';
import AppNav from '@/components/AppNav.vue';
import AppFooter from '@/components/AppFooter.vue';
import AppSideNav from '@/components/AppSideNav.vue';
import AppFootNav from '@/components/AppFootNav.vue';

const navigation = ref([
  {
    title: 'Components',
    links: [
      { to: { name: 'buttons' }, title: 'Buttons' },
      { to: { name: 'icons' }, title: 'Icons' },
      { to: { name: 'checkboxes' }, title: 'Checkboxes' },
      { to: { name: 'radios' }, title: 'Radio' },
      { to: { name: 'text-fields' }, title: 'Text Fields' },
      { to: { name: 'auto-complete' }, title: 'Auto Complete' },
      { to: { name: 'steppers' }, title: 'Steppers' },
      { to: { name: 'progress' }, title: 'Progress' },
      { to: { name: 'chips' }, title: 'Chips' },
      { to: { name: 'alerts' }, title: 'Alerts' },
      { to: { name: 'tooltips' }, title: 'Tooltips' },
      { to: { name: 'data-tables' }, title: 'Data Tables' },
      { to: { name: 'dialogs' }, title: 'Dialogs' },
      { to: { name: 'cards' }, title: 'Cards' },
      { to: { name: 'tabs' }, title: 'Tabs' },
    ],
  },
]);

const css = useCssModule();
</script>

<template>
  <AppNav />
  <main :class="css.main" class="wrapper">
    <div class="relative flex">
      <div class="relative flex-none">
        <div :class="css.sidenav">
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
