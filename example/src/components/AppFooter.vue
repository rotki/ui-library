<script lang="ts" setup>
const year = new Date().getFullYear();
</script>

<template>
  <footer
    :class="$style.footer"
    class="wrapper"
  >
    &copy; {{ year }} Rotki
  </footer>
</template>

<style lang="scss" module>
.footer {
  @apply flex flex-wrap items-center justify-center text-slate-900 sm:px-6 lg:px-8 px-4 py-5 border-t-2 border-slate-100;
}

:global(.dark) {
  .footer {
    @apply text-white border-slate-800;
  }
}
</style>
