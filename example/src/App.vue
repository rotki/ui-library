<script lang="ts" setup>
import { RouterView } from 'vue-router';
import { useCssModule } from 'vue';
import AppNav from '@/components/AppNav.vue';
import AppFooter from '@/components/AppFooter.vue';

const css = useCssModule();
</script>

<template>
  <app-nav />
  <main :class="css.main" class="wrapper">
    <router-view />
  </main>
  <app-footer />
</template>

<style lang="scss" module>
.main {
  @apply flex flex-col py-8;
  min-height: calc(100vh - 4.75rem - 4rem);
}
</style>
